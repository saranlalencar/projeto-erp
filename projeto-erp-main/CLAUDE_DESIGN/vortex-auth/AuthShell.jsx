// VORTEX Auth — Shell, Logo e elementos compartilhados. Exposes window.AuthKit
(function () {

  // ── Logo reutilizável ──────────────────────────────────────────
  function VortexMark({ size = 28, color = '#fff' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <g transform="translate(100,100)" strokeLinecap="round">
          <path d="M -60,0 A 60,60 0 1,1 0,60" stroke={color} strokeWidth="16" />
          <path d="M -38,0 A 38,38 0 1,1 0,38" stroke={color} strokeWidth="12" opacity="0.7" />
          <path d="M -19,0 A 19,19 0 1,1 0,19" stroke={color} strokeWidth="8" />
          <circle cx="0" cy="0" r="5" fill={color} />
        </g>
      </svg>
    );
  }

  function AuthLogo({ tile = true }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        {tile ? (
          <span style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <VortexMark size={28} color="#fff" />
          </span>
        ) : (
          <VortexMark size={40} color="var(--color-primary)" />
        )}
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.02em' }}>VORTEX</span>
      </div>
    );
  }

  // ── Shell comum (card centralizado) ────────────────────────────
  function AuthShell({ title, subtitle, children, footer, width = 400 }) {
    return (
      <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-page)', padding: 24 }}>
        <div style={{ width }}>
          <div style={{ marginBottom: 26 }}><AuthLogo /></div>
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 30px' }}>
            {title && <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: subtitle ? 4 : 22 }}>{title}</h1>}
            {subtitle && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 24, lineHeight: 1.5 }}>{subtitle}</p>}
            {children}
          </div>
          {footer && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 20 }}>{footer}</p>}
        </div>
      </div>
    );
  }

  // ── Alert inline (erro / sucesso / info) ───────────────────────
  function Alert({ tone = 'danger', children }) {
    const map = {
      danger: { bg: 'var(--danger-bg)', fg: 'var(--danger-text)', icon: 'circleX' },
      success: { bg: 'var(--success-bg)', fg: 'var(--success-text)', icon: 'circleCheck' },
      warning: { bg: 'var(--warning-bg)', fg: 'var(--warning-text)', icon: 'bell' },
      info: { bg: 'var(--info-bg)', fg: 'var(--info-text)', icon: 'mail' },
    };
    const { Icon } = window.VORTEXERPDesignSystem_6c8a4b;
    const t = map[tone];
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 13px', borderRadius: 'var(--radius-md)', background: t.bg, color: t.fg, fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.45 }}>
        <span style={{ display: 'flex', flexShrink: 0, marginTop: 1 }}><Icon name={t.icon} size={16} /></span>
        <span>{children}</span>
      </div>
    );
  }

  // ── Disco de status grande (sucesso / erro / spinner) ──────────
  function StatusDisc({ tone = 'success', spinning = false }) {
    const map = {
      success: { bg: 'var(--success-bg)', fg: 'var(--success-text)', icon: 'check' },
      danger: { bg: 'var(--danger-bg)', fg: 'var(--danger-text)', icon: 'x' },
      info: { bg: 'var(--info-bg)', fg: 'var(--info-text)', icon: 'mail' },
    };
    const { Icon } = window.VORTEXERPDesignSystem_6c8a4b;
    const t = map[tone];
    return (
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: t.bg, color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
        {spinning ? <Spinner color={t.fg} size={32} /> : <Icon name={t.icon} size={34} strokeWidth={2.5} />}
      </div>
    );
  }

  function Spinner({ size = 18, color = 'currentColor' }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'vtxspin 0.8s linear infinite' }} aria-label="Carregando">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="3" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // keyframes (injeta uma vez)
  if (!document.getElementById('vtx-auth-kf')) {
    const s = document.createElement('style');
    s.id = 'vtx-auth-kf';
    s.textContent = '@keyframes vtxspin{to{transform:rotate(360deg)}}';
    document.head.appendChild(s);
  }

  window.AuthKit = { VortexMark, AuthLogo, AuthShell, Alert, StatusDisc, Spinner };
})();
