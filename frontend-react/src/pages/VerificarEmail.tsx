import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export function VerificarEmail() {
  const navigate = useNavigate();
  const [email, setEmail]   = useState('');
  const [code, setCode]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code });
      setSuccess(true);
    } catch (err: unknown) {
      const e = err as { error?: string };
      const msgs: Record<string, string> = {
        codigo_invalido: 'Código inválido.',
        codigo_invalido_ou_expirado: 'Código inválido ou expirado. Solicite um novo.',
        campos_obrigatorios: 'Preencha todos os campos.',
      };
      setError(msgs[e.error ?? ''] ?? 'Erro ao verificar e-mail.');
    }
    setLoading(false);
  }

  async function handleReenviar() {
    if (!email) { setError('Informe o e-mail para reenviar o código.'); return; }
    setResending(true); setResendMsg('');
    try {
      await api.post('/auth/resend-verification', { email });
      setResendMsg('✅ Novo código enviado! Verifique sua caixa de entrada.');
    } catch {
      setResendMsg('Erro ao reenviar. Tente novamente.');
    }
    setResending(false);
  }

  if (success) return (
    <div style={container}>
      <div style={card}>
        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 16 }}>✅</div>
        <h2 style={{ textAlign: 'center', color: '#065f46', marginBottom: 8 }}>E-mail verificado!</h2>
        <p style={{ textAlign: 'center', color: '#374151', marginBottom: 24 }}>
          Sua conta está ativa. Você já pode fazer login.
        </p>
        <button onClick={() => navigate('/login')} style={btnPrimary}>Ir para o Login</button>
      </div>
    </div>
  );

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={{ textAlign: 'center', marginBottom: 4, fontSize: '1.4rem', color: '#1e1b4b' }}>⚡ Vortex ERP</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 500, color: '#6b7280', marginBottom: 28 }}>
          Confirme seu e-mail
        </h2>
        <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: 20, textAlign: 'center' }}>
          Digite o código de 6 dígitos que enviamos para o seu e-mail no momento do cadastro.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>E-mail</label>
            <input type="email" required placeholder="seu@email.com"
              value={email} onChange={e => setEmail(e.target.value)} style={input} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Código de verificação</label>
            <input type="text" required placeholder="000000" maxLength={6}
              value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ ...input, textAlign: 'center', fontSize: '1.4rem', letterSpacing: 10, fontWeight: 700 }} />
          </div>

          {error && <div style={erroStyle}>⚠️ {error}</div>}

          <button type="submit" disabled={loading} style={{ ...btnPrimary, width: '100%', marginBottom: 12 }}>
            {loading ? 'Verificando...' : 'Confirmar e-mail'}
          </button>
        </form>

        {resendMsg && <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 12 }}>{resendMsg}</div>}

        <button onClick={handleReenviar} disabled={resending}
          style={{ width: '100%', background: 'none', border: '1px solid #d1d5db', borderRadius: 8, padding: '9px', cursor: 'pointer', color: '#6b7280', fontSize: '0.875rem' }}>
          {resending ? 'Reenviando...' : '📧 Reenviar código'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: '#9ca3af' }}>
          <span style={{ cursor: 'pointer', color: '#4f46e5' }} onClick={() => navigate('/login')}>
            ← Voltar ao login
          </span>
        </p>
      </div>
    </div>
  );
}

const container: React.CSSProperties = { minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const card: React.CSSProperties      = { background: '#fff', borderRadius: 12, padding: '40px 36px', width: 400, boxShadow: '0 4px 20px rgba(0,0,0,.08)' };
const label: React.CSSProperties     = { display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 500, color: '#374151' };
const input: React.CSSProperties     = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const btnPrimary: React.CSSProperties = { padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' };
const erroStyle: React.CSSProperties  = { background: '#fee2e2', color: '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16 };
