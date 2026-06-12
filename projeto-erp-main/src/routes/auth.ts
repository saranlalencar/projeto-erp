import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = Router();

// GET /auth/me — perfil do usuário autenticado
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { res.status(404).json({ error: 'perfil_nao_encontrado' }); return; }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar, telefone: user.telefone, createdAt: user.createdAt });
});

// PATCH /auth/me — atualiza perfil do usuário autenticado
router.patch('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, telefone, role } = req.body as { name?: string; telefone?: string; role?: string };
    const userId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    if (name !== undefined && name.trim() === '') {
      res.status(400).json({ error: 'nome_obrigatorio' });
      return;
    }

    const VALID_ROLES = ['admin', 'vendedor'] as const;
    type ValidRole = typeof VALID_ROLES[number];

    const updateData: { name?: string; telefone?: string; role?: string } = {};
    if (name !== undefined) updateData.name = name.trim();
    if (telefone !== undefined) updateData.telefone = telefone;
    if (role !== undefined && isAdmin && (VALID_ROLES as readonly string[]).includes(role)) {
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {
      const current = await prisma.user.findUnique({ where: { id: userId } });
      if (!current) { res.status(404).json({ error: 'perfil_nao_encontrado' }); return; }
      res.json({ id: current.id, name: current.name, email: current.email, role: current.role, status: current.status, telefone: current.telefone });
      return;
    }

    const user = await prisma.user.update({ where: { id: userId }, data: updateData });

    // Sincroniza metadados Supabase (não-fatal: dados já foram salvos no banco)
    if (updateData.name !== undefined || updateData.role !== undefined) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { name: user.name, role: user.role as ValidRole },
        });
      } catch (supaErr) {
        console.error('[auth/me PATCH] Aviso: falha ao sincronizar Supabase metadata:', supaErr);
      }
    }

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, telefone: user.telefone });
  } catch (err) {
    console.error('[auth/me PATCH] Erro interno:', err);
    res.status(500).json({ error: 'erro_interno' });
  }
});

// POST /auth/logout — revoga a sessão Supabase (opcional, o cliente já faz isso)
router.post('/logout', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  await supabaseAdmin.auth.admin.signOut(req.headers.authorization!.slice(7));
  res.json({ success: true });
});

// POST /auth/admin-create-user — usado internamente pelo painel de Usuários
// Cria o usuário no Supabase Auth E no Prisma com o mesmo UUID
router.post('/admin-create-user', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role = 'user' } = req.body as {
    name: string; email: string; password: string; role?: string;
  };

  if (!name || !email || !password) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });

  if (error) {
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      res.status(409).json({ error: 'email_em_uso' });
    } else {
      res.status(500).json({ error: 'erro_supabase', message: error.message });
    }
    return;
  }

  const user = await prisma.user.upsert({
    where: { id: data.user.id },
    update: {},
    create: {
      id: data.user.id,
      name,
      email,
      password: 'supabase_managed',
      role,
      status: 'ativo',
      emailVerified: true,
    },
  });

  const { password: _, ...safe } = user as typeof user & { password: string };
  void _;
  res.status(201).json({ success: true, user: safe });
});

export default router;
