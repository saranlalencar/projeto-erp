import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar, SidebarItem, Topbar, IconButton, Avatar, Button, Icon } from '../design-system/components';

const NAV = [
  { to: '/dashboard',  icon: 'dashboard', label: 'Dashboard',  crumb: 'Visão Geral' },
  { to: '/clientes',   icon: 'users',     label: 'Clientes',   crumb: 'Cadastros' },
  { to: '/estoque',    icon: 'package',   label: 'Estoque',    crumb: 'Cadastros' },
  { to: '/vendas',     icon: 'cart',      label: 'Vendas',     crumb: 'Operações' },
  { to: '/financeiro', icon: 'wallet',    label: 'Financeiro', crumb: 'Operações' },
  { to: '/usuarios',   icon: 'shield',    label: 'Usuários',   crumb: 'Administração' },
] as const;

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const path = window.location.pathname;
  const current = NAV.find((n) => path.startsWith(n.to)) ?? NAV[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      {/* Sidebar fixo na lateral esquerda */}
      <Sidebar
        brand="VORTEX"
        style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 }}
        footer={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 12px' }}>
              <Avatar name={user?.name ?? 'Usuário'} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{user?.role}</div>
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

      {/* Área de conteúdo deslocada pela largura do sidebar fixo */}
      <div style={{ marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Topbar fixo no topo */}
        <div style={{ position: 'sticky', top: 0, zIndex: 40 }}>
          <Topbar
            breadcrumb={current.crumb}
            title={current.label}
            actions={
              <>
                <IconButton icon={<Icon name="bell" size={18} />} label="Notificações" />
                <div style={{ width: 1, height: 24, background: 'var(--border-default)', margin: '0 4px' }} />
                <Avatar name={user?.name ?? 'Usuário'} size="sm" />
              </>
            }
          />
        </div>

        {/* Conteúdo centralizado */}
        <main style={{ flex: 1, padding: 'var(--content-padding)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}
