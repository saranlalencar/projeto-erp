import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button, Checkbox, Icon } from '../design-system/components';

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [remember, setRemember] = useState(true);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    const result = await login(email, senha);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErro('E-mail ou senha incorretos.');
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
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

        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px' }}>
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 4 }}>Acesse sua conta</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 24 }}>Sistema ERP Integrado</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="E-mail" type="email" value={email} leadingIcon={<Icon name="mail" size={16} />}
              onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" required />
            <Input label="Senha" type="password" value={senha}
              onChange={(e) => setSenha(e.target.value)} placeholder="••••••••" required
              error={erro || undefined} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Checkbox label="Lembrar de mim" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <Link to="/esqueci-senha" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>Esqueceu a senha?</Link>
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 18 }}>
          Não tem conta?{' '}
          <Link to="/cadastro" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Criar conta</Link>
        </p>

        <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-xs)', marginTop: 12 }}>
          © 2026 VORTEX ERP · Vendas · Financeiro · Estoque
        </p>
      </div>
    </div>
  );
}
