import { Router, Request, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = Router();

// GET /auth/me — perfil do usuário autenticado
router.get('/me', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { res.status(404).json({ error: 'perfil_nao_encontrado' }); return; }
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, avatar: user.avatar });
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
    user_metadata: { name },
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
