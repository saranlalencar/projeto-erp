// ── Cliente HTTP base ────────────────────────────────────────
const BASE_URL = 'http://localhost:3000';

const SUPA_KEY = 'sb-inktgatsnofilqdkqhbz-auth-token';

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(SUPA_KEY);
    if (raw) return (JSON.parse(raw) as { access_token?: string }).access_token ?? null;
  } catch { /* ignore */ }
  return null;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: Error & { status?: number; error?: string } = new Error(
      (data as { error?: string }).error || 'erro_desconhecido'
    );
    err.status = res.status;
    err.error = (data as { error?: string }).error;
    throw err;
  }
  return data as T;
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

export const api = {
  get: <T>(path: string) =>
    fetch(`${BASE_URL}${path}`, { headers: headers() }).then(r => handleResponse<T>(r)),

  post: <T>(path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r)),

  put: <T>(path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r)),

  patch: <T>(path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r)),

  del: <T>(path: string) =>
    fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: headers() })
      .then(r => handleResponse<T>(r)),

  delete: <T>(path: string) =>
    fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: headers() })
      .then(r => handleResponse<T>(r)),
};
