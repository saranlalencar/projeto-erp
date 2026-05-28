// ============================================================
// darkmode.js — Controle do modo escuro (dark/light theme)
// Persiste preferência no localStorage e aplica ao carregarss
// ============================================================

const DarkMode = (() => {
  const KEY = 'theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  /**
   * Aplica o tema salvo ou o preferido pelo sistema operacional.
   */
  function apply() {
    const saved = Storage.get(KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? DARK : LIGHT);
    setTheme(theme, false);
  }

  /**
   * Define o tema ativo.
   * @param {string} theme - 'dark' ou 'light'
   * @param {boolean} [persist=true] - salvar no Storage
   */
  function setTheme(theme, persist = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) Storage.set(KEY, theme);
    updateToggleButton(theme);
  }

  /**
   * Alterna entre dark e light.
   */
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === DARK ? LIGHT : DARK);
  }

  /**
   * Retorna o tema atual.
   * @returns {string}
   */
  function current() {
    return document.documentElement.getAttribute('data-theme') || LIGHT;
  }

  /**
   * Atualiza ícone/texto do botão de toggle.
   * @param {string} theme
   */
  function updateToggleButton(theme) {
    const btn = document.querySelector('.darkmode-toggle');
    if (!btn) return;
    const icon = btn.querySelector('.darkmode-toggle__icon');
    const label = btn.querySelector('.darkmode-toggle__label');
    if (icon) icon.textContent = theme === DARK ? '☀️' : '🌙';
    if (label) label.textContent = theme === DARK ? 'Modo claro' : 'Modo escuro';
  }

  return { apply, toggle, setTheme, current };
})();
