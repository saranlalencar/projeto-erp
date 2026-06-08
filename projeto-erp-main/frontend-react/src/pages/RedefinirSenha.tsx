import React, { useState, useEffect } from 'react';
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

export function RedefinirSenha() {
  const navigate = useNavigate();
  const [pronto, setPronto] = useState(false);   // session de recovery detectada
  const [sucesso, setSucesso] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirm, setConfirm] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase detecta o token de recovery no hash da URL e dispara PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPronto(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    if (senha.length < 6) { setErro('A senha deve ter no mínimo 6 caracteres.'); return; }
    if (senha !== confirm) { setErro('As senhas não conferem.'); return; }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErro('Erro ao redefinir senha. O link pode ter expirado.');
    } else {
      await supabase.auth.signOut();
      setSucesso(true);
    }
    setLoading(false);
  }

  if (sucesso) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Icon name="circleCheck" size={28} style={{ color: 'var(--success-text)' }} />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>Senha redefinida!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 24 }}>
            Sua senha foi atualizada. Você já pode fazer login.
          </p>
          <Button fullWidth size="lg" onClick={() => navigate('/login')}>Ir para o login</Button>
        </div>
      </div>
    </div>
  );

  if (!pronto) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Aguardando link de redefinição... Se chegou aqui por engano, solicite um novo link.
          </p>
          <Link to="/esqueci-senha">
            <Button fullWidth variant="secondary">Solicitar novo link</Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 400 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon name="shield" size={22} style={{ color: 'var(--success-text)' }} />
            </div>
            <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>Nova senha</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Defina sua nova senha de acesso</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nova senha" type="password"
              value={senha} onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres" required />
            <Input label="Confirmar nova senha" type="password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repita a nova senha" required />

            {erro && (
              <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                {erro}
              </div>
            )}

            <Button type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-xs)', marginTop: 20 }}>
          © 2026 VORTEX ERP · Vendas · Financeiro · Estoque
        </p>
      </div>
    </div>
  );
}
