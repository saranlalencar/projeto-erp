// ============================================================
// recovery.js — Fluxo de recuperação de senha
// Envia código por e-mail real via API, valida e redefine senha
// ============================================================

const Recovery = (() => {
  const RESET_TOKEN_KEY = 'vortex_reset_token';

  /**
   * Solicita envio de código de recuperação por e-mail.
   * @param {string} email
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function requestCode(email) {
    try {
      await ApiClient.post('/auth/forgot-password', { email });
      // API sempre retorna success:true para não revelar se o e-mail existe
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  /**
   * Valida o código informado pelo usuário.
   * @param {string} email
   * @param {string} code
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function validateCode(email, code) {
    try {
      const data = await ApiClient.post('/auth/validate-code', { email, code });
      // Armazena o resetToken para a próxima etapa
      sessionStorage.setItem(RESET_TOKEN_KEY, data.resetToken);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'codigo_invalido' };
    }
  }

  /**
   * Redefine a senha após validação bem-sucedida.
   * @param {string} _email - mantido para compatibilidade com a interface anterior
   * @param {string} newPassword
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function resetPassword(_email, newPassword) {
    const resetToken = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!resetToken) return { success: false, error: 'nao_validado' };

    try {
      await ApiClient.post('/auth/reset-password', { resetToken, newPassword });
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  return { requestCode, validateCode, resetPassword };
})();
