import React from 'react';

/** Fixed dark navigation rail (240px). Compose with SidebarItem. */
export function Sidebar({ brand = 'VORTEX', children, footer, style, ...rest }) {
  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minHeight: '100%',
        background: 'var(--bg-sidebar)',
        color: 'var(--sidebar-text)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 20px',
          borderBottom: '1px solid var(--sidebar-border)',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 30, height: 30, borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 200 200" fill="none">
            <g transform="translate(100,100)" strokeLinecap="round">
              <path d="M -60,0 A 60,60 0 1,1 0,60" stroke="#fff" strokeWidth="16" />
              <path d="M -38,0 A 38,38 0 1,1 0,38" stroke="#fff" strokeWidth="12" opacity="0.7" />
              <path d="M -19,0 A 19,19 0 1,1 0,19" stroke="#fff" strokeWidth="8" />
              <circle cx="0" cy="0" r="5" fill="#fff" />
            </g>
          </svg>
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-extrabold)', fontSize: 'var(--text-lg)', color: '#fff', letterSpacing: '-0.01em' }}>
          {brand}
        </span>
      </div>

      <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {children}
      </nav>

      {footer && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--sidebar-border)', flexShrink: 0 }}>
          {footer}
        </div>
      )}
    </aside>
  );
}

/** A single navigation row. Set `active` for the current route. */
export function SidebarItem({ icon, label, active = false, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        width: '100%',
        padding: '9px 12px',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--sidebar-active-bg)' : hover ? 'var(--sidebar-hover-bg)' : 'transparent',
        color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'flex', flexShrink: 0, color: active ? '#fff' : 'var(--slate-400)' }}>{icon}</span>
      {label}
    </button>
  );
}
