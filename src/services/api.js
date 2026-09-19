const API_URL = import.meta.env.VITE_API_URL + "/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem("teamsync_token");
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body)
    headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("teamsync_token");
    window.dispatchEvent(new Event("teamsync:unauthorized"));
  }
  if (!response.ok) {
    let message = `Pedido falhou (${response.status})`;
    try {
      const body = await response.json();
      message = body.message || body.error || message;
    } catch {
      /* API may return an empty error body */
    }
    throw new ApiError(message, response.status);
  }
  if (response.status === 204) return null;
  // Some Spring endpoints return 200/201 with an empty body. Do not turn a
  // successful mutation into a client-side JSON parse error.
  const text = await response.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(
      "O backend devolveu uma resposta inválida.",
      response.status,
    );
  }
}

export const api = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (details) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(details),
    }),
  manager: () => request("/manager"),
  updateManager: (manager) =>
    request("/manager/update", {
      method: "PUT",
      body: JSON.stringify(manager),
    }),
  team: () => request("/team"),
  updateTeam: (team) =>
    request("/team/update", { method: "PUT", body: JSON.stringify(team) }),
  list: (resource) => request(`/${resource}`),
  get: (resource, id) => request(`/${resource}/${id}`),
  create: (resource, payload) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(payload) }),
  update: (resource, id, payload) =>
    request(`/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),
};
