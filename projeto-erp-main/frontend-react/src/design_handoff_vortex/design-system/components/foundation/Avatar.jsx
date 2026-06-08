import React from 'react';

const SIZES = { sm: 28, md: 36, lg: 44 };

/** Circular user avatar showing initials on the brand primary. */
export function Avatar({ name = '', size = 'md', color = 'var(--color-primary)', style, ...rest }) {
  const px = SIZES[size] ?? SIZES.md;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: 'var(--radius-pill)',
        background: color,
        color: 'var(--text-on-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'var(--weight-semibold)',
        fontSize: px * 0.4,
        fontFamily: 'var(--font-sans)',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
      {...rest}
    >
      {initials}
    </div>
  );
}
