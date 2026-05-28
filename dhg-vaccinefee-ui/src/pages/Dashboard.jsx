import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filters from "../components/Filters";
import StatsCards from "../components/StatsCards";
import PriceChart from "../components/PriceChart";
import DataTable from "../components/DataTable";
import DepartmentsPage from "../components/DepartmentsPage";
import HospitalsPage from "../components/HospitalsPage";
import PricingPage from "../components/PricingPage";
import ReportsPage from "../components/ReportsPage";
import BillingPage from "../components/BillingPage";
import PriceHistoryPage from "../components/PriceHistoryPage";
import VaccineSearchPage from "../components/VaccineSearchPage";
import CompareHospitalsPage from "../components/CompareHospitalsPage";
import VaccineDetailPage from "../components/VaccineDetailPage";
import HospitalRankingPage from "../components/HospitalRankingPage";
import AIVaccineAdvisor from "../components/AIVaccineAdvisor";
import CityAnalyticsPage from "../components/CityAnalyticsPage";
import VaccineCardPage from "../components/VaccineCardPage";
import PricePredictionPage from "../components/PricePredictionPage";
import AdvancedReportsPage from "../components/AdvancedReportsPage";
import { api } from "../services/api";
import LoginPage from "./LoginPage";
import AdminPanel from "./AdminPanel";
import UserManagementPage from "../components/UserManagementPage";
import AuditLogPage from "../components/AuditLogPage";
import AppointmentPage from "../components/AppointmentPage";
import HospitalProfilePage from "../components/HospitalProfilePage";

export default function Dashboard() {
  // Auth
  const [currentUser, setCurrentUser] = useState(() => {
    // Check JWT token in localStorage (real auth)
    const jwt = localStorage.getItem("dhg_jwt_token");
    if (jwt) {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          return { username: payload.sub, role: payload.role, name: payload.sub === "bikram" ? "Bikram Singh" : payload.sub };
        }
        localStorage.removeItem("dhg_jwt_token");
      } catch { localStorage.removeItem("dhg_jwt_token"); }
    }
    // Fallback: check sessionStorage (demo mode)
    const token = sessionStorage.getItem("dhg_token");
    if (!token) return null;
    try {
      const user = JSON.parse(atob(token));
      if (user.exp < Date.now()) { sessionStorage.removeItem("dhg_token"); return null; }
      return user;
    } catch { return null; }
  });

  const [pricing, setPricing]         = useState([]);
  const [vaccines, setVaccines]       = useState([]);
  const [hospitals, setHospitals]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activePage, setActivePage]   = useState(() => {
    const hash = window.location.hash.replace("#", "");
    const validPages = ["Dashboard","Departments","Hospitals","Pricing","Price History",
      "Vaccine Search","Compare","Hospital Map","Vaccine Details","Rankings","AI Advisor",
      "City Analytics","Vaccine Card","Vaccine Calendar","Price Prediction","Advanced Reports","Admin Panel"];
    return validPages.includes(hash) ? hash : "Dashboard";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode]       = useState(true);
  const [filters, setFilters]         = useState({
    department:"", vaccine:"", facility:"", location:"", priceMin:null, priceMax:null
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("dhg_jwt_token");
    sessionStorage.removeItem("dhg_token");
    setCurrentUser(null);
  };

  const fetchAll = useCallback(async () => {
    try {
      const [p, v, h, d] = await Promise.all([
        api.getPricing(), api.getVaccines(), api.getHospitals(), api.getDepartments()
      ]);
      setPricing(p); setVaccines(v); setHospitals(h); setDepartments(d);
      setLoading(false);
    } catch (err) {
      setError(err.message); setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const filteredPricing = useMemo(() => pricing.filter((p) => {
    const vaccine    = vaccineMap[p.vaccine_id]       || p.vaccine;
    const hospital   = hospitalMap[p.hospital_id]     || p.hospital;
    const department = departmentMap[p.department_id] || p.department;
    if (filters.department && department?.name !== filters.department) return false;
    if (filters.vaccine    && vaccine?.name    !== filters.vaccine)    return false;
    if (filters.facility   && hospital?.name   !== filters.facility)   return false;
    if (filters.location && !(hospital?.location||"").toLowerCase().includes(filters.location.toLowerCase())) return false;
    const price = parseFloat(p.price);
    if (filters.priceMax !== null && price > filters.priceMax) return false;
    if (filters.priceMin !== null && price < filters.priceMin) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!(vaccine?.name||"").toLowerCase().includes(q) &&
          !(hospital?.name||"").toLowerCase().includes(q) &&
          !(department?.name||"").toLowerCase().includes(q) &&
          !(hospital?.location||"").toLowerCase().includes(q)) return false;
    }
    return true;
  }), [pricing, vaccineMap, hospitalMap, departmentMap, filters, searchQuery]);

  const sp = { pricing, vaccines, hospitals, departments };

  // Show login page if not authenticated
  if (!currentUser) return <LoginPage onLogin={setCurrentUser}/>;

  const layout = (children) => (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={(page) => {
          setActivePage(page);
          window.location.hash = page;
        }} />
      <div className="main-content">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          pricing={pricing}
          user={currentUser}
          onLogout={handleLogout}
        />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );

  if (loading) return layout(
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"1.2rem" }}>Loading data...</div>
    </div>
  );

  if (error) return layout(
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ color:"#EF5350" }}>Failed to load data: {error}</div>
    </div>
  );

  return layout(<>
    {activePage === "Dashboard" && <>
      <Filters departments={departments} vaccines={vaccines} hospitals={hospitals} onSearch={setFilters}/>
      <StatsCards vaccines={vaccines} hospitals={hospitals} pricing={filteredPricing} onRefresh={fetchAll}/>
      <PriceChart pricing={filteredPricing} vaccines={vaccines} hospitals={hospitals}/>
      <DataTable  pricing={filteredPricing} vaccines={vaccines} hospitals={hospitals} departments={departments}/>
    </>}
    {activePage === "Departments"      && <DepartmentsPage      {...sp}/>}
    {activePage === "Hospitals"        && <HospitalsPage        {...sp}/>}
    {activePage === "Pricing"          && <PricingPage          pricing={filteredPricing} vaccines={vaccines} hospitals={hospitals} departments={departments}/>}
    {activePage === "Reports"          && <ReportsPage          {...sp}/>}
    {activePage === "Billing"          && <BillingPage          {...sp}/>}
    {activePage === "Price History"    && <PriceHistoryPage     {...sp}/>}
    {activePage === "Vaccine Search"   && <VaccineSearchPage    {...sp}/>}
    {activePage === "Compare"          && <CompareHospitalsPage {...sp}/>}
    {activePage === "Vaccine Details"  && <VaccineDetailPage    {...sp}/>}
    {activePage === "Rankings"         && <HospitalRankingPage  {...sp}/>}
    {activePage === "AI Advisor"       && <AIVaccineAdvisor     {...sp}/>}
    {activePage === "City Analytics"   && <CityAnalyticsPage    {...sp}/>}
    {activePage === "Vaccine Card"     && <VaccineCardPage      {...sp}/>}
    {activePage === "Price Prediction"  && <PricePredictionPage  {...sp}/>}
    {activePage === "Advanced Reports"  && <AdvancedReportsPage  {...sp}/>}
    {activePage === "Admin Panel"        && <AdminPanel {...sp} userRole={currentUser?.role}/>}
    {activePage === "User Management"    && <UserManagementPage userRole={currentUser?.role}/>}
    {activePage === "Audit Log"           && <AuditLogPage currentUser={currentUser}/>}
    {activePage === "Appointments"        && <AppointmentPage {...sp}/>}
    {activePage === "Hospital Profiles"   && <HospitalProfilePage {...sp}/>}
  </>);
}