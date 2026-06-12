import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = `"Vortex ERP" <${process.env.SMTP_USER}>`;

const baseStyle = `
  font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;
  padding: 28px; border: 1px solid #e0e0e0; border-radius: 10px;
`;

const codeBox = (code: string) => `
  <div style="background:#f4f4f8; border-radius:8px; padding:20px; text-align:center;
    font-size:38px; font-weight:bold; letter-spacing:12px; color:#1e1b4b; margin:20px 0;">
    ${code}
  </div>
`;

// ── E-mail de verificação de conta (registro) ────────────────
export async function sendVerificationEmail(to: string, code: string, name: string): Promise<void> {
  await transporter.sendMail({
    from,
    to,
    subject: 'Confirme seu e-mail — Vortex ERP',
    html: `
      <div style="${baseStyle}">
        <h2 style="color:#1e1b4b; margin-bottom:4px;">Vortex ERP</h2>
        <h3 style="color:#374151; font-weight:500; margin-bottom:16px;">Confirme seu e-mail</h3>
        <p style="color:#555;">Olá, <strong>${name}</strong>!</p>
        <p style="color:#555; margin-bottom:8px;">
          Use o código abaixo para confirmar seu cadastro. Ele expira em <strong>15 minutos</strong>.
        </p>
        ${codeBox(code)}
        <p style="color:#888; font-size:12px; margin-top:20px;">
          Se você não criou uma conta no Vortex ERP, ignore este e-mail.
        </p>
      </div>
    `,
  });
}

// ── E-mail de recuperação de senha ───────────────────────────
export async function sendRecoveryEmail(to: string, code: string): Promise<void> {
  await transporter.sendMail({
    from,
    to,
    subject: 'Recuperação de senha — Vortex ERP',
    html: `
      <div style="${baseStyle}">
        <h2 style="color:#1e1b4b; margin-bottom:4px;">Vortex ERP</h2>
        <h3 style="color:#374151; font-weight:500; margin-bottom:16px;">Redefinição de senha</h3>
        <p style="color:#555; margin-bottom:8px;">
          Use o código abaixo para redefinir sua senha. Ele expira em <strong>15 minutos</strong>.
        </p>
        ${codeBox(code)}
        <p style="color:#888; font-size:12px; margin-top:20px;">
          Se você não solicitou a recuperação, ignore este e-mail.
        </p>
      </div>
    `,
  });
}

// ── E-mail de confirmação de alteração de senha ──────────────
export async function sendPasswordChangedEmail(to: string, name: string): Promise<void> {
  await transporter.sendMail({
    from,
    to,
    subject: 'Sua senha foi alterada — Vortex ERP',
    html: `
      <div style="${baseStyle}">
        <h2 style="color:#1e1b4b; margin-bottom:4px;">Vortex ERP</h2>
        <h3 style="color:#374151; font-weight:500; margin-bottom:16px;">Senha alterada com sucesso</h3>
        <p style="color:#555;">Olá, <strong>${name}</strong>!</p>
        <p style="color:#555; margin-bottom:8px;">
          Sua senha foi alterada em ${new Date().toLocaleString('pt-BR')}.
        </p>
        <p style="color:#555;">
          Se você não realizou esta alteração, entre em contato com o administrador imediatamente.
        </p>
        <p style="color:#888; font-size:12px; margin-top:20px;">
          Este é um e-mail automático. Não responda.
        </p>
      </div>
    `,
  });
}
