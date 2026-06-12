import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../design-system/components';
import { useAuth } from '../contexts/AuthContext';
import type { Role } from '../contexts/AuthContext';

const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
};

export function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: 'var(--radius-md)',
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Menu do perfil"
      >
        <Avatar name={user?.name ?? 'Usuário'} size="sm" />
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 200,
            overflow: 'hidden',
          }}
          role="menu"
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--border-default)',
            }}
          >
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.name ?? 'Usuário'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
              {user?.role ? ROLE_LABEL[user.role] : ''}
            </div>
          </div>

          {/* Items */}
          <div style={{ padding: '4px 0' }}>
            <DropdownItem
              onClick={() => { setOpen(false); navigate('/meu-perfil'); }}
            >
              Meu perfil
            </DropdownItem>
            <DropdownItem
              onClick={() => { setOpen(false); navigate('/meu-perfil?senha=1'); }}
            >
              Alterar senha
            </DropdownItem>

            {/* Separator */}
            <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />

            <DropdownItem danger onClick={handleLogout}>
              Sair
            </DropdownItem>
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

function DropdownItem({ children, onClick, danger = false }: DropdownItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="menuitem"
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: hovered
          ? danger
            ? 'var(--danger-bg)'
            : 'var(--surface-sunken)'
          : 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 14px',
        fontSize: 'var(--text-sm)',
        color: danger ? 'var(--danger-text)' : 'var(--text-primary)',
        fontWeight: 500,
        transition: 'background 0.1s ease',
      }}
    >
      {children}
    </button>
  );
}
