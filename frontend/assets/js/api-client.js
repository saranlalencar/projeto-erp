// ============================================================
// api-client.js — Cliente HTTP base para o Vortex ERP API
// Injeta JWT automaticamente, normaliza erros, retorna JSON
// ============================================================

const ApiClient = (() => {
  // Altere para a URL de produção quando fizer o deploy
  const BASE_URL = 'http://localhost:3000';

  function _getToken() {
    try {
      const raw = sessionStorage.getItem('vortex_session');
      if (!raw) return null;
      return JSON.parse(raw).token || null;
    } catch {
      return null;
    }
  }

  function _buildHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    const token = _getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async function _handleResponse(response) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(data.error || 'erro_desconhecido');
      err.status = response.status;
      err.data = data;
      err.error = data.error || 'erro_desconhecido';
      throw err;
    }
    return data;
  }

  async function get(path) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: _buildHeaders(),
    });
    return _handleResponse(response);
  }

  async function post(path, body) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: _buildHeaders(),
      body: JSON.stringify(body),
    });
    return _handleResponse(response);
  }

  async function put(path, body) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: _buildHeaders(),
      body: JSON.stringify(body),
    });
    return _handleResponse(response);
  }

  async function patch(path, body) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: _buildHeaders(),
      body: JSON.stringify(body),
    });
    return _handleResponse(response);
  }

  async function del(path) {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: _buildHeaders(),
    });
    return _handleResponse(response);
  }

  return { get, post, put, patch, del };
})();
