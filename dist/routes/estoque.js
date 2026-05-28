"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
// GET /api/estoque
router.get('/', async (_req, res) => {
    const produtos = await prisma_1.default.produto.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(produtos);
});
// GET /api/estoque/:id
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const produto = await prisma_1.default.produto.findUnique({ where: { id } });
    if (!produto) {
        res.status(404).json({ error: 'produto_nao_encontrado' });
        return;
    }
    res.json(produto);
});
// POST /api/estoque
router.post('/', async (req, res) => {
    const { nome, preco, quantidade = 0 } = req.body;
    if (!nome || preco === undefined) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const produto = await prisma_1.default.produto.create({ data: { nome, preco: Number(preco), quantidade: Number(quantidade) } });
    res.status(201).json({ success: true, produto });
});
// PUT /api/estoque/:id
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { nome, preco, quantidade } = req.body;
    const exists = await prisma_1.default.produto.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'produto_nao_encontrado' });
        return;
    }
    const data = {};
    if (nome !== undefined)
        data.nome = nome;
    if (preco !== undefined)
        data.preco = Number(preco);
    if (quantidade !== undefined)
        data.quantidade = Number(quantidade);
    const produto = await prisma_1.default.produto.update({ where: { id }, data });
    res.json({ success: true, produto });
});
// DELETE /api/estoque/:id — apenas admin/manager
router.delete('/:id', (0, auth_1.requireRole)('admin', 'manager'), async (req, res) => {
    const id = Number(req.params.id);
    const exists = await prisma_1.default.produto.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'produto_nao_encontrado' });
        return;
    }
    await prisma_1.default.produto.delete({ where: { id } });
    res.json({ success: true });
});
// PATCH /api/estoque/:id/quantidade — ajustar estoque (+/-)
router.patch('/:id/quantidade', async (req, res) => {
    const id = Number(req.params.id);
    const { delta } = req.body; // delta: número inteiro positivo ou negativo
    if (delta === undefined || isNaN(Number(delta))) {
        res.status(400).json({ error: 'delta_invalido' });
        return;
    }
    const exists = await prisma_1.default.produto.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'produto_nao_encontrado' });
        return;
    }
    const novaQtd = Math.max(0, exists.quantidade + Number(delta));
    const produto = await prisma_1.default.produto.update({ where: { id }, data: { quantidade: novaQtd } });
    res.json({ success: true, produto });
});
exports.default = router;
