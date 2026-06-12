import React from 'react';
import { Icon } from '../../design-system/components';

// ── Spinner ───────────────────────────────────────────────────────
export function Spinner({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'vtxspin 0.8s linear infinite' }} aria-label="Carregando">
      <style>{`@keyframes vtxspin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ── Alert ─────────────────────────────────────────────────────────
type AlertTone = 'danger' | 'success' | 'warning' | 'info';
const alertMap: Record<AlertTone, { bg: string; fg: string; icon: string }> = {
  danger:  { bg: 'var(--danger-bg)',  fg: 'var(--danger-text)',  icon: 'circleX' },
  success: { bg: 'var(--success-bg)', fg: 'var(--success-text)', icon: 'circleCheck' },
  warning: { bg: 'var(--warning-bg)', fg: 'var(--warning-text)', icon: 'bell' },
  info:    { bg: 'var(--info-bg)',    fg: 'var(--info-text)',    icon: 'mail' },
};

export function Alert({ tone = 'danger', children }: { tone?: AlertTone; children: React.ReactNode }) {
  const t = alertMap[tone];
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '11px 13px', borderRadius: 'var(--radius-md)',
      background: t.bg, color: t.fg,
      fontSize: 'var(--text-sm)', fontWeight: 500, lineHeight: 1.45,
    }}>
      <span style={{ display: 'flex', flexShrink: 0, marginTop: 1 }}>
        <Icon name={t.icon} size={16} />
      </span>
      <span>{children}</span>
    </div>
  );
}

// ── StatusDisc ────────────────────────────────────────────────────
type DiscTone = 'success' | 'danger' | 'info';
const discMap: Record<DiscTone, { bg: string; fg: string; icon: string }> = {
  success: { bg: 'var(--success-bg)', fg: 'var(--success-text)', icon: 'check' },
  danger:  { bg: 'var(--danger-bg)',  fg: 'var(--danger-text)',  icon: 'x' },
  info:    { bg: 'var(--info-bg)',    fg: 'var(--info-text)',    icon: 'mail' },
};

export function StatusDisc({ tone = 'success', spinning = false }: { tone?: DiscTone; spinning?: boolean }) {
  const t = discMap[tone];
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: t.bg, color: t.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 20px',
    }}>
      {spinning
        ? <Spinner color={t.fg} size={32} />
        : <Icon name={t.icon} size={34} strokeWidth={2.5} />
      }
    </div>
  );
}

// ── VortexMark ────────────────────────────────────────────────────
export function VortexMark({ size = 42 }: { size?: number }) {
  const s = Math.round(size * 0.58);
  return (
    <span style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.2),
      background: 'var(--color-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
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

// ── DashIllustration (internal) ───────────────────────────────────
const BAR_H = [42, 58, 45, 72, 54, 88, 68];

function DashIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 430, margin: '0 auto' }}>
      <div style={{
        background: 'rgba(15,23,42,0.88)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 14, overflow: 'hidden',
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
            <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 14px', fontSize: 9, color: 'rgba(148,163,184,0.5)', fontFamily: 'var(--font-sans)' }}>
              vortex.erp • Dashboard
            </div>
          </div>
        </div>
        {/* App shell */}
        <div style={{ display: 'flex', minHeight: 196 }}>
          <div style={{ width: 38, background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)' }} />
            <div style={{ height: 8 }} />
            {[1, 0, 0, 0, 0].map((a, i) => (
              <div key={i} style={{ width: 18, height: 3, borderRadius: 2, background: a ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.13)' }} />
            ))}
          </div>
          <div style={{ flex: 1, padding: '12px 14px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 80, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.18)' }} />
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--color-primary)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5, marginBottom: 10 }}>
              {[['R$ 84k', '#22c55e'], ['248', '#3b82f6'], ['7', '#f59e0b'], ['94%', '#a78bfa']].map(([v, c], i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '7px 8px' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: c, fontFamily: 'var(--font-display)' }}>{v}</div>
                  <div style={{ width: '55%', height: 2, borderRadius: 1, background: 'rgba(255,255,255,0.1)', marginTop: 4 }} />
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 7, padding: '8px 10px' }}>
              <div style={{ width: 66, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)', marginBottom: 8 }} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40 }}>
                {BAR_H.map((h, i) => (
                  <div key={i} style={{ flex: 1, height: h + '%', background: i === 5 ? 'var(--color-primary)' : 'rgba(59,130,246,0.28)', borderRadius: '2px 2px 0 0' }} />
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

// ── BrandPanel ────────────────────────────────────────────────────
export function BrandPanel() {
  return (
    <div style={{ flex: '0 0 60%', background: '#0f172a', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '44px 52px' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.1) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 90, background: 'linear-gradient(to right, transparent, #0f172a)', pointerEvents: 'none', zIndex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <VortexMark size={32} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>VORTEX</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase' as const }}>ERP</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2, padding: '44px 0' }}>
        <DashIllustration />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.25, margin: '0 0 8px' }}>
          Gestão completa<br />do seu negócio.
        </h2>
        <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 13, lineHeight: 1.6, margin: '0 0 18px' }}>
          Vendas, Financeiro, Estoque e Cadastros<br />integrados em uma única plataforma.
        </p>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' as const }}>
          {['Vendas', 'Financeiro', 'Estoque', 'Cadastros', 'RBAC'].map((m) => (
            <span key={m} style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', color: 'rgba(203,213,225,0.75)', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-sans)' }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AuthShell — layout 60/40 (BrandPanel + formulário) ───────────
interface AuthShellProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export function AuthShell({ title, subtitle, children, footer, maxWidth = 360 }: AuthShellProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', overflow: 'hidden' }}>
      <BrandPanel />

      {/* Painel direito — 40% */}
      <div style={{
        flex: '0 0 40%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
        background: '#fff',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <VortexMark size={40} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>VORTEX</span>
          </div>

          {title && (
            <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
              {title}
            </h1>
          )}
          {subtitle && (
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 26px', lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}

          {children}

          {footer && (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13, marginTop: 22 }}>
              {footer}
            </p>
          )}

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 11, marginTop: 20 }}>
            © 2026 VORTEX ERP
          </p>
        </div>
      </div>
    </div>
  );
}
