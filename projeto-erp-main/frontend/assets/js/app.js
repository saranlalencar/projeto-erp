// ============================================================
// app.js — Ponto de entrada principal do Vortex ERP
// Inicializa o app, carrega componentes globais e roteia
// ============================================================

/**
 * Inicializa o aplicativo:
 * 1. Verifica sessão ativa
 * 2. Aplica tema salvo (dark/light)
 * 3. Inicializa componentes globais (sidebar, topbar, toast)
 * 4. Redireciona para a rota correta
 */
function initApp() {
  DarkMode.apply();
  Session.check();
  Routes.init();
}

document.addEventListener('DOMContentLoaded', initApp);
