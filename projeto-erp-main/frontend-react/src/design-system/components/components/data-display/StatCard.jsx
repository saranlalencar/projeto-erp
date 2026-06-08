import React from 'react';

const ICON_TONES = {
  primary: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  success: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  warning: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  danger: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
  neutral: { bg: 'var(--slate-100)', color: 'var(--slate-700)' },
};

/** KPI metric card — icon tile + value + label, used across the dashboard. */
export function StatCard({ icon, value, label, tone = 'primary', delta, style, ...rest }) {
  const t = ICON_TONES[tone] ?? ICON_TONES.primary;
  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--space-5) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            background: t.bg,
            color: t.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--text-2xl)',
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-extrabold)',
            color: 'var(--text-strong)',
            lineHeight: 1.1,
            letterSpacing: 'var(--tracking-tight)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)' }}>{label}</span>
          {delta && (
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--success-text)' }}>{delta}</span>
          )}
        </div>
      </div>
    </div>
  );
}
