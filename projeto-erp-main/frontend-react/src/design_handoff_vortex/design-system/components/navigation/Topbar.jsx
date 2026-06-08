import React from 'react';

/** Top application bar (64px): page title on the left, actions on the right. */
export function Topbar({ title, breadcrumb, actions, style, ...rest }) {
  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--surface-card)',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-topbar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-8)',
        flexShrink: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {breadcrumb && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)' }}>{breadcrumb}</span>
        )}
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', letterSpacing: '-0.01em' }}>
          {title}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {actions}
      </div>
    </header>
  );
}
