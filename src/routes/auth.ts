import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { sendVerificationEmail, sendRecoveryEmail, sendPasswordChangedEmail } from '../mailer';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const LOCK_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const CODE_EXPIRES_MS  = 15 * 60 * 1000;

function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  } as jwt.SignOptions);
}

function gerarCodigo(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ──────────────────────────────────────────────────────────────
// POST /auth/register
// Cria a conta e envia código de verificação por e-mail
// ──────────────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: 'email_em_uso' });
    return;
  }

  const hashed = await bcrypt.hash(password, 12);
  const code   = gerarCodigo();
  const expiry = new Date(Date.now() + CODE_EXPIRES_MS);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: 'user',
      status: 'ativo',
      emailVerified: false,
      emailVerificationCode: code,
      emailVerificationExpiry: expiry,
    },
  });

  try {
    await sendVerificationEmail(email, code, name);
  } catch (err) {
    console.error('[Mailer] Falha ao enviar e-mail de verificação:', err);
  }

  res.status(201).json({
    success: true,
    message: 'Conta criada! Verifique seu e-mail para ativar o acesso.',
  });
});

// ──────────────────────────────────────────────────────────────
// POST /auth/verify-email
// Valida o código enviado no cadastro
// ──────────────────────────────────────────────────────────────
router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.status(400).json({ error: 'codigo_invalido' });
    return;
  }

  if (user.emailVerified) {
    res.json({ success: true, message: 'E-mail já verificado.' });
    return;
  }

  if (
    user.emailVerificationCode !== code ||
    !user.emailVerificationExpiry ||
    user.emailVerificationExpiry < new Date()
  ) {
    res.status(400).json({ error: 'codigo_invalido_ou_expirado' });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpiry: null,
    },
  });

  res.json({ success: true, message: 'E-mail verificado! Você já pode fazer login.' });
});

// ──────────────────────────────────────────────────────────────
// POST /auth/resend-verification
// Reenvia o código de verificação
// ──────────────────────────────────────────────────────────────
router.post('/resend-verification', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  res.json({ success: true }); // sempre retorna sucesso (evita enumeração)

  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) return;

  const code   = gerarCodigo();
  const expiry = new Date(Date.now() + CODE_EXPIRES_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationCode: code, emailVerificationExpiry: expiry },
  });

  try {
    await sendVerificationEmail(email, code, user.name);
  } catch (err) {
    console.error('[Mailer] Falha ao reenviar verificação:', err);
  }
});

// ──────────────────────────────────────────────────────────────
// POST /auth/login
// Verifica credenciais e se o e-mail foi confirmado
// ──────────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    res.status(401).json({ error: 'credenciais_invalidas' });
    return;
  }

  // Bloqueio por tentativas
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    res.status(423).json({ error: 'conta_bloqueada', lockedUntil: user.lockedUntil });
    return;
  }

  // Bloqueio manual pelo admin
  if (user.status === 'bloqueado') {
    res.status(423).json({ error: 'conta_bloqueada' });
    return;
  }

  const senhaCorreta = await bcrypt.compare(password, user.password);

  if (!senhaCorreta) {
    const attempts = user.loginAttempts + 1;
    const lock = attempts >= LOCK_ATTEMPTS ? new Date(Date.now() + LOCK_DURATION_MS) : null;
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: attempts, lockedUntil: lock ?? undefined },
    });
    const attemptsLeft = Math.max(0, LOCK_ATTEMPTS - attempts);
    res.status(401).json({ error: 'credenciais_invalidas', attemptsLeft });
    return;
  }

  // Verificar se o e-mail foi confirmado
  if (!user.emailVerified) {
    res.status(403).json({ error: 'email_nao_verificado' });
    return;
  }

  // Login bem-sucedido — zera tentativas
  await prisma.user.update({
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

// ──────────────────────────────────────────────────────────────
// POST /auth/logout
// ──────────────────────────────────────────────────────────────
router.post('/logout', requireAuth, (_req: AuthRequest, res: Response): void => {
  res.json({ success: true });
});

// ──────────────────────────────────────────────────────────────
// POST /auth/forgot-password
// ──────────────────────────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  res.json({ success: true }); // sempre retorna sucesso

  if (!email) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const code     = gerarCodigo();
  const expiresAt = new Date(Date.now() + CODE_EXPIRES_MS);

  await prisma.passwordResetCode.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  await prisma.passwordResetCode.create({
    data: { userId: user.id, code, expiresAt },
  });

  try {
    await sendRecoveryEmail(email, code);
  } catch (err) {
    console.error('[Mailer] Falha ao enviar e-mail de recuperação:', err);
  }
});

// ──────────────────────────────────────────────────────────────
// POST /auth/validate-code
// ──────────────────────────────────────────────────────────────
router.post('/validate-code', async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(400).json({ error: 'codigo_invalido' });
    return;
  }

  const record = await prisma.passwordResetCode.findFirst({
    where: { userId: user.id, code, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    res.status(400).json({ error: 'codigo_invalido' });
    return;
  }

  const resetToken = jwt.sign(
    { id: user.id, email: user.email, purpose: 'password_reset', codeId: record.id },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' } as jwt.SignOptions
  );

  res.json({ success: true, resetToken });
});

// ──────────────────────────────────────────────────────────────
// POST /auth/reset-password
// Redefine a senha e envia e-mail de confirmação
// ──────────────────────────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    res.status(400).json({ error: 'campos_obrigatorios' });
    return;
  }

  let payload: { id: string; email: string; purpose: string; codeId: number };
  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET!) as typeof payload;
  } catch {
    res.status(400).json({ error: 'token_invalido' });
    return;
  }

  if (payload.purpose !== 'password_reset') {
    res.status(400).json({ error: 'token_invalido' });
    return;
  }

  const record = await prisma.passwordResetCode.findUnique({ where: { id: payload.codeId } });
  if (!record || record.used) {
    res.status(400).json({ error: 'codigo_expirado' });
    return;
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  const [updatedUser] = await prisma.$transaction([
    prisma.user.update({
      where: { id: payload.id },
      data: { password: hashed, loginAttempts: 0, lockedUntil: null },
    }),
    prisma.passwordResetCode.update({
      where: { id: record.id },
      data: { used: true },
    }),
  ]);

  try {
    await sendPasswordChangedEmail(updatedUser.email, updatedUser.name);
  } catch (err) {
    console.error('[Mailer] Falha ao enviar e-mail de confirmação:', err);
  }

  res.json({ success: true });
});

export default router;
