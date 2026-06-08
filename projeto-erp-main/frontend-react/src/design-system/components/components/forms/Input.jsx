import React from 'react';

/** Text input with label, optional leading icon, and error state. */
export function Input({ label, hint, error, leadingIcon, id, style, containerStyle, ...rest }) {
  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--text-body)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leadingIcon && (
          <span style={{ position: 'absolute', left: 11, color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none' }}>
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: '100%',
            padding: leadingIcon ? '9px 12px 9px 36px' : '9px 12px',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-strong)',
            background: 'var(--surface-card)',
            border: `1px solid ${error ? 'var(--danger-text)' : 'var(--border-strong)'}`,
            borderRadius: 'var(--radius-md)',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger-text)' : 'var(--color-primary)';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'var(--danger-bg)' : 'var(--focus-ring)'}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? 'var(--danger-text)' : 'var(--border-strong)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...rest}
        />
      </div>
      {error ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger-text)' }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
}
