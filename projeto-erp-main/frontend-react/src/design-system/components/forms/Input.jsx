import React from 'react';

function EyeOpen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/** Text input with label, optional leading icon, error state, and password visibility toggle. */
export function Input({ label, hint, error, leadingIcon, id, style, containerStyle, type, ...rest }) {
  const isPassword = type === 'password';
  const [showPassword, setShowPassword] = React.useState(false);
  const [eyeHovered, setEyeHovered] = React.useState(false);

  const inputId = id || (label ? `in-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const paddingLeft = leadingIcon ? '36px' : '12px';
  const paddingRight = isPassword ? '38px' : '12px';

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
          type={resolvedType}
          style={{
            width: '100%',
            padding: `9px ${paddingRight} 9px ${paddingLeft}`,
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
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setShowPassword((v) => !v)}
            onMouseEnter={() => setEyeHovered(true)}
            onMouseLeave={() => setEyeHovered(false)}
            style={{
              position: 'absolute',
              right: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 2,
              color: eyeHovered ? 'var(--text-body)' : 'var(--text-muted)',
              transition: 'color 0.15s',
            }}
          >
            {showPassword ? <EyeOpen /> : <EyeOff />}
          </button>
        )}
      </div>
      {error ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--danger-text)' }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{hint}</span>
      ) : null}
    </div>
  );
}
