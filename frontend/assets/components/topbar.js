// ============================================================
// components/topbar.js — Componente de barra superior
// Título da página, toggle de dark mode, avatar e logout
// ============================================================

const Topbar = (() => {
  /**
   * Renderiza a topbar no elemento com id="app-topbar".
   * @param {string} [title] - Título da página atual
   */
  function render(title = '') {
    const container = document.getElementById('app-topbar');
    if (!container) return;

    const user = Session.getUser();

    container.innerHTML = `
      <div class="topbar-left">
        <button class="topbar-menu-toggle" id="sidebar-toggle" aria-label="Abrir menu">☰</button>
        <h2 class="topbar-title">${title}</h2>
      </div>
      <div class="topbar-right">
        <button class="darkmode-toggle" onclick="DarkMode.toggle()" title="Alternar tema">
          <span class="darkmode-toggle__icon">🌙</span>
          <span class="darkmode-toggle__label">Modo escuro</span>
        </button>
        <div class="topbar-user">
          <img src="${user?.avatar || 'assets/img/avatar-default.png'}" alt="${user?.name}" class="topbar-avatar" />
          <span class="topbar-user__name">${user?.name || '—'}</span>
        </div>
      </div>
    `;

    // Toggle sidebar mobile
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('app-sidebar')?.classList.toggle('is-open');
    });
  }

  return { render };
})();
