import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filters from "../components/Filters";
import StatsCards from "../components/StatsCards";
import PriceChart from "../components/PriceChart";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

export default function Dashboard() {
  const [pricing, setPricing]           = useState([]);
  const [vaccines, setVaccines]         = useState([]);
  const [hospitals, setHospitals]       = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [filters, setFilters]           = useState({
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

  // Apply filters to pricing data
  const filteredPricing = pricing.filter((p) => {
    const vaccine    = vaccines.find((v) => v.id === p.vaccine_id)    || p.vaccine;
    const hospital   = hospitals.find((h) => h.id === p.hospital_id)  || p.hospital;
    const department = departments.find((d) => d.id === p.department_id) || p.department;

    if (filters.department && department?.name !== filters.department) return false;
    if (filters.vaccine    && vaccine?.name    !== filters.vaccine)    return false;
    if (filters.facility   && hospital?.name   !== filters.facility)   return false;
    if (filters.location   && hospital?.location !== filters.location) return false;
    if (filters.priceMax   && parseFloat(p.price) > filters.priceMax)  return false;
    if (filters.priceMin   && parseFloat(p.price) < filters.priceMin)  return false;
    return true;
  });

  if (loading) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-body" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"1.2rem" }}>Loading data...</div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-body" style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
          <div style={{ color:"#EF5350", fontSize:"1.1rem" }}>Failed to load data: {error}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-body">
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
        </div>
      </div>
    </div>
  );
}
