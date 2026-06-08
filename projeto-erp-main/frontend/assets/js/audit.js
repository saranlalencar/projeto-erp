// ============================================================
// audit.js — Módulo de auditoria e registro de eventos
// Grava ações do usuário no localStorage para rastreabilidade
// ============================================================

const Audit = (() => {
  const KEY = 'audit_log';
  const MAX_ENTRIES = 1000;

  /**
   * Registra uma ação no log de auditoria.
   * @param {string} action - Identificador da ação (ex: 'login', 'user_deleted')
   * @param {object} [data={}] - Dados adicionais do evento
   */
  function log(action, data = {}) {
    const user = Session.getUser();
    const entry = {
      id: crypto.randomUUID(),
      action,
      userId: user ? user.id : null,
      userEmail: user ? user.email : null,
      data,
      timestamp: new Date().toISOString(),
    };

    const log = Storage.get(KEY) || MockData.auditLog;
    log.unshift(entry);
    if (log.length > MAX_ENTRIES) log.splice(MAX_ENTRIES);
    Storage.set(KEY, log);
  }

  /**
   * Retorna todos os registros de auditoria.
   * @param {{ userId?: string, action?: string, limit?: number }} [filters]
   * @returns {Array}
   */
  function getAll(filters = {}) {
    let entries = Storage.get(KEY) || MockData.auditLog;

    if (filters.userId) {
      entries = entries.filter(e => e.userId === filters.userId);
    }
    if (filters.action) {
      entries = entries.filter(e => e.action === filters.action);
    }
    if (filters.limit) {
      entries = entries.slice(0, filters.limit);
    }
    return entries;
  }

  /**
   * Limpa o log de auditoria (somente admin).
   */
  function clear() {
    Permissions.guard('audit', 'view');
    Storage.remove(KEY);
  }

  return { log, getAll, clear };
})();
