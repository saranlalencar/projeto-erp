// ============================================================
// auth.js — Módulo de autenticação do Vortex ERP
// Login, logout e registro via API real (JWT)
// ============================================================

const Auth = (() => {
  /**
   * Realiza login com e-mail e senha.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{ success: boolean, user?: object, error?: string, attemptsLeft?: number }>}
   */
  async function login(email, password) {
    try {
      const data = await ApiClient.post('/auth/login', { email, password });
      Session.create(data.user, data.token);
      return { success: true, user: data.user };
    } catch (err) {
      if (err.status === 423) return { success: false, error: 'conta_bloqueada' };
      if (err.status === 401) return { success: false, error: err.error || 'credenciais_invalidas', attemptsLeft: err.data?.attemptsLeft };
      return { success: false, error: 'erro_servidor' };
    }
  }

  /**
   * Encerra a sessão do usuário atual.
   * @returns {Promise<void>}
   */
  async function logout() {
    try {
      await ApiClient.post('/auth/logout', {});
    } catch { /* JWT é stateless, ignorar falhas */ }
    Session.destroy();
    window.location.href = 'login.html';
  }

  /**
   * Registra um novo usuário.
   * @param {{ name: string, email: string, password: string }} data
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function register(data) {
    try {
      await ApiClient.post('/auth/register', data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  return { login, logout, register };
})();
