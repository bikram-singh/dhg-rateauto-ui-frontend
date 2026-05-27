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
import HospitalMapPage from "../components/HospitalMapPage";
import VaccineDetailPage from "../components/VaccineDetailPage";
import HospitalRankingPage from "../components/HospitalRankingPage";
import AIVaccineAdvisor from "../components/AIVaccineAdvisor";
import CityAnalyticsPage from "../components/CityAnalyticsPage";
import VaccineCardPage from "../components/VaccineCardPage";
import VaccineCalendarPage from "../components/VaccineCalendarPage";
import { api } from "../services/api";

export default function Dashboard() {
  const [pricing, setPricing]         = useState([]);
  const [vaccines, setVaccines]       = useState([]);
  const [hospitals, setHospitals]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activePage, setActivePage]   = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode]       = useState(true);
  const [filters, setFilters]         = useState({
    department:"", vaccine:"", facility:"", location:"", priceMin:null, priceMax:null
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

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

  const layout = (children) => (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          pricing={pricing}
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
    {activePage === "Hospital Map"     && <HospitalMapPage      {...sp}/>}
    {activePage === "Vaccine Details"  && <VaccineDetailPage    {...sp}/>}
    {activePage === "Rankings"         && <HospitalRankingPage  {...sp}/>}
    {activePage === "AI Advisor"       && <AIVaccineAdvisor     {...sp}/>}
    {activePage === "City Analytics"   && <CityAnalyticsPage    {...sp}/>}
    {activePage === "Vaccine Card"     && <VaccineCardPage      {...sp}/>}
    {activePage === "Vaccine Calendar" && <VaccineCalendarPage  {...sp}/>}
  </>);
}
