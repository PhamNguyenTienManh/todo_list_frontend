import { clearToken, getToken } from '../utils/tokenStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError('May chu tra ve du lieu khong hop le.', response.status, text);
  }
}

export async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await parseResponse(response);

  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new CustomEvent('auth:expired'));
  }

  if (!response.ok) {
    throw new ApiError(payload?.message || 'Khong the ket noi den API.', response.status, payload);
  }

  if (payload && payload.code !== undefined && payload.code !== 1000) {
    throw new ApiError(payload.message || 'Yeu cau khong thanh cong.', response.status, payload);
  }

  return payload?.result ?? payload;
}

export function createSearchParams(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}
