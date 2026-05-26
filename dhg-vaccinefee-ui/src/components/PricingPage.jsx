import { useState, useMemo } from "react";
import { Search, Download, Printer } from "lucide-react";

export default function PricingPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const pageSize            = 100;

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const rows = useMemo(() => pricing.map((p) => ({
    id:        p.id,
    dept:      departmentMap[p.department_id]?.name   || p.department?.name   || "—",
    vaccine:   vaccineMap[p.vaccine_id]?.name         || p.vaccine?.name      || "—",
    hospital:  hospitalMap[p.hospital_id]?.name       || p.hospital?.name     || "—",
    location:  hospitalMap[p.hospital_id]?.location   || p.hospital?.location || "—",
    mfg:       vaccineMap[p.vaccine_id]?.manufacturer || p.vaccine?.manufacturer || "—",
    price:     parseFloat(p.price || 0),
    insurance: p.insurance_covered || "No",
    status:    p.status || "Available",
  })), [pricing, vaccineMap, hospitalMap, departmentMap]);

  const filtered = rows.filter((r) =>
    Object.values(r).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Export to CSV ──
  const exportCSV = () => {
    const headers = ["Department","Vaccine","Hospital","Location","Manufacturer","Price","Insurance","Status"];
    const csvRows = [
      headers.join(","),
      ...filtered.map((r) => [
        `"${r.dept}"`, `"${r.vaccine}"`, `"${r.hospital}"`, `"${r.location}"`,
        `"${r.mfg}"`, r.price, `"${r.insurance}"`, `"${r.status}"`
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "dhg-vaccine-pricing.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Export to Excel (TSV) ──
  const exportExcel = () => {
    const headers = ["Department","Vaccine","Hospital","Location","Manufacturer","Price","Insurance","Status"];
    const tsvRows = [
      headers.join("\t"),
      ...filtered.map((r) => [r.dept, r.vaccine, r.hospital, r.location, r.mfg, r.price, r.insurance, r.status].join("\t"))
    ];
    const blob = new Blob([tsvRows.join("\n")], { type: "application/vnd.ms-excel" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "dhg-vaccine-pricing.xls";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Print ──
  const handlePrint = () => {
    const headers = ["Department","Vaccine","Hospital","Location","Manufacturer","Price","Insurance","Status"];
    const rows_html = filtered.slice(0, 500).map((r) => `
      <tr>
        <td>${r.dept}</td><td>${r.vaccine}</td><td>${r.hospital}</td>
        <td>${r.location}</td><td>${r.mfg}</td><td>₹${r.price}</td>
        <td>${r.insurance}</td><td>${r.status}</td>
      </tr>`).join("");
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>DHG Vaccine Pricing Report</title>
      <style>
        body { font-family: sans-serif; font-size: 12px; }
        h2 { color: #0D47A1; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #1565C0; color: white; padding: 8px; text-align: left; font-size: 11px; }
        td { padding: 7px 8px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) { background: #f5f9ff; }
        .meta { color: #666; font-size: 11px; margin-bottom: 8px; }
      </style></head>
      <body>
        <h2>DHG Vaccine Pricing Report</h2>
        <p class="meta">Generated: ${new Date().toLocaleString()} | Total Records: ${filtered.length}</p>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows_html}</tbody>
        </table>
      </body></html>`);
    win.document.close();
    win.print();
  };

  const statusColor = { "Available":"#22C55E", "Out of Stock":"#EF4444", "Low Stock":"#F59E0B" };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Pricing Records</h2>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px" }}>{filtered.length} records found</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={exportCSV} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
            color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px",
            fontWeight:"600", cursor:"pointer"
          }}>
            <Download size={15}/> Export CSV
          </button>
          <button onClick={exportExcel} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)",
            color:"#22C55E", borderRadius:"8px", padding:"8px 16px", fontSize:"13px",
            fontWeight:"600", cursor:"pointer"
          }}>
            <Download size={15}/> Export Excel
          </button>
          <button onClick={handlePrint} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)",
            color:"#F59E0B", borderRadius:"8px", padding:"8px 16px", fontSize:"13px",
            fontWeight:"600", cursor:"pointer"
          }}>
            <Printer size={15}/> Print
          </button>
        </div>
      </div>

      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 16px",
          borderBottom:"1px solid rgba(255,255,255,0.08)", flexWrap:"wrap" }}>
          <div style={{ position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }}/>
            <input
              type="text"
              placeholder="Search pricing records..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft:"30px", padding:"7px 12px 7px 30px", background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff",
                fontSize:"13px", outline:"none", width:"250px" }}
            />
          </div>
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", marginLeft:"auto" }}>
            Showing {paginated.length} of {filtered.length} records
          </span>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["Department","Vaccine","Hospital","Location","Manufacturer","Price","Insurance","Status"].map((h) => (
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:"11px",
                    fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase",
                    letterSpacing:"0.4px", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} style={{ padding:"2rem", textAlign:"center", color:"rgba(255,255,255,0.4)" }}>No records found</td></tr>
              ) : paginated.map((r, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", transition:"background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.85)" }}>{r.dept}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.85)" }}>{r.vaccine}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.85)" }}>{r.hospital}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.6)", fontSize:"12px" }}>{r.location}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.7)" }}>{r.mfg}</td>
                  <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"600" }}>₹{r.price}</td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ fontSize:"11px", fontWeight:"600", padding:"3px 10px", borderRadius:"20px",
                      background: r.insurance==="No" ? "rgba(148,163,184,0.1)" : "rgba(34,197,94,0.12)",
                      color: r.insurance==="No" ? "rgba(255,255,255,0.5)" : "#4ADE80",
                      border: r.insurance==="No" ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(34,197,94,0.25)" }}>
                      {r.insurance==="No" ? "✗" : "✓"} {r.insurance}
                    </span>
                  </td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ fontSize:"11px", fontWeight:"600", padding:"3px 10px", borderRadius:"20px",
                      color: statusColor[r.status] || "#fff",
                      background: `${statusColor[r.status]}20` || "transparent",
                      border: `1px solid ${statusColor[r.status]}40` || "none" }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"12px 16px", borderTop:"1px solid rgba(255,255,255,0.08)", flexWrap:"wrap", gap:"8px" }}>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display:"flex", gap:"4px" }}>
            <button onClick={() => setPage(1)} disabled={page===1}
              style={{ padding:"5px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"6px", color:page===1?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer" }}>«</button>
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              style={{ padding:"5px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"6px", color:page===1?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer" }}>Previous</button>
            <span style={{ padding:"5px 12px", background:"#1565C0", borderRadius:"6px", color:"#fff", fontSize:"12px" }}>{page}</span>
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ padding:"5px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"6px", color:page===totalPages?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer" }}>Next</button>
            <button onClick={() => setPage(totalPages)} disabled={page===totalPages}
              style={{ padding:"5px 10px", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"6px", color:page===totalPages?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer" }}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
