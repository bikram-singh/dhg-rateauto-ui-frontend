import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filters from "../components/Filters";
import StatsCards from "../components/StatsCards";
import PriceChart from "../components/PriceChart";
import DataTable from "../components/DataTable";
import { api } from "../services/api";

export default function Dashboard() {
  const [pricing, setPricing]       = useState([]);
  const [vaccines, setVaccines]     = useState([]);
  const [hospitals, setHospitals]   = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

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
        console.error("API error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="page-body" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <div style={{ color: "#EF5350", fontSize: "1.1rem" }}>Failed to load data: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-body">
          <Filters departments={departments} vaccines={vaccines} hospitals={hospitals} />
          <StatsCards vaccines={vaccines} hospitals={hospitals} pricing={pricing} />
          <PriceChart pricing={pricing} vaccines={vaccines} hospitals={hospitals} />
          <DataTable pricing={pricing} vaccines={vaccines} hospitals={hospitals} departments={departments} />
        </div>
      </div>
    </div>
  );
}
