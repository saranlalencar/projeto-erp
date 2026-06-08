// ============================================================
// validators.js — Validações de formulários e dados
// Funções puras de validação reutilizáveis em todo o sistema
// ============================================================

const Validators = (() => {
  /**
   * Valida formato de e-mail.
   * @param {string} email
   * @returns {boolean}
   */
  function isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Valida força de senha (mínimo 8 chars, 1 maiúscula, 1 número).
   * @param {string} password
   * @returns {{ valid: boolean, errors: string[] }}
   */
  function passwordStrength(password) {
    const errors = [];
    if (password.length < 8) errors.push('Mínimo de 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Pelo menos uma letra maiúscula');
    if (!/[0-9]/.test(password)) errors.push('Pelo menos um número');
    return { valid: errors.length === 0, errors };
  }

  /**
   * Verifica se um campo está vazio.
   * @param {string} value
   * @returns {boolean}
   */
  function isRequired(value) {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  }

  /**
   * Verifica comprimento mínimo.
   * @param {string} value
   * @param {number} min
   * @returns {boolean}
   */
  function minLength(value, min) {
    return value && value.length >= min;
  }

  /**
   * Verifica comprimento máximo.
   * @param {string} value
   * @param {number} max
   * @returns {boolean}
   */
  function maxLength(value, max) {
    return !value || value.length <= max;
  }

  /**
   * Valida código numérico de 6 dígitos.
   * @param {string} code
   * @returns {boolean}
   */
  function isValidCode(code) {
    return /^\d{6}$/.test(code);
  }

  /**
   * Valida CPF (apenas formato — sem cálculo de dígito verificador).
   * @param {string} cpf
   * @returns {boolean}
   */
  function isCPF(cpf) {
    return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf) || /^\d{11}$/.test(cpf);
  }

  /**
   * Valida CNPJ (formato).
   * @param {string} cnpj
   * @returns {boolean}
   */
  function isCNPJ(cnpj) {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj) || /^\d{14}$/.test(cnpj);
  }

  /**
   * Valida um formulário com regras definidas.
   * @param {HTMLFormElement} form
   * @param {Object} rules - { fieldName: (value) => errorMessage | null }
   * @returns {{ valid: boolean, errors: Object }}
   */
  function validateForm(form, rules) {
    const errors = {};
    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

    for (const [field, rule] of Object.entries(rules)) {
      const error = rule(data[field], data);
      if (error) {
        errors[field] = error;
        valid = false;
        UI.showFieldError(field, error);
      }
    }
    return { valid, errors };
  }

  return { isEmail, passwordStrength, isRequired, minLength, maxLength, isValidCode, isCPF, isCNPJ, validateForm };
})();
