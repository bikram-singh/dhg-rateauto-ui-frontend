import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Filters from "./Filters";
import StatsCards from "./StatsCards";
import PriceChart from "./PriceChart";
import DataTable from "./DataTable";

export default function Dashboard() {
  const [filters, setFilters] = useState({});

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />

        <div className="page-body">
          <Filters onSearch={setFilters} />
          <StatsCards />
          <PriceChart />
          <DataTable />
        </div>
      </div>
    </div>
  );
}
