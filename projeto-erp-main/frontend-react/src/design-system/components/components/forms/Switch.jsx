import React from 'react';

/** Toggle switch — track turns navy when on. */
export function Switch({ checked, onChange, label, disabled = false, style, ...rest }) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--text-body)',
        userSelect: 'none',
        ...style,
      }}
    >
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 38,
          height: 22,
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--color-primary)' : 'var(--slate-300)',
          position: 'relative',
          flexShrink: 0,
          transition: 'background var(--duration-base) var(--ease-standard)',
        }}
        {...rest}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: 'var(--shadow-xs)',
            transition: 'left var(--duration-base) var(--ease-standard)',
          }}
        />
      </span>
      {label}
    </label>
  );
}
