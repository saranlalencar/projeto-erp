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
// GET /api/clientes
router.get('/', async (_req, res) => {
    const clientes = await prisma_1.default.cliente.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(clientes);
});
// GET /api/clientes/:id
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const cliente = await prisma_1.default.cliente.findUnique({ where: { id } });
    if (!cliente) {
        res.status(404).json({ error: 'cliente_nao_encontrado' });
        return;
    }
    res.json(cliente);
});
// POST /api/clientes
router.post('/', async (req, res) => {
    const { nome, email, telefone } = req.body;
    if (!nome || !email) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const existing = await prisma_1.default.cliente.findUnique({ where: { email } });
    if (existing) {
        res.status(409).json({ error: 'email_em_uso' });
        return;
    }
    const cliente = await prisma_1.default.cliente.create({ data: { nome, email, telefone } });
    res.status(201).json({ success: true, cliente });
});
// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { nome, email, telefone } = req.body;
    const exists = await prisma_1.default.cliente.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'cliente_nao_encontrado' });
        return;
    }
    const data = {};
    if (nome !== undefined)
        data.nome = nome;
    if (email !== undefined)
        data.email = email;
    if (telefone !== undefined)
        data.telefone = telefone;
    const cliente = await prisma_1.default.cliente.update({ where: { id }, data });
    res.json({ success: true, cliente });
});
// DELETE /api/clientes/:id — apenas admin/manager
router.delete('/:id', (0, auth_1.requireRole)('admin', 'manager'), async (req, res) => {
    const id = Number(req.params.id);
    const exists = await prisma_1.default.cliente.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'cliente_nao_encontrado' });
        return;
    }
    await prisma_1.default.cliente.delete({ where: { id } });
    res.json({ success: true });
});
exports.default = router;
