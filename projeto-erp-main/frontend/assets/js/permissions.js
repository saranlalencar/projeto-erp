// ============================================================
// permissions.js — Controle de permissões por role
// Define o que cada perfil pode ver e fazer no sistema
// ============================================================

const Permissions = (() => {
  /**
   * Mapa de permissões por role.
   * Cada módulo lista as ações permitidas.
   */
  const ROLES = {
    admin: {
      users: ['view', 'create', 'edit', 'delete', 'block'],
      finance: ['view', 'create', 'edit', 'delete'],
      stock: ['view', 'create', 'edit', 'delete'],
      sales: ['view', 'create', 'edit', 'delete'],
      reports: ['view', 'export'],
      profile: ['view', 'edit'],
      audit: ['view'],
    },
    manager: {
      users: ['view', 'create', 'edit'],
      finance: ['view', 'create', 'edit'],
      stock: ['view', 'create', 'edit'],
      sales: ['view', 'create', 'edit'],
      reports: ['view', 'export'],
      profile: ['view', 'edit'],
      audit: [],
    },
    user: {
      users: [],
      finance: ['view'],
      stock: ['view'],
      sales: ['view', 'create'],
      reports: ['view'],
      profile: ['view', 'edit'],
      audit: [],
    },
  };

  /**
   * Verifica se o usuário tem a permissão necessária.
   * @param {string} module - Nome do módulo (ex: 'users')
   * @param {string} action - Ação desejada (ex: 'edit')
   * @param {object} [user] - Usuário a verificar; usa sessão atual se omitido
   * @returns {boolean}
   */
  function can(module, action, user = null) {
    const currentUser = user || Session.getUser();
    if (!currentUser) return false;
    const role = currentUser.role || 'user';
    const rolePerms = ROLES[role] || ROLES.user;
    const modulePerms = rolePerms[module] || [];
    return modulePerms.includes(action);
  }

  /**
   * Redireciona para unauthorized.html se não tiver permissão.
   * @param {string} module
   * @param {string} action
   */
  function guard(module, action) {
    if (!can(module, action)) {
      window.location.href = 'unauthorized.html';
    }
  }

  /**
   * Retorna todas as permissões de um role.
   * @param {string} role
   * @returns {object}
   */
  function getRolePermissions(role) {
    return ROLES[role] || {};
  }

  return { can, guard, getRolePermissions, ROLES };
})();
