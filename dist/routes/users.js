"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todos os endpoints exigem autenticação + role admin
router.use(auth_1.requireAuth, (0, auth_1.requireRole)('admin'));
function sanitize(user) {
    const { password, loginAttempts, lockedUntil, ...safe } = user;
    void password;
    void loginAttempts;
    void lockedUntil;
    return safe;
}
// GET /api/users
router.get('/', async (_req, res) => {
    const users = await prisma_1.default.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(users.map(sanitize));
});
// GET /api/users/:id
router.get('/:id', async (req, res) => {
    const id = String(req.params['id']);
    const user = await prisma_1.default.user.findUnique({ where: { id } });
    if (!user) {
        res.status(404).json({ error: 'usuario_nao_encontrado' });
        return;
    }
    res.json(sanitize(user));
});
// POST /api/users
router.post('/', async (req, res) => {
    const { name, email, password, role = 'user', status = 'ativo' } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing) {
        res.status(409).json({ error: 'email_em_uso' });
        return;
    }
    const hashed = await bcrypt_1.default.hash(password, 12);
    const user = await prisma_1.default.user.create({
        data: { name, email, password: hashed, role, status },
    });
    res.status(201).json({ success: true, user: sanitize(user) });
});
// PUT /api/users/:id
router.put('/:id', async (req, res) => {
    const id = String(req.params['id']);
    const { name, email, password, role, status, avatar } = req.body;
    const exists = await prisma_1.default.user.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'usuario_nao_encontrado' });
        return;
    }
    const data = {};
    if (name !== undefined)
        data.name = name;
    if (email !== undefined)
        data.email = email;
    if (role !== undefined)
        data.role = role;
    if (status !== undefined)
        data.status = status;
    if (avatar !== undefined)
        data.avatar = avatar;
    if (password)
        data.password = await bcrypt_1.default.hash(password, 12);
    const user = await prisma_1.default.user.update({ where: { id }, data });
    res.json({ success: true, user: sanitize(user) });
});
// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
    const id = String(req.params['id']);
    if (id === req.user?.id) {
        res.status(400).json({ error: 'auto_delecao_proibida' });
        return;
    }
    const exists = await prisma_1.default.user.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'usuario_nao_encontrado' });
        return;
    }
    await prisma_1.default.user.delete({ where: { id } });
    res.json({ success: true });
});
// PATCH /api/users/:id/status
router.patch('/:id/status', async (req, res) => {
    const id = String(req.params['id']);
    const { status } = req.body;
    if (!['ativo', 'bloqueado'].includes(status)) {
        res.status(400).json({ error: 'status_invalido' });
        return;
    }
    const exists = await prisma_1.default.user.findUnique({ where: { id } });
    if (!exists) {
        res.status(404).json({ error: 'usuario_nao_encontrado' });
        return;
    }
    const user = await prisma_1.default.user.update({ where: { id }, data: { status } });
    res.json({ success: true, user: sanitize(user) });
});
// PUT /api/users/me/password  — troca de senha do próprio usuário
router.put('/me/password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const user = await prisma_1.default.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
        res.status(404).json({ error: 'usuario_nao_encontrado' });
        return;
    }
    const ok = await bcrypt_1.default.compare(currentPassword, user.password);
    if (!ok) {
        res.status(401).json({ error: 'senha_atual_incorreta' });
        return;
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 12);
    await prisma_1.default.user.update({ where: { id: user.id }, data: { password: hashed } });
    res.json({ success: true });
});
exports.default = router;
