import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const initials = user?.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() ?? '?';
  const roleLabel: Record<string, string> = { admin: 'Administrador', manager: 'Gerente', user: 'Usuário' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gridTemplateRows: '64px 1fr', minHeight: '100vh' }}>

      {/* SIDEBAR */}
      <aside style={{
        gridColumn: 1, gridRow: '1 / -1',
        background: '#1e1b4b', color: '#fff',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>⚡ Vortex ERP</h2>
        </div>

        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.1)', display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#a5b4fc' }}>{roleLabel[user?.role ?? ''] ?? user?.role}</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 0' }}>
          <NavItem to="/"         icon="📊" label="Dashboard" />
          <NavItem to="/clientes" icon="👥" label="Clientes" />
          <NavItem to="/estoque"  icon="📦" label="Estoque" />
          <NavItem to="/vendas"   icon="🛒" label="Vendas" />
          {can('financeiro', 'view') && <NavItem to="/financeiro" icon="💰" label="Financeiro" />}
          {can('users', 'view')      && <NavItem to="/usuarios"   icon="🔐" label="Usuários" />}
        </nav>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px', border: '1px solid rgba(239,68,68,.4)',
            background: 'rgba(239,68,68,.15)', color: '#fca5a5', borderRadius: 8,
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
          }}>
            🚪 Sair
          </button>
        </div>
      </aside>

      {/* TOPBAR */}
      <header style={{
        gridColumn: 2, gridRow: 1,
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'center', padding: '0 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,.05)',
      }}>
        <span style={{ fontWeight: 600, color: '#111827' }}>Vortex ERP</span>
      </header>

      {/* CONTENT */}
      <main style={{ gridColumn: 2, gridRow: 2, background: '#f3f4f6', padding: 28, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <NavLink to={to} end={to === '/'} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 16px',
      color: isActive ? '#fff' : '#c7d2fe',
      background: isActive ? 'rgba(255,255,255,.1)' : 'transparent',
      borderLeft: isActive ? '3px solid #a5b4fc' : '3px solid transparent',
      fontSize: '0.875rem', fontWeight: 500,
      textDecoration: 'none', transition: 'all .15s',
    })}>
      <span style={{ width: 20, textAlign: 'center' }}>{icon}</span> {label}
    </NavLink>
  );
}
