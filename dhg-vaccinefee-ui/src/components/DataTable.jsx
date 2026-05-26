import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

const PAGE_SIZES = [5, 10, 20, 30, 50, 100, 200];

export default function DataTable({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Build lookup maps
  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  // Flatten pricing rows
  const rows = useMemo(() =>
    pricing.map((p) => ({
      dept:      departmentMap[p.department_id]?.name  || p.department?.name  || "—",
      vaccine:   vaccineMap[p.vaccine_id]?.name        || p.vaccine?.name     || "—",
      hospital:  hospitalMap[p.hospital_id]?.name      || p.hospital?.name    || "—",
      location:  hospitalMap[p.hospital_id]?.location  || p.hospital?.location|| "—",
      mfg:       vaccineMap[p.vaccine_id]?.manufacturer|| p.vaccine?.manufacturer || "—",
      price:     parseFloat(p.price || 0),
      insurance: p.insurance_covered || "No",
      status:    p.status || "Available",
    })),
    [pricing, vaccineMap, hospitalMap, departmentMap]
  );

  const filtered = rows.filter((row) =>
    Object.values(row).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-show">
          Show
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="table-page-select" style={{ background: "#0D1B4B", color: "#fff", border: "1px solid rgba(79,195,247,0.3)" }}
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s} style={{ background: "#0D1B4B", color: "#fff" }}>{s}</option>)}
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
            {paginated.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>No data found</td></tr>
            ) : paginated.map((row, i) => (
              <tr key={i}>
                <td>{row.dept}</td>
                <td>{row.vaccine}</td>
                <td>{row.hospital}</td>
                <td>{row.location}</td>
                <td>{row.mfg}</td>
                <td className="price-cell">₹{row.price}</td>
                <td><InsuranceBadge value={row.insurance} /></td>
                <td><StatusBadge status={row.status} /></td>
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
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`page-btn ${p === page ? "page-btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
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
  const map = { "Available": "badge--available", "Out of Stock": "badge--oos", "Low Stock": "badge--low" };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
}
