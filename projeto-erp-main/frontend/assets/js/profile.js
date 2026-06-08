// ============================================================
// profile.js — Módulo de perfil do usuário logado
// Visualização e edição de dados pessoais e avatar
// ============================================================

const Profile = (() => {
  /**
   * Retorna os dados do perfil do usuário atual.
   * @returns {object|null}
   */
  function get() {
    return Session.getUser();
  }

  /**
   * Atualiza nome e outros dados do perfil.
   * @param {{ name?: string, avatar?: string }} data
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function update(data) {
    const user = Session.getUser();
    if (!user) return { success: false, error: 'nao_autenticado' };

    const result = await Users.update(user.id, data);
    if (result.success) {
      // Atualiza a sessão mantendo o token JWT intacto
      const raw = sessionStorage.getItem('vortex_session');
      if (raw) {
        const session = JSON.parse(raw);
        session.user = { ...session.user, ...data };
        sessionStorage.setItem('vortex_session', JSON.stringify(session));
      }
    }
    return result;
  }

  /**
   * Altera a senha do usuário atual.
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function changePassword(currentPassword, newPassword) {
    const user = Session.getUser();
    if (!user) return { success: false, error: 'nao_autenticado' };

    const strength = Validators.passwordStrength(newPassword);
    if (!strength.valid) return { success: false, error: strength.errors.join(', ') };

    try {
      await ApiClient.put('/api/users/me/password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  /**
   * Renderiza o avatar do usuário atual na página.
   * @param {string} selector - Seletor CSS do elemento img
   */
  function renderAvatar(selector) {
    const user = get();
    const el = document.querySelector(selector);
    if (!el || !user) return;
    if (user.avatar) {
      el.src = user.avatar;
      el.alt = user.name;
    } else {
      el.src = 'assets/img/avatar-default.png';
      el.alt = user.name;
    }
  }

  return { get, update, changePassword, renderAvatar };
})();
