import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Todos os endpoints exigem autenticação + role admin
router.use(requireAuth, requireRole('admin'));

function sanitize(user: Record<string, unknown>) {
  const { password, loginAttempts, lockedUntil, ...safe } = user;
  void password; void loginAttempts; void lockedUntil;
  return safe;
}

// GET /api/users
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(users.map(sanitize));
});

// GET /api/users/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }
  res.json(sanitize(user as unknown as Record<string, unknown>));
});

// POST /api/users
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, role = 'user', status = 'ativo' } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) { res.status(409).json({ error: 'email_em_uso' }); return; }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role, status },
  });

  res.status(201).json({ success: true, user: sanitize(user as unknown as Record<string, unknown>) });
});

// PUT /api/users/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  const { name, email, password, role, status, avatar } = req.body;

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (role !== undefined) data.role = role;
  if (status !== undefined) data.status = status;
  if (avatar !== undefined) data.avatar = avatar;
  if (password) data.password = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({ where: { id }, data });
  res.json({ success: true, user: sanitize(user as unknown as Record<string, unknown>) });
});

// DELETE /api/users/:id
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  if (id === req.user?.id) {
    res.status(400).json({ error: 'auto_delecao_proibida' });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

// PATCH /api/users/:id/status
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = String(req.params['id']);
  const { status } = req.body;
  if (!['ativo', 'bloqueado'].includes(status)) {
    res.status(400).json({ error: 'status_invalido' });
    return;
  }

  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  const user = await prisma.user.update({ where: { id }, data: { status } });
  res.json({ success: true, user: sanitize(user as unknown as Record<string, unknown>) });
});

// PUT /api/users/me/password  — troca de senha do próprio usuário
router.put('/me/password', async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) { res.status(404).json({ error: 'usuario_nao_encontrado' }); return; }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) { res.status(401).json({ error: 'senha_atual_incorreta' }); return; }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
  res.json({ success: true });
});

export default router;
