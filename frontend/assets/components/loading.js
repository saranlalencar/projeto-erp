// ============================================================
// components/loading.js — Componente de tela de carregamento
// Spinner global e loading states para seções específicas
// ============================================================

const Loading = (() => {
  let _overlay = null;

  function _getOverlay() {
    if (_overlay) return _overlay;
    _overlay = document.createElement('div');
    _overlay.id = 'loading-overlay';
    _overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(255,255,255,0.8);
      display:none;align-items:center;justify-content:center;
      z-index:9999;flex-direction:column;gap:1rem;
    `;
    _overlay.innerHTML = `
      <div class="spinner" style="
        width:40px;height:40px;border:4px solid #e5e7eb;
        border-top-color:var(--color-primary,#4f46e5);
        border-radius:50%;animation:spin 0.8s linear infinite;
      "></div>
      <span style="color:var(--text-secondary,#6b7280);font-size:0.875rem">Carregando...</span>
    `;
    const style = document.createElement('style');
    style.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
    document.body.appendChild(_overlay);
    return _overlay;
  }

  /**
   * Exibe o overlay de loading global.
   */
  function show() {
    _getOverlay().style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Oculta o overlay de loading global.
   */
  function hide() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  /**
   * Executa uma função assíncrona com loading automático.
   * @param {function} asyncFn
   * @returns {Promise<*>}
   */
  async function wrap(asyncFn) {
    show();
    try {
      return await asyncFn();
    } finally {
      hide();
    }
  }

  return { show, hide, wrap };
})();
