// ============================================================
// components/modal.js — Componente de modal/diálogo reutilizável
// Abertura, fechamento, confirmação e injeção de conteúdo
// ============================================================

const Modal = (() => {
  let _overlay = null;

  function _getOrCreate() {
    if (_overlay) return _overlay;
    _overlay = document.createElement('div');
    _overlay.className = 'modal-overlay';
    _overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title"></h2>
          <button class="modal-close" aria-label="Fechar" id="modal-close-btn">✕</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer" id="modal-footer"></div>
      </div>
    `;
    document.body.appendChild(_overlay);

    _overlay.querySelector('#modal-close-btn').addEventListener('click', close);
    _overlay.addEventListener('click', e => { if (e.target === _overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    return _overlay;
  }

  /**
   * Abre o modal com título e conteúdo HTML.
   * @param {{ title: string, body: string, footer?: string, size?: 'sm'|'lg'|'xl' }} options
   */
  function open({ title, body, footer = '', size = '' }) {
    const overlay = _getOrCreate();
    const modal = overlay.querySelector('.modal');

    modal.className = `modal${size ? ` modal--${size}` : ''}`;
    overlay.querySelector('#modal-title').textContent = title;
    overlay.querySelector('#modal-body').innerHTML = body;
    overlay.querySelector('#modal-footer').innerHTML = footer;

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Fecha o modal.
   */
  function close() {
    if (!_overlay) return;
    _overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /**
   * Abre um diálogo de confirmação.
   * @param {{ message: string, onConfirm: function, confirmLabel?: string }} options
   */
  function confirm({ message, onConfirm, confirmLabel = 'Confirmar' }) {
    open({
      title: 'Confirmação',
      body: `<p>${message}</p>`,
      footer: `
        <button class="btn btn-outline" onclick="Modal.close()">Cancelar</button>
        <button class="btn btn-primary" id="modal-confirm-btn">${confirmLabel}</button>
      `,
      size: 'sm',
    });
    _overlay.querySelector('#modal-confirm-btn')?.addEventListener('click', () => {
      close();
      onConfirm();
    });
  }

  return { open, close, confirm };
})();
