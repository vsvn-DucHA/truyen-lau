export const WORKER_URL = import.meta.env.PUBLIC_WORKER_URL;
const LS_KEY = 'app_api_key';


export function getApiKey() {
  return localStorage.getItem(LS_KEY);
}

export function isAuthenticated() {
  return Boolean(getApiKey());
}

export function clearCredentials() {
  localStorage.removeItem(LS_KEY);
}

/**
 * Verify the API key against the Worker (GET /).
 * On success stores key in localStorage + cookie.
 * Returns { ok: true } or { ok: false, status, message }.
 */
export async function login(apiKey) {
  let res;
  try {
    res = await fetch(`${WORKER_URL}/`, {
      method: 'GET',
      headers: { 'x-api-key': apiKey },
    });
  } catch {
    return { ok: false, status: 0, message: 'Không thể kết nối đến server.' };
  }

  if (res.status === 401) {
    return { ok: false, status: 401, message: 'API key không hợp lệ.' };
  }

  if (!res.ok) {
    return { ok: false, status: res.status, message: `Lỗi server: ${res.status}` };
  }

  localStorage.setItem(LS_KEY, apiKey);
  return { ok: true };
}

/**
 * Fetch a path from the Worker using the stored API key.
 * @param {string} path - e.g. 'stories.json' or 'my-story/0001.txt'
 */
export async function fetchFromWorker(path) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Chưa đăng nhập');
  const cleanPath = path.replace(/^\/+/, '');
  return fetch(`${WORKER_URL}/${cleanPath}`, {
    headers: { 'x-api-key': apiKey },
  });
}
