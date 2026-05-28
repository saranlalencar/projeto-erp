// ============================================================
// components/toast.js — Componente de notificações toast
// Exibe mensagens temporárias de sucesso, erro, aviso e info
// ============================================================

const Toast = (() => {
  let _container = null;

  const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };

  function _getContainer() {
    if (_container) return _container;
    _container = document.createElement('div');
    _container.className = 'toast-container';
    _container.setAttribute('aria-live', 'polite');
    document.body.appendChild(_container);
    return _container;
  }

  /**
   * Exibe uma notificação toast.
   * @param {{ type: 'success'|'error'|'warning'|'info', title: string, message?: string, duration?: number }} options
   */
  function show({ type = 'info', title, message = '', duration = 4000 }) {
    const container = _getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${icons[type] || icons.info}</span>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        ${message ? `<div class="toast__message">${message}</div>` : ''}
      </div>
      <button class="toast__close" aria-label="Fechar">✕</button>
    `;

    container.appendChild(toast);
    toast.querySelector('.toast__close').addEventListener('click', () => dismiss(toast));

    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }

    return toast;
  }

  function dismiss(toast) {
    toast.classList.add('is-hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }

  const success = (title, message) => show({ type: 'success', title, message });
  const error   = (title, message) => show({ type: 'error',   title, message });
  const warning = (title, message) => show({ type: 'warning', title, message });
  const info    = (title, message) => show({ type: 'info',    title, message });

  return { show, success, error, warning, info };
})();
