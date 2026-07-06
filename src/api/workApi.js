import { createSearchParams, request } from './httpClient.js';

export function getWorks({ keyword, status, page = 0, size = 10 }) {
  const query = createSearchParams({ keyword, status, page, size });
  return request(`/works${query}`);
}

export function createWork(payload) {
  return request('/works', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateWork(id, payload) {
  return request(`/works/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function updateWorkStatus(id, status) {
  return request(`/works/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function deleteWork(id) {
  return request(`/works/${id}`, {
    method: 'DELETE',
  });
}
