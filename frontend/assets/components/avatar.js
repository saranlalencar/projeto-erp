// ============================================================
// components/avatar.js — Componente de avatar de usuário
// Gera avatar com iniciais quando não há foto, ou exibe imagem
// ============================================================

const Avatar = (() => {
  const COLORS = [
    '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
    '#d97706', '#16a34a', '#0891b2', '#2563eb',
  ];

  /**
   * Gera uma cor determinística baseada no nome do usuário.
   * @param {string} name
   * @returns {string} Cor hexadecimal
   */
  function _colorForName(name) {
    let hash = 0;
    for (const char of name) hash = char.charCodeAt(0) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  }

  /**
   * Extrai as iniciais de um nome (até 2 letras).
   * @param {string} name
   * @returns {string}
   */
  function _initials(name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Cria um elemento <canvas> com o avatar de iniciais.
   * @param {string} name
   * @param {number} [size=40]
   * @returns {string} Data URL da imagem gerada
   */
  function generateInitialsDataURL(name, size = 40) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const color = _colorForName(name);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${size * 0.4}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(_initials(name), size / 2, size / 2);

    return canvas.toDataURL('image/png');
  }

  /**
   * Configura um elemento <img> para exibir avatar do usuário.
   * Usa a foto se disponível, ou gera iniciais.
   * @param {HTMLImageElement} imgEl
   * @param {{ name: string, avatar?: string }} user
   * @param {number} [size=40]
   */
  function setAvatar(imgEl, user, size = 40) {
    if (!imgEl || !user) return;
    if (user.avatar) {
      imgEl.src = user.avatar;
      imgEl.alt = user.name;
      imgEl.onerror = () => { imgEl.src = generateInitialsDataURL(user.name, size); };
    } else {
      imgEl.src = generateInitialsDataURL(user.name, size);
      imgEl.alt = user.name;
    }
  }

  return { generateInitialsDataURL, setAvatar };
})();
