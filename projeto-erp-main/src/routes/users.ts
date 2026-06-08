import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const router = Router();
router.use(requireAuth, requireRole('admin'));

function sanitize(user: Record<string, unknown>) {
  const { password, loginAttempts, lockedUntil, ...safe } = user;
  void password; void loginAttempts; void lockedUntil;
  return safe;
}

// GET /api/users
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users.map((u) => sanitize(u as unknown as Record<string, unknown>)));
});

// POST /api/users — cria no Supabase Auth + Prisma
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
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
    if (error.message.includes('already')) res.status(409).json({ error: 'email_em_uso' });
    else res.status(500).json({ error: 'erro_supabase' });
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

  res.status(201).json({ success: true, user: sanitize(user as unknown as Record<string, unknown>) });
});

// DELETE /api/users/:id — remove do Supabase Auth + Prisma
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
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

// PATCH /api/users/:id/status
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
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
