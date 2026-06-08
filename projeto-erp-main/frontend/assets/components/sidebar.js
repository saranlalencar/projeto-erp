// ============================================================
// components/sidebar.js — Componente de barra lateral
// Renderiza o menu de navegação conforme o role do usuário
// ============================================================

const Sidebar = (() => {
  const menuItems = [
    { label: 'Dashboard',   icon: '📊', href: 'index.html',             module: null },
    { label: 'Usuários',    icon: '👥', href: 'assets/pages/users/',    module: 'users',   action: 'view' },
    { label: 'Financeiro',  icon: '💰', href: 'assets/pages/finance/',  module: 'finance', action: 'view' },
    { label: 'Estoque',     icon: '📦', href: 'assets/pages/stock/',    module: 'stock',   action: 'view' },
    { label: 'Vendas',      icon: '🛒', href: 'assets/pages/sales/',    module: 'sales',   action: 'view' },
    { label: 'Relatórios',  icon: '📈', href: 'assets/pages/reports/',  module: 'reports', action: 'view' },
    { label: 'Meu Perfil',  icon: '👤', href: 'assets/pages/profile/',  module: 'profile', action: 'view' },
  ];

  /**
   * Renderiza a sidebar no elemento com id="app-sidebar".
   */
  function render() {
    const container = document.getElementById('app-sidebar');
    if (!container) return;

    const user = Session.getUser();
    const currentPage = Routes.getCurrentPage();

    const items = menuItems
      .filter(item => !item.module || Permissions.can(item.module, item.action))
      .map(item => {
        const isActive = currentPage === item.href.split('/').pop();
        return `
          <a href="${item.href}" class="sidebar-link ${isActive ? 'sidebar-link--active' : ''}">
            <span class="sidebar-link__icon">${item.icon}</span>
            <span class="sidebar-link__label">${item.label}</span>
          </a>
        `;
      }).join('');

    container.innerHTML = `
      <div class="sidebar-header">
        <img src="assets/img/logo.svg" alt="Vortex ERP" class="sidebar-logo" />
        <span class="sidebar-brand">Vortex ERP</span>
      </div>
      <nav class="sidebar-nav">${items}</nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <img src="${user?.avatar || 'assets/img/avatar-default.png'}" alt="${user?.name}" class="sidebar-avatar" />
          <div>
            <div class="sidebar-user__name">${user?.name || '—'}</div>
            <div class="sidebar-user__role">${user?.role || ''}</div>
          </div>
        </div>
        <button onclick="Auth.logout()" class="sidebar-logout" title="Sair">⏻</button>
      </div>
    `;
  }

  return { render };
})();
