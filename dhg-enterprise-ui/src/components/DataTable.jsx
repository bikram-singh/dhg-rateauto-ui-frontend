import { useState } from "react";
import { Search, SlidersHorizontal, Grid, List, ChevronDown } from "lucide-react";

const ALL_DATA = [
  { dept: "Infectious Diseases", vaccine: "COVID-19 Vaccine", hospital: "City Hospital",         location: "New York",    mfg: "Pfizer-BioNTech", price: 120, insurance: "Vco",      status: "Available" },
  { dept: "Infectious Diseases", vaccine: "COVID-19 Vaccine", hospital: "Riverside Medical",     location: "Los Angeles", mfg: "Pfizer-BioNTech", price: 130, insurance: "Vco",      status: "Available" },
  { dept: "Infectious Diseases", vaccine: "COVID-19 Vaccine", hospital: "Harmony Hospital",      location: "Chicago",     mfg: "Pfizer-BioNTech", price: 140, insurance: "—",        status: "Out of Stock" },
  { dept: "Infectious Diseases", vaccine: "COVID-19 Vaccine", hospital: "Heartland Medical",     location: "Houston",     mfg: "Pfizer-BioNTech", price: 110, insurance: "No",       status: "Available" },
  { dept: "Infectious Diseases", vaccine: "COVID-19 Vaccine", hospital: "Oasis Medical Center",  location: "Miami",       mfg: "Pfizer-BioNTech", price: 135, insurance: "No",       status: "Available" },
  { dept: "Pediatrics",          vaccine: "Flu Vaccine",      hospital: "Green Valley Medical",  location: "Phoenix",     mfg: "Sanofi",          price: 30,  insurance: "Yes",      status: "Available" },
  { dept: "Pediatrics",          vaccine: "Flu Vaccine",      hospital: "Metro Care Clinic",     location: "Dallas",      mfg: "Sanofi",          price: 35,  insurance: "Yes",      status: "Available" },
  { dept: "Gastroenterology",    vaccine: "Hepatitis B",      hospital: "Central Health Medical",location: "Seattle",     mfg: "GSK",             price: 45,  insurance: "Vco",      status: "Available" },
  { dept: "Pediatrics",          vaccine: "Measles Vaccine",  hospital: "City Hospital",         location: "New York",    mfg: "Merck",           price: 60,  insurance: "Yes",      status: "Low Stock" },
  { dept: "Emergency",           vaccine: "Tetanus Vaccine",  hospital: "Metro Care Clinic",     location: "Dallas",      mfg: "Sanofi",          price: 25,  insurance: "No",       status: "Available" },
  { dept: "Emergency",           vaccine: "Tetanus Vaccine",  hospital: "Heartland Medical Hub", location: "Houston",     mfg: "Sanofi",          price: 28,  insurance: "No",       status: "Available" },
  { dept: "Oncology",            vaccine: "HPV Vaccine",      hospital: "Riverside Medical",     location: "Los Angeles", mfg: "Merck",           price: 180, insurance: "Vco",      status: "Available" },
];

const PAGE_SIZES = [5, 10, 25];

export default function DataTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = ALL_DATA.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-show">
          Show
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="table-page-select"
          >
            {PAGE_SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
          entries
        </div>
        <div className="table-search-wrap">
          <Search size={14} className="table-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="table-search-input"
          />
        </div>
        <div className="table-view-btns">
          <button className="table-view-btn table-view-btn--active"><SlidersHorizontal size={15}/></button>
          <button className="table-view-btn"><Grid size={15}/></button>
          <button className="table-view-btn"><List size={15}/></button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {["Department","Vaccine","Hospital","Location","Manufacturer","Price","Insurance Covered","Status"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, i) => (
              <tr key={i}>
                <td>{row.dept}</td>
                <td>{row.vaccine}</td>
                <td>{row.hospital}</td>
                <td>{row.location}</td>
                <td>{row.mfg}</td>
                <td className="price-cell">₹{row.price}</td>
                <td>
                  <InsuranceBadge value={row.insurance} />
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="table-info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
        </span>
        <div className="table-pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? "page-btn--active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function InsuranceBadge({ value }) {
  const covered = value === "Vco" || value === "Yes";
  return (
    <span className={`insurance-badge ${covered ? "insurance-badge--yes" : "insurance-badge--no"}`}>
      {covered ? "✓" : "✗"} {value}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    "Available":    "badge--available",
    "Out of Stock": "badge--oos",
    "Low Stock":    "badge--low",
  };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
}
