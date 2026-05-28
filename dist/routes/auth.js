"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../prisma"));
const mailer_1 = require("../mailer");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const LOCK_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutos
const RESET_CODE_EXPIRES_MS = 15 * 60 * 1000;
function signToken(payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
}
// ──────────────────────────────────────────────
// POST /auth/register
// ──────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
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
    await prisma_1.default.user.create({
        data: { name, email, password: hashed, role: 'user', status: 'ativo' },
    });
    res.status(201).json({ success: true });
});
// ──────────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        res.status(401).json({ error: 'credenciais_invalidas' });
        return;
    }
    // Verificar bloqueio por tentativas
    if (user.lockedUntil && user.lockedUntil > new Date()) {
        res.status(423).json({ error: 'conta_bloqueada', lockedUntil: user.lockedUntil });
        return;
    }
    // Verificar status manual (admin bloqueou o usuário)
    if (user.status === 'bloqueado') {
        res.status(423).json({ error: 'conta_bloqueada' });
        return;
    }
    const senhaCorreta = await bcrypt_1.default.compare(password, user.password);
    if (!senhaCorreta) {
        const attempts = user.loginAttempts + 1;
        const lock = attempts >= LOCK_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : null;
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { loginAttempts: attempts, lockedUntil: lock ?? undefined },
        });
        const attemptsLeft = Math.max(0, LOCK_ATTEMPTS - attempts);
        res.status(401).json({ error: 'credenciais_invalidas', attemptsLeft });
        return;
    }
    // Reset tentativas ao fazer login com sucesso
    await prisma_1.default.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockedUntil: null },
    });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
        },
    });
});
// ──────────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────────
router.post('/logout', auth_1.requireAuth, (_req, res) => {
    // JWT é stateless; o frontend descarta o token
    res.json({ success: true });
});
// ──────────────────────────────────────────────
// POST /auth/forgot-password
// ──────────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    // Sempre retornar sucesso para evitar enumeração de e-mails
    res.json({ success: true });
    if (!email)
        return;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + RESET_CODE_EXPIRES_MS);
    // Invalidar códigos anteriores
    await prisma_1.default.passwordResetCode.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
    });
    await prisma_1.default.passwordResetCode.create({
        data: { userId: user.id, code, expiresAt },
    });
    try {
        await (0, mailer_1.sendRecoveryEmail)(email, code);
    }
    catch (err) {
        console.error('[Mailer] Falha ao enviar e-mail de recuperação:', err);
    }
});
// ──────────────────────────────────────────────
// POST /auth/validate-code
// ──────────────────────────────────────────────
router.post('/validate-code', async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        res.status(400).json({ error: 'codigo_invalido' });
        return;
    }
    const record = await prisma_1.default.passwordResetCode.findFirst({
        where: {
            userId: user.id,
            code,
            used: false,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    });
    if (!record) {
        res.status(400).json({ error: 'codigo_invalido' });
        return;
    }
    // Emitir token de reset de curta duração (15 min)
    const resetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, purpose: 'password_reset', codeId: record.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ success: true, resetToken });
});
// ──────────────────────────────────────────────
// POST /auth/reset-password
// ──────────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
        res.status(400).json({ error: 'campos_obrigatorios' });
        return;
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET);
    }
    catch {
        res.status(400).json({ error: 'token_invalido' });
        return;
    }
    if (payload.purpose !== 'password_reset') {
        res.status(400).json({ error: 'token_invalido' });
        return;
    }
    const record = await prisma_1.default.passwordResetCode.findUnique({ where: { id: payload.codeId } });
    if (!record || record.used) {
        res.status(400).json({ error: 'codigo_expirado' });
        return;
    }
    const hashed = await bcrypt_1.default.hash(newPassword, 12);
    await prisma_1.default.$transaction([
        prisma_1.default.user.update({
            where: { id: payload.id },
            data: { password: hashed, loginAttempts: 0, lockedUntil: null },
        }),
        prisma_1.default.passwordResetCode.update({
            where: { id: record.id },
            data: { used: true },
        }),
    ]);
    res.json({ success: true });
});
exports.default = router;
