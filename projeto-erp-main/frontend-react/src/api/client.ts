import { supabase } from '../lib/supabase';

const BASE_URL = 'http://localhost:3000';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function buildHeaders(extra: Record<string, string> = {}): Promise<Record<string, string>> {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
  const token = await getToken();
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
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

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { headers: h }).then(r => handleResponse<T>(r));
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { method: 'POST', headers: h, body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r));
  },

  put: async <T>(path: string, body: unknown): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: h, body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r));
  },

  patch: async <T>(path: string, body: unknown): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: h, body: JSON.stringify(body) })
      .then(r => handleResponse<T>(r));
  },

  del: async <T>(path: string): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: h })
      .then(r => handleResponse<T>(r));
  },

  delete: async <T>(path: string): Promise<T> => {
    const h = await buildHeaders();
    return fetch(`${BASE_URL}${path}`, { method: 'DELETE', headers: h })
      .then(r => handleResponse<T>(r));
  },
};
