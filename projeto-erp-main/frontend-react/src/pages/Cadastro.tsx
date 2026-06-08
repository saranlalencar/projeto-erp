import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

export function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    if (form.password.length < 6) { setErro('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (form.password !== form.confirm) { setErro('As senhas não conferem.'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });

    if (error) {
      if (error.message.includes('already registered')) setErro('Este e-mail já está cadastrado.');
      else setErro('Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return;
    }

    // O perfil Prisma é criado automaticamente no primeiro login (middleware lazy)
    navigate('/verificar-email', { state: { email: form.email } });
    setLoading(false);
  }

  const set = (f: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px' }}>
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 4 }}>Criar conta</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 24 }}>Preencha os dados para se cadastrar</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nome completo" leadingIcon={<Icon name="users" size={16} />}
              value={form.name} onChange={set('name')} placeholder="Seu nome" required />
            <Input label="E-mail" type="email" leadingIcon={<Icon name="mail" size={16} />}
              value={form.email} onChange={set('email')} placeholder="voce@empresa.com" required />
            <Input label="Senha" type="password"
              value={form.password} onChange={set('password')} placeholder="Mínimo 6 caracteres" required />
            <Input label="Confirmar senha" type="password"
              value={form.confirm} onChange={set('confirm')} placeholder="Repita a senha" required />

            {erro && (
              <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                {erro}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 18 }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Fazer login</Link>
        </p>
        <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-xs)', marginTop: 12 }}>
          © 2026 VORTEX ERP · Vendas · Financeiro · Estoque
        </p>
      </div>
    </div>
  );
}
