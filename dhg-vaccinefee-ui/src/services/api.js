const BASE_URL = "/vaccinefee/api";

async function fetchJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getVaccines:     () => fetchJSON("/vaccines/"),
  getHospitals:    () => fetchJSON("/hospitals/"),
  getDepartments:  () => fetchJSON("/departments/"),
  getPricing:      () => fetchJSON("/pricing/?limit=200"),
};
