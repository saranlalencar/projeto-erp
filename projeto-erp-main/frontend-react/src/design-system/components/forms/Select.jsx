import React from 'react';

/** Native select styled to match Input, with a chevron affordance. */
export function Select({ label, hint, error, options = [], id, style, containerStyle, children, ...rest }) {
  const selId = id || (label ? `sel-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
      {label && (
        <label htmlFor={selId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-body)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <select
          id={selId}
          style={{
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            padding: '9px 36px 9px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-strong)',
            background: 'var(--surface-card)',
            border: `1px solid ${error ? 'var(--danger-text)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 3px var(--focus-ring)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger-text)' : 'var(--border-strong)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...rest}
        >
          {children || options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const labelTxt = typeof o === 'string' ? o : o.label;
            return <option key={value} value={value}>{labelTxt}</option>;
          })}
        </select>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: 11, pointerEvents: 'none' }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger-text)' }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
}
