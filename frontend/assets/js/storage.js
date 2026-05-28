// ============================================================
// storage.js — Abstração sobre localStorage
// Leitura, escrita, remoção e limpeza com serialização JSON
// ============================================================

const Storage = (() => {
  const PREFIX = 'vortex_';

  function _key(name) {
    return `${PREFIX}${name}`;
  }

  /**
   * Persiste um valor no localStorage.
   * @param {string} key
   * @param {*} value
   */
  function set(key, value) {
    try {
      localStorage.setItem(_key(key), JSON.stringify(value));
    } catch (e) {
      console.error('[Storage] Erro ao salvar:', key, e);
    }
  }

  /**
   * Recupera um valor do localStorage.
   * @param {string} key
   * @param {*} [fallback=null]
   * @returns {*}
   */
  function get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(_key(key));
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  /**
   * Remove uma chave do localStorage.
   * @param {string} key
   */
  function remove(key) {
    localStorage.removeItem(_key(key));
  }

  /**
   * Limpa todos os dados do Vortex ERP no localStorage.
   */
  function clear() {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  }

  return { set, get, remove, clear };
})();
