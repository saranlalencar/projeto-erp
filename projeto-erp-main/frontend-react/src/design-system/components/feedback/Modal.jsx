import React from 'react';

/** Centered modal dialog over a scrim. Header, body and footer slots. */
export function Modal({ open = true, title, onClose, footer, width = 440, children, style, ...rest }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        paddingTop: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
        paddingBottom: 'var(--space-6)',
        paddingLeft: 'calc(var(--sidebar-width, 0px) + var(--space-6, 24px))',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          width,
          maxWidth: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...style,
        }}
        {...rest}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              padding: '18px 24px',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--text-strong)', margin: 0 }}>
              {title}
            </h3>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Fechar"
                style={{
                  width: 32, height: 32, border: 'none', background: 'transparent',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div style={{ padding: '22px 24px', overflowY: 'auto' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-3)',
              padding: '16px 24px',
              borderTop: '1px solid var(--border-default)',
              background: 'var(--surface-sunken)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
