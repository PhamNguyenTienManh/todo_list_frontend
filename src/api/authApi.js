import { request } from './httpClient.js';

export function login(credentials) {
  return request('/auth/token', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function introspect(token) {
  return request('/auth/introspect', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export function registerUser(payload) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
