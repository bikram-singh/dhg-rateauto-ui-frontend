import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Grid, List } from "lucide-react";

const PAGE_SIZES = [5, 10, 20, 30, 50, 100, 200];
const MAX_PAGE_BTNS = 7; // max visible page buttons

export default function DataTable({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const rows = useMemo(() =>
    pricing.map((p) => ({
      dept:      departmentMap[p.department_id]?.name   || p.department?.name   || "—",
      vaccine:   vaccineMap[p.vaccine_id]?.name         || p.vaccine?.name      || "—",
      hospital:  hospitalMap[p.hospital_id]?.name       || p.hospital?.name     || "—",
      location:  hospitalMap[p.hospital_id]?.location   || p.hospital?.location || "—",
      mfg:       vaccineMap[p.vaccine_id]?.manufacturer || p.vaccine?.manufacturer || "—",
      price:     parseFloat(p.price || 0),
      insurance: p.insurance_covered || "No",
      status:    p.status || "Available",
      stock:     p.stock_quantity ?? null,
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

  // Smart pagination — show max 7 buttons with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= MAX_PAGE_BTNS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const half = Math.floor(MAX_PAGE_BTNS / 2);
    let start = Math.max(2, page - half);
    let end   = Math.min(totalPages - 1, page + half);

    if (page - half <= 2) end = Math.min(totalPages - 1, MAX_PAGE_BTNS - 2);
    if (page + half >= totalPages - 1) start = Math.max(2, totalPages - MAX_PAGE_BTNS + 2);

    pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const stockColor = (qty) => {
    if (qty === null) return null;
    if (qty === 0)   return { color:"#F87171", bg:"rgba(239,68,68,0.1)", border:"rgba(239,68,68,0.3)" };
    if (qty <= 10)   return { color:"#FCD34D", bg:"rgba(245,158,11,0.1)", border:"rgba(245,158,11,0.3)" };
    return { color:"#4ADE80", bg:"rgba(34,197,94,0.1)", border:"rgba(34,197,94,0.3)" };
  };

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
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          entries
        </div>

        {/* Result count */}
        <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginLeft:"8px" }}>
          {search ? `${filtered.length} results found` : `${filtered.length} total`}
        </span>

        <div className="table-search-wrap">
          <Search size={14} className="table-search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="table-search-input"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }}
              style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", fontSize:"14px" }}>✕</button>
          )}
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
              {["Department","Vaccine","Hospital","Location","Manufacturer","Price","Stock","Insurance","Status"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign:"center", padding:"2rem", opacity:0.6 }}>No data found</td></tr>
            ) : paginated.map((row, i) => {
              const sc = stockColor(row.stock);
              return (
                <tr key={i}>
                  <td>{row.dept}</td>
                  <td>{row.vaccine}</td>
                  <td>{row.hospital}</td>
                  <td>{row.location}</td>
                  <td>{row.mfg}</td>
                  <td className="price-cell">₹{row.price}</td>
                  <td>
                    {row.stock !== null && sc ? (
                      <span style={{ fontSize:"11px", fontWeight:"600", padding:"3px 10px",
                        borderRadius:"20px", background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                        {row.stock === 0 ? "Out" : row.stock <= 10 ? `Low (${row.stock})` : row.stock}
                      </span>
                    ) : <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>—</span>}
                  </td>
                  <td><InsuranceBadge value={row.insurance} /></td>
                  <td><StatusBadge status={row.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="table-info">
          Showing {filtered.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
          {search && <span style={{ color:"rgba(255,255,255,0.4)" }}> (filtered)</span>}
        </span>
        <div className="table-pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>‹</button>
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`e${i}`} style={{ padding:"5px 4px", color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>…</span>
            ) : (
              <button key={p} className={`page-btn ${p === page ? "page-btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
            )
          )}
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>›</button>
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
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
  const map = { "Available":"badge--available", "Out of Stock":"badge--oos", "Low Stock":"badge--low" };
  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
}
