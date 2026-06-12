import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

function gerarSenhaTemporaria(): string {
  const lower  = 'abcdefghjkmnpqrstuvwxyz';
  const upper  = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  const digits = '23456789';
  const all    = lower + upper + digits;
  const pick   = (s: string) => s[Math.floor(Math.random() * s.length)];
  let pass = pick(upper) + pick(lower) + pick(digits) + '!';
  for (let i = 0; i < 6; i++) pass += pick(all);
  return pass.split('').sort(() => Math.random() - 0.5).join('');
}

const router = Router();
router.use(requireAuth);

function sanitize(user: Record<string, unknown>) {
  const { password, loginAttempts, lockedUntil, ...safe } = user;
  void password; void loginAttempts; void lockedUntil;
  return safe;
}

// GET /api/users — somente admin
router.get('/', requireRole('admin'), async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users.map((u) => sanitize(u as unknown as Record<string, unknown>)));
});

// POST /api/users — somente admin pode convidar usuários
router.post('/', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, role = 'user' } = req.body as {
      name: string; email: string; role?: string;
    };

    if (!name || !email) {
      res.status(400).json({ error: 'campos_obrigatorios' });
      return;
    }

    // Verifica duplicata antes de chamar o Supabase
    const existente = await prisma.user.findUnique({ where: { email } });
    if (existente) {
      res.status(409).json({ error: 'email_em_uso' });
      return;
    }

    const senhaTemporaria = gerarSenhaTemporaria();

    // Cria usuário com senha temporária e e-mail já confirmado.
    // Admin repassa a senha ao usuário, que pode alterá-la no primeiro acesso.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senhaTemporaria,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('already') || msg.includes('registered')) {
        res.status(409).json({ error: 'email_em_uso' });
      } else {
        console.error('[POST /api/users] createUser:', error.message);
        res.status(500).json({ error: 'erro_supabase', detail: error.message });
      }
      return;
    }

    const user = await prisma.user.upsert({
      where: { id: data.user.id },
      update: { name, role },
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

    res.status(201).json({
      success: true,
      user: sanitize(user as unknown as Record<string, unknown>),
      senhaTemporaria,
    });
  } catch (err) {
    console.error('[POST /api/users] erro interno:', err);
    res.status(500).json({ error: 'erro_interno', detail: String(err) });
  }
});

// DELETE /api/users/:id — somente admin pode remover
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  if (id === req.user?.id) {
    res.status(400).json({ error: 'auto_delecao_proibida' });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  await supabaseAdmin.auth.admin.deleteUser(id);
  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

// PATCH /api/users/:id/status — somente admin pode bloquear/ativar
router.patch('/:id/status', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  const { status } = req.body as { status: string };
  if (!['ativo', 'bloqueado'].includes(status)) {
    res.status(400).json({ error: 'status_invalido' });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  const user = await prisma.user.update({ where: { id }, data: { status } });
  res.json({ success: true, user: sanitize(user as unknown as Record<string, unknown>) });
});

export default router;
