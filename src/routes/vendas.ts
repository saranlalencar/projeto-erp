import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

// GET /api/vendas — listar todas com cliente, funcionário e itens
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const vendas = await prisma.venda.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: true,
      funcionario: true,
      itens: { include: { produto: true } },
    },
  });
  res.json(vendas);
});

// GET /api/vendas/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params['id']);
  const venda = await prisma.venda.findUnique({
    where: { id },
    include: { cliente: true, funcionario: true, itens: { include: { produto: true } } },
  });
  if (!venda) { res.status(404).json({ error: 'venda_nao_encontrada' }); return; }
  res.json(venda);
});

// PATCH /api/vendas/:id/status — mover no Kanban
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params['id']);
  const { status } = req.body;
  const validos = ['aberto', 'em_andamento', 'concluido', 'cancelado'];
  if (!validos.includes(status)) { res.status(400).json({ error: 'status_invalido' }); return; }

  const exists = await prisma.venda.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'venda_nao_encontrada' }); return; }

  const venda = await prisma.venda.update({
    where: { id }, data: { status },
    include: { cliente: true, funcionario: true, itens: { include: { produto: true } } },
  });
  res.json({ success: true, venda });
});

export default router;
