// ============================================================
// users.js — Módulo CRUD de usuários via API real
// Listar, criar, editar, bloquear e excluir usuários
// ============================================================

const Users = (() => {
  /**
   * Retorna todos os usuários.
   * @returns {Promise<Array>}
   */
  async function getAll() {
    try {
      return await ApiClient.get('/api/users');
    } catch {
      return [];
    }
  }

  /**
   * Retorna um usuário pelo ID.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  async function getById(id) {
    try {
      return await ApiClient.get(`/api/users/${id}`);
    } catch {
      return null;
    }
  }

  /**
   * Cria um novo usuário.
   * @param {{ name: string, email: string, password: string, role?: string }} data
   * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
   */
  async function create(data) {
    try {
      const result = await ApiClient.post('/api/users', data);
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  /**
   * Atualiza dados de um usuário.
   * @param {string} id
   * @param {object} data
   * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
   */
  async function update(id, data) {
    try {
      const result = await ApiClient.put(`/api/users/${id}`, data);
      return { success: true, user: result.user };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  /**
   * Remove um usuário.
   * @param {string} id
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  async function remove(id) {
    try {
      await ApiClient.del(`/api/users/${id}`);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.error || 'erro_servidor' };
    }
  }

  /**
   * Define o status de um usuário (ativo/bloqueado).
   * @param {string} id
   * @param {string} status
   * @returns {Promise<{ success: boolean, user?: object, error?: string }>}
   */
  async function setStatus(id, status) {
    return update(id, { status });
  }

  return { getAll, getById, create, update, remove, setStatus };
})();
