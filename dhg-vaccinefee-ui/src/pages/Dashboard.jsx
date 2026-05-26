import { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filters from "../components/Filters";
import StatsCards from "../components/StatsCards";
import PriceChart from "../components/PriceChart";
import DataTable from "../components/DataTable";
import DepartmentsPage from "../components/DepartmentsPage";
import HospitalsPage from "../components/HospitalsPage";
import PricingPage from "../components/PricingPage";
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
  const [filters, setFilters]         = useState({
    department: "", vaccine: "", facility: "", location: "", priceMin: null, priceMax: null
  });

  useEffect(() => {
    Promise.all([
      api.getPricing(),
      api.getVaccines(),
      api.getHospitals(),
      api.getDepartments(),
    ])
      .then(([pricingData, vaccinesData, hospitalsData, departmentsData]) => {
        setPricing(pricingData);
        setVaccines(vaccinesData);
        setHospitals(hospitalsData);
        setDepartments(departmentsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const filteredPricing = useMemo(() => pricing.filter((p) => {
    const vaccine    = vaccineMap[p.vaccine_id]    || p.vaccine;
    const hospital   = hospitalMap[p.hospital_id]  || p.hospital;
    const department = departmentMap[p.department_id] || p.department;

    if (filters.department && department?.name !== filters.department) return false;
    if (filters.vaccine    && vaccine?.name    !== filters.vaccine)    return false;
    if (filters.facility   && hospital?.name   !== filters.facility)   return false;
    if (filters.location) {
      const loc = hospital?.location || "";
      if (!loc.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }
    const price = parseFloat(p.price);
    if (filters.priceMax !== null && price > filters.priceMax) return false;
    if (filters.priceMin !== null && price < filters.priceMin) return false;

    // Global header search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const vaccineName  = vaccine?.name?.toLowerCase()    || "";
      const hospitalName = hospital?.name?.toLowerCase()   || "";
      const deptName     = department?.name?.toLowerCase() || "";
      const location     = hospital?.location?.toLowerCase() || "";
      if (!vaccineName.includes(q) && !hospitalName.includes(q) && !deptName.includes(q) && !location.includes(q)) return false;
    }

    return true;
  }), [pricing, vaccineMap, hospitalMap, departmentMap, filters, searchQuery]);

  if (loading) return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="page-body" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"1.2rem" }}>Loading data...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="page-body" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ color:"#EF5350", fontSize:"1.1rem" }}>Failed to load data: {error}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="page-body">

          {activePage === "Dashboard" && <>
            <Filters
              departments={departments}
              vaccines={vaccines}
              hospitals={hospitals}
              onSearch={setFilters}
            />
            <StatsCards
              vaccines={vaccines}
              hospitals={hospitals}
              pricing={filteredPricing}
            />
            <PriceChart
              pricing={filteredPricing}
              vaccines={vaccines}
              hospitals={hospitals}
            />
            <DataTable
              pricing={filteredPricing}
              vaccines={vaccines}
              hospitals={hospitals}
              departments={departments}
            />
          </>}

          {activePage === "Departments" && (
            <DepartmentsPage departments={departments} pricing={pricing} />
          )}

          {activePage === "Hospitals" && (
            <HospitalsPage hospitals={hospitals} pricing={pricing} />
          )}

          {activePage === "Pricing" && (
            <PricingPage
              pricing={filteredPricing}
              vaccines={vaccines}
              hospitals={hospitals}
              departments={departments}
            />
          )}

        </div>
      </div>
    </div>
  );
}
