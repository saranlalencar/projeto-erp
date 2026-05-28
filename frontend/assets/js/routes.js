// ============================================================
// routes.js — Sistema de roteamento simples do SPA
// Mapeia páginas para funções de inicialização e verifica acesso
// ============================================================

const Routes = (() => {
  /**
   * Mapa de rotas: { 'pagina.html': { module, action, init } }
   * module/action definem a permissão necessária (null = público)
   */
  const routes = {
    'index.html':           { module: null, action: null, init: initDashboard },
    'login.html':           { module: null, action: null, init: null },
    'register.html':        { module: null, action: null, init: null },
    'forgot-password.html': { module: null, action: null, init: null },
    'validate-code.html':   { module: null, action: null, init: null },
    'reset-password.html':  { module: null, action: null, init: null },
    'blocked.html':         { module: null, action: null, init: null },
    'session-expired.html': { module: null, action: null, init: null },
    'unauthorized.html':    { module: null, action: null, init: null },
  };

  function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function init() {
    const page = getCurrentPage();
    const route = routes[page];
    if (!route) return;

    if (route.module && route.action) {
      Permissions.guard(route.module, route.action);
    }

    if (typeof route.init === 'function') {
      route.init();
    }
  }

  // Stubs de inicialização de páginas (implementados nos arquivos de cada módulo)
  function initDashboard() {
    console.info('[Routes] Inicializando dashboard');
  }

  return { init, getCurrentPage };
})();
