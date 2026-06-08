import React from 'react';

const TONES = {
  neutral: { bg: 'var(--slate-100)', color: 'var(--slate-700)' },
  primary: { bg: 'var(--info-bg)', color: 'var(--info-text)' },
  success: { bg: 'var(--success-bg)', color: 'var(--success-text)' },
  warning: { bg: 'var(--warning-bg)', color: 'var(--warning-text)' },
  danger: { bg: 'var(--danger-bg)', color: 'var(--danger-text)' },
};

/** Pill status badge. Tones map to the semantic palette. */
export function Badge({ tone = 'neutral', children, dot = false, style, ...rest }) {
  const t = TONES[tone] ?? TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        background: t.bg,
        color: t.color,
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
