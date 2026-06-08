import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { VendaModel } from '../models/VendaModel';

const router = Router();
router.use(requireAuth);

// GET /api/vendas — listar todas com cliente, funcionário e itens
router.get('/', async (_req: AuthRequest, res: Response): Promise<void> => {
  const vendas = await prisma.venda.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cliente:     true,
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

// POST /api/vendas — criar nova venda (VendaModel.create valida estoque e debita)
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { clienteId, funcionarioId, itens } = req.body as {
    clienteId: number;
    funcionarioId?: number;
    itens: Array<{ produtoId: number; quantidade: number }>;
  };

  if (!clienteId || !itens || itens.length === 0) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  try {
    const modelo = await VendaModel.create({ clienteId, funcionarioId, itens });

    // Retornar a venda criada com todas as relações incluídas
    const venda = await prisma.venda.findUnique({
      where: { id: modelo.id },
      include: { cliente: true, funcionario: true, itens: { include: { produto: true } } },
    });

    res.status(201).json({ success: true, venda });
  } catch (err: unknown) {
    const e = err as { message?: string; produto?: string; disponivel?: number; produtoId?: number };
    if (e.message === 'estoque_insuficiente') {
      res.status(422).json({ error: 'estoque_insuficiente', produto: e.produto, disponivel: e.disponivel });
    } else if (e.message === 'produto_nao_encontrado') {
      res.status(404).json({ error: 'produto_nao_encontrado', produtoId: e.produtoId });
    } else {
      res.status(500).json({ error: 'erro_interno' });
    }
  }
});

// PATCH /api/vendas/:id/status — mover no Kanban (usa VendaModel.updateStatus)
router.patch('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params['id']);
  const { status } = req.body as { status: string };

  const registro = await prisma.venda.findUnique({ where: { id } });
  if (!registro) { res.status(404).json({ error: 'venda_nao_encontrada' }); return; }

  try {
    const venda = new VendaModel(registro);
    await venda.updateStatus(status);

    const atualizada = await prisma.venda.findUnique({
      where: { id },
      include: { cliente: true, funcionario: true, itens: { include: { produto: true } } },
    });
    res.json({ success: true, venda: atualizada });
  } catch (err: unknown) {
    const e = err as { message?: string };
    if (e.message === 'status_invalido') res.status(400).json({ error: 'status_invalido' });
    else res.status(500).json({ error: 'erro_interno' });
  }
});

export default router;
