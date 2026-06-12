import React from 'react';

const VARIANTS = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--text-on-primary)',
    border: '1px solid var(--color-primary)',
    '--hover-bg': 'var(--color-primary-hover)',
    '--hover-border': 'var(--color-primary-hover)',
  },
  secondary: {
    background: 'var(--surface-card)',
    color: 'var(--text-body)',
    border: '1px solid var(--border-strong)',
    '--hover-bg': 'var(--slate-50)',
    '--hover-border': 'var(--border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid transparent',
    '--hover-bg': 'var(--color-primary-tint)',
    '--hover-border': 'transparent',
  },
  danger: {
    background: 'var(--danger-text)',
    color: '#fff',
    border: '1px solid var(--danger-text)',
    '--hover-bg': '#b91c1c',
    '--hover-border': '#b91c1c',
  },
};

const SIZES = {
  sm: { padding: '6px 12px', fontSize: 'var(--text-sm)', gap: 6, iconSize: 15 },
  md: { padding: '9px 16px', fontSize: 'var(--text-base)', gap: 8, iconSize: 17 },
  lg: { padding: '11px 20px', fontSize: 'var(--text-md)', gap: 9, iconSize: 18 },
};

/** Primary action button. Variants: primary | secondary | ghost | danger. */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  children,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;
  const s = SIZES[size] ?? SIZES.md;
  const { '--hover-bg': hoverBg, '--hover-border': hoverBorder, ...visual } = v;

  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'var(--font-sans)',
        fontSize: s.fontSize,
        fontWeight: 'var(--weight-semibold)',
        lineHeight: 1,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        whiteSpace: 'nowrap',
        ...visual,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = hoverBg;
        e.currentTarget.style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = visual.background;
        e.currentTarget.style.borderColor = visual.border.replace('1px solid ', '');
      }}
      {...rest}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}
