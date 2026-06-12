// VORTEX ERP — Login screen (split layout 60/40). Exposes window.LoginScreen
(function () {
const { Input, Button, Checkbox, Icon } = window.VORTEXERPDesignSystem_6c8a4b;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

function VortexMark({ size = 42, bg = '#1e40af' }) {
  const s = Math.round(size * 0.58);
  return (
    <span style={{ width: size, height: size, borderRadius: Math.round(size * 0.2), background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={s} height={s} viewBox="0 0 200 200" fill="none">
        <g transform="translate(100,100)" strokeLinecap="round">
          <path d="M -60,0 A 60,60 0 1,1 0,60" stroke="#fff" strokeWidth="18" />
          <path d="M -38,0 A 38,38 0 1,1 0,38" stroke="#fff" strokeWidth="13" opacity="0.75" />
          <path d="M -18,0 A 18,18 0 1,1 0,18" stroke="#fff" strokeWidth="8" />
          <circle cx="0" cy="0" r="5" fill="#fff" />
        </g>
      </svg>
    </span>
  );
}

const BAR_H = [42, 58, 45, 72, 54, 88, 68];

function DashIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 430, margin: '0 auto' }}>
      {/* Main mockup */}
      <div style={{
        background: 'rgba(15,23,42,0.88)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
        transform: 'perspective(1100px) rotateY(-7deg) rotateX(3deg)',
        transformOrigin: 'left center',
      }}>
        {/* Browser chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(0,0,0,0.25)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(239,68,68,0.55)', display: 'block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(245,158,11,0.55)', display: 'block' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(34,197,94,0.55)', display: 'block' }} />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 14px', fontSize: 9, color: 'rgba(148,163,184,0.5)', fontFamily: 'var(--font-sans)' }}>vortex.erp • Dashboard</div>
          </div>
        </div>
        {/* App shell */}
        <div style={{ display: 'flex', minHeight: 196 }}>
          {/* Sidebar */}
          <div style={{ width: 38, background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1e40af' }} />
            <div style={{ height: 8 }} />
            {[1, 0, 0, 0, 0].map((a, i) => (
              <div key={i} style={{ width: 18, height: 3, borderRadius: 2, background: a ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.13)' }} />
            ))}
          </div>
          {/* Content */}
          <div style={{ flex: 1, padding: '12px 14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 80, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.18)' }} />
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#1e40af' }} />
            </div>
            {/* KPI tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 10 }}>
              {[['R$ 84k','#22c55e'],['248','#3b82f6'],['7','#f59e0b'],['94%','#a78bfa']].map(([v, c], i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '7px 8px' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c, fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-display)' }}>{v}</div>
                  <div style={{ width: '55%', height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.1)', marginTop: 4 }} />
                </div>
              ))}
            </div>
            {/* Chart */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '8px 10px' }}>
              <div style={{ width: 66, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', marginBottom: 8 }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
                {BAR_H.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: h + '%', background: i === 5 ? '#1e40af' : 'rgba(59,130,246,0.28)', borderRadius: '2px 2px 0 0' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card — top right */}
      <div style={{ position: 'absolute', top: -22, right: -28, background: 'rgba(30,64,175,0.45)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(59,130,246,0.35)', borderRadius: 11, padding: '12px 16px', minWidth: 146, boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}>
        <div style={{ fontSize: 10, color: 'rgba(147,197,253,0.7)', fontFamily: 'var(--font-sans)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Última venda</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', fontVariantNumeric: 'tabular-nums' }}>R$ 5.890</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '3px 9px', background: 'rgba(34,197,94,0.22)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '9999px', marginTop: 7 }}>
          <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>↑ +18% esse mês</span>
        </div>
      </div>

      {/* Floating card — bottom left */}
      <div style={{ position: 'absolute', bottom: -16, left: -22, background: 'rgba(245,158,11,0.15)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 11, padding: '11px 14px', minWidth: 182, boxShadow: '0 8px 28px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-sans)' }}>Estoque crítico</div>
            <div style={{ fontSize: 10, color: 'rgba(148,163,184,0.65)', marginTop: 2 }}>3 produtos com saldo baixo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  return (
    <div style={{ flex: '0 0 60%', background: '#0f172a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '44px 52px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 90, background: 'linear-gradient(to right, transparent, #0f172a)', pointerEvents: 'none', zIndex: 1 }} />
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <VortexMark size={32} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>VORTEX</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase' }}>ERP</span>
      </div>
      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2, padding: '44px 0' }}>
        <DashIllustration />
      </div>
      {/* Tagline */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.25, margin: '0 0 8px' }}>
          Gestão completa<br />do seu negócio.
        </h2>
        <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13, lineHeight: 1.6, margin: '0 0 18px' }}>
          Vendas, Financeiro, Estoque e Cadastros<br />integrados em uma única plataforma.
        </p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {['Vendas', 'Financeiro', 'Estoque', 'Cadastros', 'RBAC'].map(m => (
            <span key={m} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', color: 'rgba(203,213,225,0.75)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('admin@vortex.com');
  const [senha, setSenha] = React.useState('Admin@123');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [errs, setErrs] = React.useState({});

  function clear(f) { setErrs(p => ({ ...p, [f]: undefined })); }
  const temErro = Object.values(errs).some(Boolean);

  function submit(e) {
    e.preventDefault();
    const ne = {};
    if (!email.trim()) ne.email = 'Informe seu e-mail.';
    else if (!isEmail(email)) ne.email = 'E-mail inválido.';
    if (!senha) ne.senha = 'Informe sua senha.';
    setErrs(ne);
    if (Object.keys(ne).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 620);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <BrandPanel />
      <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', background: '#fff', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 38 }}>
            <VortexMark size={40} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>VORTEX</span>
          </div>
          <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 6px' }}>Acesse sua conta</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 26px', lineHeight: 1.5 }}>Bem-vindo ao VORTEX ERP. Entre com suas credenciais.</p>

          <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {temErro && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '10px 14px', background: '#fef9c3', color: '#d97706', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Preencha os campos destacados para continuar.
              </div>
            )}
            <Input label="E-mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }}
              leadingIcon={<Icon name="mail" size={16} />} placeholder="voce@empresa.com" error={errs.email} />
            <Input label="Senha" type="password" value={senha} onChange={(e) => { setSenha(e.target.value); clear('senha'); }}
              placeholder="••••••••" error={errs.senha} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Checkbox label="Lembrar de mim" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <a href="#" style={{ fontSize: 13, fontWeight: 500, color: '#1e40af', textDecoration: 'none' }}>Esqueceu a senha?</a>
            </div>
            <div style={{ marginTop: 4 }}>
              <Button type="submit" fullWidth size="lg" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</Button>
            </div>
          </form>

          <div style={{ marginTop: 20, padding: '11px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
            <strong style={{ color: '#334155' }}>Demo:</strong> admin@vortex.com · Admin@123
          </div>
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, margin: '22px 0 0' }}>© 2026 VORTEX ERP</p>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
})();
