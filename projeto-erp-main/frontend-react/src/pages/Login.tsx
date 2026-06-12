import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button, Checkbox, Icon } from '../design-system/components';
import { Spinner, BrandPanel, VortexMark } from '../components/auth/AuthKit';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function Login() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [remember, setRemember] = useState(true);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [erroLogin, setErroLogin] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  function clear(campo: string) {
    setErrs((p) => ({ ...p, [campo]: '' }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (!email.trim()) ne.email = 'Informe seu e-mail.';
    else if (!isEmail(email)) ne.email = 'E-mail inválido.';
    if (!senha) ne.senha = 'Informe sua senha.';
    setErrs(ne);
    if (Object.keys(ne).length) return;

    setErroLogin('');
    setLoading(true);
    const result = await login(email, senha);
    setLoading(false);
    if (!result.success) {
      if (result.error === 'email_nao_verificado') {
        setErroLogin('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.');
      } else {
        setErroLogin('E-mail ou senha incorretos.');
      }
    }
    // Redirecionamento acontece automaticamente via "if (isAuthenticated)" acima
  }

  const temErro = Object.values(errs).some(Boolean);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <BrandPanel />

      {/* Painel direito — formulário */}
      <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#fff', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 38 }}>
            <VortexMark size={40} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>VORTEX</span>
          </div>

          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            Acesse sua conta
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 26px', lineHeight: 1.5 }}>
            Bem-vindo ao VORTEX ERP. Entre com suas credenciais.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {erroLogin && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                <Icon name="circleX" size={15} />
                {erroLogin}
              </div>
            )}
            {!erroLogin && temErro && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 14px', background: '#fef9c3', color: '#d97706', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Preencha os campos destacados para continuar.
              </div>
            )}

            <Input label="E-mail" type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); clear('email'); }}
              leadingIcon={<Icon name="mail" size={16} />}
              placeholder="voce@empresa.com"
              error={errs.email} />

            <Input label="Senha" type="password" value={senha}
              onChange={(e) => { setSenha(e.target.value); clear('senha'); }}
              placeholder="••••••••"
              error={errs.senha} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Checkbox label="Lembrar de mim" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <Link to="/esqueci-senha" style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary)', textDecoration: 'none' }}>
                Esqueceu a senha?
              </Link>
            </div>

            <div style={{ marginTop: 4 }}>
              <Button type="submit" fullWidth size="lg" disabled={loading}
                leadingIcon={loading ? <Spinner size={17} color="#fff" /> : undefined}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 20 }}>
            Não tem conta?{' '}
            <Link to="/cadastro" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Cadastre-se
            </Link>
          </p>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, marginTop: 16 }}>
            © 2026 VORTEX ERP
          </p>
        </div>
      </div>
    </div>
  );
}
