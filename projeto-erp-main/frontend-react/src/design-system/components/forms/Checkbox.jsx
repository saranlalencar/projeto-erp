import React from 'react';

/** Checkbox with label, styled to the brand primary. */
export function Checkbox({ label, checked, onChange, disabled = false, id, style, ...rest }) {
  const cbId = id || (label ? `cb-${String(label).replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <label
      htmlFor={cbId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
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
        style={{
          width: 18,
          height: 18,
          borderRadius: 'var(--radius-sm)',
          border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--border-strong)'}`,
          background: checked ? 'var(--color-primary)' : 'var(--surface-card)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all var(--duration-fast) var(--ease-standard)',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <input
        id={cbId}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {label}
    </label>
  );
}
