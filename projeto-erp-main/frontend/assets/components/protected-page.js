// ============================================================
// components/protected-page.js — Guard de páginas protegidas
// Verifica sessão e permissões antes de renderizar o conteúdo
// ============================================================

/**
 * Inicializa uma página protegida verificando sessão e permissão.
 * Deve ser chamado no início de cada página interna (não pública).
 *
 * @param {{ module?: string, action?: string, onReady: function }} options
 *   - module: módulo de permissão necessário (ex: 'users')
 *   - action: ação necessária no módulo (ex: 'view')
 *   - onReady: callback executado quando autenticado e autorizado
 */
function initProtectedPage({ module = null, action = null, onReady }) {
  // Verificar sessão
  if (!Session.isActive()) {
    window.location.href = 'session-expired.html';
    return;
  }

  // Verificar permissão
  if (module && action && !Permissions.can(module, action)) {
    window.location.href = 'unauthorized.html';
    return;
  }

  // Renovar sessão
  Session.renew();

  // Renderizar componentes globais
  Sidebar.render();
  Topbar.render();
  DarkMode.apply();

  // Executar inicialização da página
  if (typeof onReady === 'function') {
    onReady(Session.getUser());
  }
}
