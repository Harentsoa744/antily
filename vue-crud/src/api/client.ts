/** Client HTTP générique pour l'API générée (voir .env.example : VITE_API_URL). */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  if (!(options?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      // Keep the response text when the API does not return JSON.
    }
    const message = typeof body === 'object' && body !== null && 'message' in body
      ? String((body as { message: unknown }).message)
      : text;
    throw new ApiError(message || `Erreur API (${res.status})`, res.status, body);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  list: <T>(resource: string) => request<T[]>(`/${resource}`),
  get: <T>(resource: string, id: string | number) => request<T>(`/${resource}/${id}`),
  create: <T>(resource: string, body: unknown) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T>(resource: string, id: string | number, body: unknown) =>
    request<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (resource: string, id: string | number) =>
    request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
  login: (body: { email: string; password: string }) =>
    request<{ accessToken: string; user: { id: string; name: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  register: (body: { name: string; email: string; password: string }) =>
    request<{ accessToken: string; user: { id: string; name: string; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  importRows: <T, R>(resource: string, rows: T[]) =>
    request<R>(`/${resource}/import`, {
      method: 'POST',
      body: JSON.stringify({ rows }),
      headers: (() => {
        const token = localStorage.getItem('accessToken');
        return token ? { Authorization: `Bearer ${token}` } : undefined;
      })(),
    }),
  importMembers: async <T>(rows: T[]) => {
    const token = localStorage.getItem('accessToken');
    return request<{ imported: number }>('/member/import', {
      method: 'POST',
      body: JSON.stringify({ rows }),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};
