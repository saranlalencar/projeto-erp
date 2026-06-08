import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../design-system/components';

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

export function VerificarEmail() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
      <div style={{ width: 420 }}>
        <Logo />
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Icon name="mail" size={30} style={{ color: 'var(--success-text)' }} />
          </div>

          <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: 10 }}>Verifique seu e-mail</h1>

          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 8 }}>
            Enviamos um link de confirmação para{' '}
            {email
              ? <><br /><strong style={{ color: 'var(--text-strong)' }}>{email}</strong><br /></>
              : 'o seu endereço de e-mail'
            }.
          </p>

          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 28 }}>
            Clique no link do e-mail para ativar sua conta. Verifique também a caixa de spam caso não encontre.
          </p>

          <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 28 }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
              Após clicar no link, você será redirecionado automaticamente e poderá fazer login normalmente.
            </p>
          </div>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
              <Icon name="arrowLeft" size={14} />
              Voltar ao login
            </div>
          </Link>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: 'var(--text-xs)', marginTop: 20 }}>
          © 2026 VORTEX ERP · Vendas · Financeiro · Estoque
        </p>
      </div>
    </div>
  );
}
