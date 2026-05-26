const BASE_URL = "/vaccinefee/api";

async function fetchJSON(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getVaccines:     () => fetchJSON("/vaccines/?limit=200"),
  getHospitals:    () => fetchJSON("/hospitals/?limit=200"),
  getDepartments:  () => fetchJSON("/departments/?limit=200"),
  getPricing:      () => fetchJSON("/pricing/?limit=2000"),
};