import React from 'react';

/** White surface card — 8px radius, subtle border + shadow. The base container. */
export function Card({ padding = 'var(--space-6)', children, style, ...rest }) {
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Optional card header row with title + actions, separated by a divider. */
export function CardHeader({ title, subtitle, actions, style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        paddingBottom: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--border-default)',
        ...style,
      }}
      {...rest}
    >
      <div>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', margin: 0 }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
