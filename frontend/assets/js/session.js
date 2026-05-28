// ============================================================
// session.js — Gerenciamento de sessão do usuário
// Criação, leitura, renovação, expiração e destruição
// ============================================================

const Session = (() => {
  const SESSION_KEY = 'vortex_session';
  const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hora

  /**
   * Cria uma nova sessão para o usuário.
   * @param {object} user
   * @param {string} token - JWT de autenticação
   */
  function create(user, token) {
    const session = {
      user,
      token,   // Armazenado para uso pelo ApiClient
      expiresAt: Date.now() + SESSION_DURATION_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  /**
   * Retorna o usuário da sessão ativa ou null.
   * @returns {object|null}
   */
  function getUser() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        destroy();
        return null;
      }
      return session.user;
    } catch {
      return null;
    }
  }

  /**
   * Verifica a sessão na página atual e redireciona se necessário.
   * Páginas públicas não exigem sessão.
   */
  function check() {
    const publicPages = ['login.html', 'register.html', 'forgot-password.html', 'validate-code.html', 'reset-password.html', 'blocked.html', 'session-expired.html', 'unauthorized.html'];
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const isPublic = publicPages.includes(page);
    const user = getUser();

    if (!isPublic && !user) {
      window.location.href = 'session-expired.html';
    } else if (isPublic && user && page !== 'unauthorized.html') {
      window.location.href = 'index.html';
    }
  }

  /**
   * Renova o tempo de expiração da sessão.
   */
  function renew() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const session = JSON.parse(raw);
      session.expiresAt = Date.now() + SESSION_DURATION_MS;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch { /* silencioso */ }
  }

  /**
   * Destrói a sessão atual.
   */
  function destroy() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /**
   * Retorna true se houver sessão ativa e válida.
   * @returns {boolean}
   */
  function isActive() {
    return getUser() !== null;
  }

  return { create, getUser, check, renew, destroy, isActive };
})();
