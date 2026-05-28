const BASE = "/vaccinefee/api";

// Get stored JWT token
const getToken = () => localStorage.getItem("dhg_jwt_token");

// Auth headers
const authHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

// Generic fetch with auth
const fetchJSON = async (path, options = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });
  if (res.status === 401) {
    // Token expired — clear and redirect to login
    localStorage.removeItem("dhg_jwt_token");
    sessionStorage.removeItem("dhg_token");
    window.location.reload();
    return [];
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const api = {
  // Data endpoints
  getPricing:     () => fetchJSON("/pricing/?limit=5000"),
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

  getMe: () => fetchJSON("/auth/me"),

  // User management (Admin only)
  getUsers:   () => fetchJSON("/auth/users"),
  createUser: (data) => fetchJSON("/auth/users", { method: "POST", body: JSON.stringify(data) }),
  deleteUser: (id) => fetchJSON(`/auth/users/${id}`, { method: "DELETE" }),
};
