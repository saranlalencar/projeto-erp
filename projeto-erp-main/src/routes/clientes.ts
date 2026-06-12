import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/clientes
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const clientes = await prisma.cliente.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(clientes);
});

// GET /api/clientes/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const cliente = await prisma.cliente.findUnique({ where: { id } });
  if (!cliente) { res.status(404).json({ error: 'cliente_nao_encontrado' }); return; }
  res.json(cliente);
});

// POST /api/clientes
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { nome, email, telefone, cpfCnpj } = req.body;
  if (!nome || !email) { res.status(400).json({ error: 'campos_obrigatorios' }); return; }

  const existing = await prisma.cliente.findUnique({ where: { email } });
  if (existing) { res.status(409).json({ error: 'email_em_uso' }); return; }

  const cliente = await prisma.cliente.create({ data: { nome, email, telefone, cpfCnpj } });
  res.status(201).json(cliente);
});

// PUT /api/clientes/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const { nome, email, telefone, cpfCnpj } = req.body;

    const exists = await prisma.cliente.findUnique({ where: { id } });
    if (!exists) { res.status(404).json({ error: 'cliente_nao_encontrado' }); return; }

    const data: Record<string, unknown> = {};
    if (nome !== undefined) data.nome = nome;
    if (email !== undefined) data.email = email;
    if (telefone !== undefined) data.telefone = telefone;
    if (cpfCnpj !== undefined) data.cpfCnpj = cpfCnpj;

    const cliente = await prisma.cliente.update({ where: { id }, data });
    res.json(cliente);
  } catch {
    res.status(500).json({ error: 'erro_interno' });
  }
});

// DELETE /api/clientes/:id — apenas admin
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const exists = await prisma.cliente.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'cliente_nao_encontrado' }); return; }

  await prisma.cliente.delete({ where: { id } });
  res.json({ success: true });
});

export default router;