const BASE = "/vaccinefee/api";

// Get stored JWT token
const getToken = () => localStorage.getItem("dhg_jwt_token");

// Generic fetch - NO auth header on public endpoints to avoid Gateway issues
const fetchJSON = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

// Fetch with auth header - only for protected endpoints
const fetchWithAuth = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("dhg_jwt_token");
    sessionStorage.removeItem("dhg_token");
    window.location.reload();
    return [];
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

// Fetch all pricing using pagination to avoid timeout
const fetchAllPricing = async () => {
  const limit = 500;
  let skip = 0;
  let all = [];
  while (true) {
    const batch = await fetchJSON(`/pricing/?limit=${limit}&skip=${skip}`);
    if (!batch || batch.length === 0) break;
    all = [...all, ...batch];
    if (batch.length < limit) break;
    skip += limit;
    // Stop at 6000 to avoid too long loading
    if (all.length >= 6000) break;
  }
  return all;
};

export const api = {
  // Public data endpoints - no auth header
  getPricing:     () => fetchAllPricing(),
  getVaccines:    () => fetchJSON("/vaccines/?limit=200"),
  getHospitals:   () => fetchJSON("/hospitals/?limit=200"),
  getDepartments: () => fetchJSON("/departments/?limit=100"),

  // Auth endpoints
  login: async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("dhg_jwt_token", data.access_token);
    return data.user;
  },

  logout: () => {
    localStorage.removeItem("dhg_jwt_token");
    sessionStorage.removeItem("dhg_token");
  },

  getMe: () => fetchWithAuth("/auth/me"),

  // User management - requires auth
  getUsers:   () => fetchWithAuth("/auth/users"),
  createUser: (data) => fetchWithAuth("/auth/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUser: (id) => fetchWithAuth(`/auth/users/${id}`, { method: "DELETE" }),
};