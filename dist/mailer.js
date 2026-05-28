"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendRecoveryEmail = sendRecoveryEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS na porta 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
async function sendRecoveryEmail(to, code) {
    await exports.transporter.sendMail({
        from: `"Vortex ERP" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Código de recuperação de senha — Vortex ERP',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Recuperação de senha</h2>
        <p style="color: #555; margin-bottom: 24px;">Use o código abaixo para redefinir sua senha. Ele expira em <strong>15 minutos</strong>.</p>
        <div style="background: #f4f4f8; border-radius: 6px; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #1a1a2e;">
          ${code}
        </div>
        <p style="color: #888; font-size: 13px; margin-top: 24px;">Se você não solicitou a recuperação, ignore este e-mail.</p>
      </div>
    `,
    });
}
