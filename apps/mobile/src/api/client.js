// src/api/client.js
import { BASE_URL } from "../config/apiConfig";
import { getAuthToken } from "../services/authService";

async function buildHeaders(extra = {}) {
  const token = await getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function request(method, path, body = null, extraHeaders = {}) {
  const headers = await buildHeaders(extraHeaders);

  const options = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `API Error: ${res.status}`);
    }

    // DELETE 같은 경우 body 없을 수 있음
    if (res.status === 204) return true;

    return res.json();
  } catch (err) {
    console.error(`[HTTP ${method}] ${path}`, err);
    throw err;
  }
}

export const httpClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path, body) => request("DELETE", path, body),
};
