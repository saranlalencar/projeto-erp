// VORTEX ERP — App shell (sidebar + topbar + content). Exposes window.AppShell
(function () {
const { Sidebar, SidebarItem, Topbar, IconButton, Avatar, Button, Icon } = window.VORTEXERPDesignSystem_6c8a4b;

const NAV = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard', crumb: 'Visão Geral' },
  { key: 'clientes', icon: 'users', label: 'Clientes', crumb: 'Cadastros' },
  { key: 'estoque', icon: 'package', label: 'Estoque', crumb: 'Cadastros' },
  { key: 'vendas', icon: 'cart', label: 'Vendas', crumb: 'Operações' },
  { key: 'financeiro', icon: 'wallet', label: 'Financeiro', crumb: 'Operações' },
  { key: 'usuarios', icon: 'shield', label: 'Usuários', crumb: 'Administração' },
];

function AppShell({ active, onNavigate, onLogout, children }) {
  const current = NAV.find((n) => n.key === active) || NAV[0];
  const user = window.VORTEX_DATA.user;
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-page)' }}>
      <Sidebar
        brand="VORTEX"
        footer={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 12px' }}>
              <Avatar name={user.name} size="sm" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>{user.role}</div>
              </div>
            </div>
            <Button variant="ghost" fullWidth onClick={onLogout}
              leadingIcon={<Icon name="logout" size={16} />}
              style={{ color: '#fca5a5', justifyContent: 'flex-start' }}>
              Sair
            </Button>
          </div>
        }
      >
        {NAV.map((n) => (
          <SidebarItem key={n.key} icon={<Icon name={n.icon} size={18} />} label={n.label}
            active={active === n.key} onClick={() => onNavigate(n.key)} />
        ))}
      </Sidebar>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar
          breadcrumb={current.crumb}
          title={current.label}
          actions={
            <>
              <IconButton icon={<Icon name="search" size={18} />} label="Buscar" />
              <IconButton icon={<Icon name="bell" size={18} />} label="Notificações" />
              <div style={{ width: 1, height: 24, background: 'var(--border-default)', margin: '0 4px' }} />
              <Avatar name={user.name} size="sm" />
            </>
          }
        />
        <main style={{ flex: 1, overflowY: 'auto', padding: 'var(--content-padding)' }}>
          <div style={{ maxWidth: 'var(--content-max)', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

window.AppShell = AppShell;
window.VORTEX_NAV = NAV;
})();
