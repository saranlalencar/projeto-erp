import React from 'react';

const SIZES = { sm: 30, md: 36, lg: 42 };

/** Square icon-only button — used for table row actions & topbar controls. */
export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  disabled = false,
  style,
  ...rest
}) {
  const px = SIZES[size] ?? SIZES.md;
  const variants = {
    ghost: { background: 'transparent', color: 'var(--text-muted)', hover: 'var(--slate-100)' },
    outline: { background: 'var(--surface-card)', color: 'var(--text-body)', hover: 'var(--slate-50)', border: '1px solid var(--border-default)' },
  };
  const v = variants[variant] ?? variants.ghost;
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        width: px,
        height: px,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: v.border ?? '1px solid transparent',
        background: v.background,
        color: v.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = v.hover; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = v.background; }}
      {...rest}
    >
      {icon}
    </button>
  );
}
