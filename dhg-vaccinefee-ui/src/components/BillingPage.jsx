import { useMemo } from "react";
import { Download, Printer, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";

export default function BillingPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const deptMap     = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const invoices = useMemo(() => pricing.slice(0, 50).map((p, i) => ({
    id:        `INV-2026-${String(p.id || i+1).padStart(4,"0")}`,
    vaccine:   vaccineMap[p.vaccine_id]?.name    || p.vaccine?.name    || "—",
    hospital:  hospitalMap[p.hospital_id]?.name  || p.hospital?.name   || "—",
    dept:      deptMap[p.department_id]?.name    || p.department?.name || "—",
    amount:    parseFloat(p.price || 0),
    insurance: p.insurance_covered || "No",
    status:    p.status === "Available" ? "Paid" : p.status === "Out of Stock" ? "Pending" : "Draft",
    date:      new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
  })), [pricing, vaccineMap, hospitalMap, deptMap]);

  const totalAmount  = invoices.reduce((s, i) => s + i.amount, 0);
  const paidAmount   = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const pendingAmt   = invoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const paidCount    = invoices.filter((i) => i.status === "Paid").length;
  const pendingCount = invoices.filter((i) => i.status === "Pending").length;
  const draftCount   = invoices.filter((i) => i.status === "Draft").length;

  const statusStyle = {
    Paid:    { bg:"rgba(34,197,94,0.12)",  color:"#4ADE80", border:"rgba(34,197,94,0.25)",  icon:<CheckCircle size={13}/> },
    Pending: { bg:"rgba(245,158,11,0.12)", color:"#FCD34D", border:"rgba(245,158,11,0.25)", icon:<Clock size={13}/> },
    Draft:   { bg:"rgba(148,163,184,0.1)", color:"rgba(255,255,255,0.5)", border:"rgba(148,163,184,0.2)", icon:<XCircle size={13}/> },
  };

  const exportCSV = () => {
    const rows = [
      ["Invoice ID","Vaccine","Hospital","Department","Amount","Insurance","Status","Date"],
      ...invoices.map((i) => [i.id, `"${i.vaccine}"`, `"${i.hospital}"`, `"${i.dept}"`, i.amount, i.insurance, i.status, i.date])
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "dhg-billing.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>DHG Billing Report</title>
      <style>
        body{font-family:sans-serif;font-size:12px;padding:20px}
        h2{color:#0D47A1}
        .meta{color:#666;font-size:11px;margin-bottom:16px}
        .summary{display:flex;gap:20px;margin-bottom:20px}
        .sum-card{border:1px solid #ddd;border-radius:8px;padding:12px 18px;text-align:center}
        .sum-val{font-size:22px;font-weight:700;color:#0D47A1}
        table{width:100%;border-collapse:collapse}
        th{background:#1565C0;color:white;padding:8px;text-align:left;font-size:11px}
        td{padding:7px 8px;border-bottom:1px solid #eee;font-size:11px}
        .paid{color:#16A34A;font-weight:600}
        .pending{color:#D97706;font-weight:600}
        .draft{color:#64748B}
      </style></head>
      <body>
        <h2>DHG — Billing Report</h2>
        <p class="meta">Generated: ${new Date().toLocaleString()} | Total Invoices: ${invoices.length}</p>
        <div class="summary">
          <div class="sum-card"><div class="sum-val">₹${Math.round(totalAmount).toLocaleString()}</div><div>Total</div></div>
          <div class="sum-card"><div class="sum-val" style="color:#16A34A">₹${Math.round(paidAmount).toLocaleString()}</div><div>Paid</div></div>
          <div class="sum-card"><div class="sum-val" style="color:#D97706">₹${Math.round(pendingAmt).toLocaleString()}</div><div>Pending</div></div>
        </div>
        <table>
          <thead><tr><th>Invoice ID</th><th>Vaccine</th><th>Hospital</th><th>Department</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>${invoices.map((i) => `
            <tr>
              <td>${i.id}</td><td>${i.vaccine}</td><td>${i.hospital}</td>
              <td>${i.dept}</td><td>₹${i.amount}</td>
              <td class="${i.status.toLowerCase()}">${i.status}</td>
              <td>${i.date}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </body></html>`);
    win.document.close();
    win.print();
  };

  const SumCard = ({ icon, label, value, sub, color }) => (
    <div style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:"12px", padding:"18px 22px", display:"flex", alignItems:"center", gap:"14px" }}>
      <div style={{ width:"44px", height:"44px", borderRadius:"10px", background:`${color}20`,
        display:"flex", alignItems:"center", justifyContent:"center", color, fontSize:"22px", flexShrink:0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:"600" }}>{label}</div>
        <div style={{ fontSize:"22px", fontWeight:"700", color:"#fff", lineHeight:1.2 }}>{value}</div>
        {sub && <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{sub}</div>}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Billing & Invoices</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Vaccine pricing billing overview</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={exportCSV} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
            color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer"
          }}><Download size={15}/> Export CSV</button>
          <button onClick={handlePrint} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)",
            color:"#F59E0B", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer"
          }}><Printer size={15}/> Print</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"14px", marginBottom:"22px" }}>
        <SumCard icon={<CreditCard size={22}/>}  label="Total Billing"   value={`₹${Math.round(totalAmount).toLocaleString()}`}  sub={`${invoices.length} invoices`}    color="#4FC3F7"/>
        <SumCard icon={<CheckCircle size={22}/>} label="Paid"            value={`₹${Math.round(paidAmount).toLocaleString()}`}   sub={`${paidCount} invoices`}           color="#22C55E"/>
        <SumCard icon={<Clock size={22}/>}       label="Pending"         value={`₹${Math.round(pendingAmt).toLocaleString()}`}   sub={`${pendingCount} invoices`}        color="#F59E0B"/>
        <SumCard icon={<XCircle size={22}/>}     label="Draft"           value={draftCount}                                       sub="invoices"                          color="#94A3B8"/>
      </div>

      {/* Invoice Table */}
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color:"#fff", fontWeight:"600", fontSize:"14px" }}>Recent Invoices</span>
          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px", marginLeft:"10px" }}>Showing {invoices.length} records</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["Invoice ID","Vaccine","Hospital","Department","Amount","Insurance","Status","Date"].map((h) => (
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:"10px",
                    fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.4px", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => {
                const s = statusStyle[inv.status] || statusStyle.Draft;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", transition:"background 0.1s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"600", fontFamily:"monospace" }}>{inv.id}</td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.85)" }}>{inv.vaccine.substring(0,22)}</td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.7)" }}>{inv.hospital.substring(0,22)}</td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.6)" }}>{inv.dept}</td>
                    <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"700" }}>₹{inv.amount}</td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:"11px", fontWeight:"600", padding:"3px 10px", borderRadius:"20px",
                        background: inv.insurance==="No"?"rgba(148,163,184,0.1)":"rgba(34,197,94,0.12)",
                        color: inv.insurance==="No"?"rgba(255,255,255,0.5)":"#4ADE80",
                        border: `1px solid ${inv.insurance==="No"?"rgba(148,163,184,0.2)":"rgba(34,197,94,0.25)"}` }}>
                        {inv.insurance==="No"?"✗":"✓"} {inv.insurance}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", fontSize:"11px",
                        fontWeight:"600", padding:"3px 10px", borderRadius:"20px",
                        background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                        {s.icon}{inv.status}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.5)", fontSize:"11px" }}>{inv.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
