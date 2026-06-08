import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input, Button, Icon } from '../design-system/components';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 26 }}>
    <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
        <g transform="translate(100,100)" strokeLinecap="round">
          <path d="M -60,0 A 60,60 0 1,1 0,60" stroke="#fff" strokeWidth="16" />
          <path d="M -38,0 A 38,38 0 1,1 0,38" stroke="#fff" strokeWidth="12" opacity="0.7" />
          <path d="M -19,0 A 19,19 0 1,1 0,19" stroke="#fff" strokeWidth="8" />
          <circle cx="0" cy="0" r="5" fill="#fff" />
        </g>
      </svg>
    </span>
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.02em' }}>VORTEX</span>
  </div>
);

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    // Sempre mostra sucesso (evita enumeração de e-mails)
    setEnviado(true);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px' }}>

          {enviado ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="mail" size={26} style={{ color: 'var(--success-text)' }} />
              </div>
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 10 }}>E-mail enviado!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                Se <strong>{email}</strong> estiver cadastrado, você receberá um link para redefinir a senha. Verifique também a caixa de spam.
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon name="mail" size={22} style={{ color: 'var(--warning-text)' }} />
                </div>
                <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>Esqueceu a senha?</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  Informe seu e-mail e enviaremos um link de redefinição.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Input label="E-mail cadastrado" type="email" leadingIcon={<Icon name="mail" size={16} />}
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com" required />
                <Button type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: 4 }}>
                  {loading ? 'Enviando...' : 'Enviar link'}
                </Button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 18 }}>
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
            ← Voltar ao login
          </Link>
        </p>
        <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-xs)', marginTop: 12 }}>
          © 2026 VORTEX ERP · Vendas · Financeiro · Estoque
        </p>
      </div>
    </div>
  );
}
