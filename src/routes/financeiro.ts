import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/financeiro  (suporta ?tipo=receita|despesa)
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { tipo } = req.query;
  const where = tipo ? { tipo: String(tipo) } : {};
  const contas = await prisma.contaFinanceira.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(contas);
});

// GET /api/financeiro/:id
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const conta = await prisma.contaFinanceira.findUnique({ where: { id } });
  if (!conta) { res.status(404).json({ error: 'conta_nao_encontrada' }); return; }
  res.json(conta);
});

// POST /api/financeiro
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { tipo, descricao, valor, pago = false } = req.body;
  if (!tipo || !descricao || valor === undefined) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const conta = await prisma.contaFinanceira.create({
    data: { tipo, descricao, valor: Number(valor), pago: Boolean(pago) },
  });
  res.status(201).json({ success: true, conta });
});

// PUT /api/financeiro/:id
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { tipo, descricao, valor, pago } = req.body;

  const exists = await prisma.contaFinanceira.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'conta_nao_encontrada' }); return; }

  const data: Record<string, unknown> = {};
  if (tipo !== undefined) data.tipo = tipo;
  if (descricao !== undefined) data.descricao = descricao;
  if (valor !== undefined) data.valor = Number(valor);
  if (pago !== undefined) data.pago = Boolean(pago);

  const conta = await prisma.contaFinanceira.update({ where: { id }, data });
  res.json({ success: true, conta });
});

// DELETE /api/financeiro/:id — apenas admin
router.delete('/:id', requireRole('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const exists = await prisma.contaFinanceira.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'conta_nao_encontrada' }); return; }

  await prisma.contaFinanceira.delete({ where: { id } });
  res.json({ success: true });
});

// PATCH /api/financeiro/:id/pago — marcar como pago/não pago
router.patch('/:id/pago', async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  const { pago } = req.body;

  if (pago === undefined) { res.status(400).json({ error: 'campo_pago_obrigatorio' }); return; }

  const exists = await prisma.contaFinanceira.findUnique({ where: { id } });
  if (!exists) { res.status(404).json({ error: 'conta_nao_encontrada' }); return; }

  const conta = await prisma.contaFinanceira.update({ where: { id }, data: { pago: Boolean(pago) } });
  res.json({ success: true, conta });
});

export default router;