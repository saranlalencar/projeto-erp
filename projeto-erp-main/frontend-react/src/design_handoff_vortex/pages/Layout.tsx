import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar, SidebarItem, Topbar, IconButton, Avatar, Button, Icon } from '../design-system/components';

// Maps each route to its sidebar icon + topbar breadcrumb.
const NAV = [
  { to: '/dashboard',  icon: 'dashboard', label: 'Dashboard',  crumb: 'Visão Geral' },
  { to: '/clientes',   icon: 'users',     label: 'Clientes',   crumb: 'Cadastros' },
  { to: '/estoque',    icon: 'package',   label: 'Estoque',    crumb: 'Cadastros' },
  { to: '/vendas',     icon: 'cart',      label: 'Vendas',     crumb: 'Operações' },
  { to: '/financeiro', icon: 'wallet',    label: 'Financeiro', crumb: 'Operações' },
  { to: '/usuarios',   icon: 'shield',    label: 'Usuários',   crumb: 'Administração' },
] as const;

/**
 * App shell: dark Sidebar (240px) + white Topbar (64px) + routed content.
 * Replaces the previous hand-rolled <aside>/<header> markup. Business logic
 * (auth, routing) is unchanged — only the presentation moved to DS components.
 */
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Derive the active route from the URL so the active item + breadcrumb stay in sync.
  const path = window.location.pathname;
  const current = NAV.find((n) => path.startsWith(n.to)) ?? NAV[0];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <Sidebar
        brand="VORTEX"
        footer={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 12px' }}>
              <Avatar name={user?.nome ?? 'Usuário'} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.nome}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{user?.perfil}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              fullWidth
              leadingIcon={<Icon name="logout" size={16} />}
              style={{ color: '#fca5a5', justifyContent: 'flex-start' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              Sair
            </Button>
          </div>
        }
      >
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <SidebarItem icon={<Icon name={n.icon} size={18} />} label={n.label} active={isActive} />
            )}
          </NavLink>
        ))}
      </Sidebar>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          breadcrumb={current.crumb}
          title={current.label}
          actions={
            <>
              <IconButton icon={<Icon name="bell" size={18} />} label="Notificações" />
              <div style={{ width: 1, height: 24, background: 'var(--border-default)', margin: '0 4px' }} />
              <Avatar name={user?.nome ?? 'Usuário'} size="sm" />
            </>
          }
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--content-padding)' }}>
          <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
