// ============================================================
// ui.js — Utilitários de interface (UI helpers)
// Manipulação do DOM, loading states, templates e formatação
// ============================================================

const UI = (() => {
  /**
   * Exibe ou oculta um elemento pelo seletor.
   * @param {string} selector
   * @param {boolean} visible
   */
  function setVisible(selector, visible) {
    const el = document.querySelector(selector);
    if (el) el.style.display = visible ? '' : 'none';
  }

  /**
   * Renderiza uma lista de itens em um container usando uma função template.
   * @param {string} containerSelector
   * @param {Array} items
   * @param {function} templateFn
   * @param {string} [emptyMessage]
   */
  function renderList(containerSelector, items, templateFn, emptyMessage = 'Nenhum item encontrado.') {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    if (!items || items.length === 0) {
      container.innerHTML = `<p class="text-muted text-center" style="padding:2rem">${emptyMessage}</p>`;
      return;
    }
    container.innerHTML = items.map(templateFn).join('');
  }

  /**
   * Preenche um formulário com dados de um objeto.
   * @param {string} formSelector
   * @param {object} data
   */
  function fillForm(formSelector, data) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value ?? '';
    });
  }

  /**
   * Formata data ISO para pt-BR.
   * @param {string} isoDate
   * @returns {string}
   */
  function formatDate(isoDate) {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleDateString('pt-BR', { dateStyle: 'short' });
  }

  /**
   * Formata valor numérico como moeda BRL.
   * @param {number} value
   * @returns {string}
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  /**
   * Adiciona classe de loading a um botão e desabilita.
   * @param {HTMLButtonElement} btn
   * @param {boolean} loading
   */
  function setButtonLoading(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loading ? 'Aguarde...' : btn.dataset.originalText;
  }

  /**
   * Exibe mensagem de erro em um campo de formulário.
   * @param {string} fieldId
   * @param {string} message
   */
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.add('is-invalid');
    if (errorEl) { errorEl.textContent = message; errorEl.classList.add('visible'); }
  }

  /**
   * Limpa todos os erros de um formulário.
   * @param {string} formSelector
   */
  function clearErrors(formSelector) {
    document.querySelectorAll(`${formSelector} .is-invalid`).forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll(`${formSelector} .form-error`).forEach(el => { el.textContent = ''; el.classList.remove('visible'); });
  }

  return { setVisible, renderList, fillForm, formatDate, formatCurrency, setButtonLoading, showFieldError, clearErrors };
})();
