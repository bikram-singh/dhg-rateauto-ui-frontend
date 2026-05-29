import { useState, useMemo, useRef } from "react";
import { theme } from "../theme";
import { Download, Printer, Mail, BarChart2, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC","#FF7043","#42A5F5","#26A69A"];

export default function AdvancedReportsPage({ pricing = [], vaccines = [], hospitals = [], departments = [], darkMode = true }) {
  const t = theme(darkMode);
  const [emailTo, setEmailTo]         = useState("");
  const [emailSent, setEmailSent]     = useState(false);
  const [sending, setSending]         = useState(false);
  const [reportType, setReportType]   = useState("executive");
  const reportRef                     = useRef(null);

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const totalRevenue = useMemo(() =>
    pricing.reduce((s, p) => s + parseFloat(p.price || 0), 0), [pricing]);

  const avgPrice = pricing.length ? Math.round(totalRevenue / pricing.length) : 0;

  // Top vaccines by avg price
  const topVaccines = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = vaccineMap[p.vaccine_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, total:0, count:0 };
      map[name].total += parseFloat(p.price || 0);
      map[name].count++;
    });
    return Object.values(map)
      .map((v) => ({ name: v.name.substring(0,18), avgPrice: Math.round(v.total/v.count), count: v.count }))
      .sort((a,b) => b.avgPrice - a.avgPrice).slice(0,8);
  }, [pricing, vaccineMap]);

  // By department
  const byDept = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = departmentMap[p.department_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, count:0 };
      map[name].count++;
    });
    return Object.values(map).sort((a,b) => b.count - a.count);
  }, [pricing, departmentMap]);

  // Status distribution
  const statusDist = useMemo(() => {
    const map = {};
    pricing.forEach((p) => { const s = p.status||"Available"; map[s]=(map[s]||0)+1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [pricing]);

  // Top hospitals
  const topHospitals = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = hospitalMap[p.hospital_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, count:0, total:0 };
      map[name].count++; map[name].total += parseFloat(p.price||0);
    });
    return Object.values(map)
      .map((h) => ({ ...h, avgPrice: Math.round(h.total/h.count) }))
      .sort((a,b) => b.count - a.count).slice(0,10);
  }, [pricing, hospitalMap]);

  // Export PDF via print
  const exportPDF = () => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>DHG Advanced Report — ${new Date().toLocaleDateString()}</title>
      <style>
        body{font-family:sans-serif;padding:30px;color:#1E293B}
        h1{color:#0D47A1;border-bottom:3px solid #1565C0;padding-bottom:10px}
        h2{color:#1565C0;margin-top:24px;font-size:16px}
        .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0}
        .kpi{background:#EEF4FF;border-radius:8px;padding:14px;text-align:center;border-left:4px solid #1565C0}
        .kpi-val{font-size:24px;font-weight:700;color:#0D47A1}
        .kpi-lbl{font-size:11px;color:#64748B;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px}
        table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}
        th{background:#1565C0;color:white;padding:8px 12px;text-align:left;font-size:11px}
        td{padding:7px 12px;border-bottom:1px solid #EEF2F7}
        tr:nth-child(even) td{background:#F8FAFF}
        .footer{margin-top:30px;padding-top:12px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center}
        @media print{body{padding:15px}}
      </style></head>
      <body>
        <h1>🏥 DHG Vaccine Pricing — Advanced Report</h1>
        <p style="color:#64748B;font-size:12px">Generated: ${new Date().toLocaleString()} | Report Type: ${reportType.toUpperCase()}</p>

        <h2>Executive Summary</h2>
        <div class="kpi-grid">
          <div class="kpi"><div class="kpi-val">${vaccines.length}</div><div class="kpi-lbl">Total Vaccines</div></div>
          <div class="kpi"><div class="kpi-val">${hospitals.length}</div><div class="kpi-lbl">Hospitals</div></div>
          <div class="kpi"><div class="kpi-val">${pricing.length.toLocaleString()}</div><div class="kpi-lbl">Pricing Records</div></div>
          <div class="kpi"><div class="kpi-val">₹${avgPrice}</div><div class="kpi-lbl">Avg Price</div></div>
        </div>

        <h2>Top Vaccines by Average Price</h2>
        <table>
          <thead><tr><th>#</th><th>Vaccine</th><th>Avg Price</th><th>Records</th></tr></thead>
          <tbody>${topVaccines.map((v,i)=>`<tr><td>${i+1}</td><td>${v.name}</td><td>₹${v.avgPrice}</td><td>${v.count}</td></tr>`).join("")}</tbody>
        </table>

        <h2>Top Hospitals by Coverage</h2>
        <table>
          <thead><tr><th>#</th><th>Hospital</th><th>Records</th><th>Avg Price</th></tr></thead>
          <tbody>${topHospitals.map((h,i)=>`<tr><td>${i+1}</td><td>${h.name}</td><td>${h.count}</td><td>₹${h.avgPrice}</td></tr>`).join("")}</tbody>
        </table>

        <h2>Records by Department</h2>
        <table>
          <thead><tr><th>Department</th><th>Records</th></tr></thead>
          <tbody>${byDept.map((d)=>`<tr><td>${d.name}</td><td>${d.count}</td></tr>`).join("")}</tbody>
        </table>

        <h2>Stock Availability</h2>
        <table>
          <thead><tr><th>Status</th><th>Count</th><th>%</th></tr></thead>
          <tbody>${statusDist.map((s)=>`<tr><td>${s.name}</td><td>${s.value}</td><td>${Math.round(s.value/pricing.length*100)}%</td></tr>`).join("")}</tbody>
        </table>

        <div class="footer">DHG Vaccine Pricing Dashboard • Confidential • ${new Date().getFullYear()}</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  // Simulate email sending via SendGrid (shows instructions in production)
  const sendEmail = async () => {
    if (!emailTo || !emailTo.includes("@")) return;
    setSending(true);
    // In production: POST to /vaccinefee/api/reports/email with emailTo and report data
    // For now simulate with timeout
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Advanced Reports</h2>
          <p style={{ color: t.textSec, fontSize:"13px" }}>PDF export, analytics and email scheduling</p>
        </div>
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          <button onClick={exportPDF} style={{ display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)",
            color:"#F87171", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
            <FileText size={15}/> Export PDF
          </button>
          <button onClick={() => window.print()} style={{ display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)",
            color:"#FCD34D", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
            <Printer size={15}/> Print
          </button>
        </div>
      </div>

      {/* Report type selector */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {["executive","detailed","pricing","hospitals"].map((t) => (
          <button key={t} onClick={() => setReportType(t)}
            style={{ padding:"7px 16px", borderRadius:"20px", fontSize:"12px", fontWeight:"500", cursor:"pointer",
              background: reportType===t ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)",
              border: reportType===t ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.12)",
              color: reportType===t ? "#4FC3F7" : "rgba(255,255,255,0.6)", textTransform:"capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" }}>
        {[
          { label:"Total Records", value:pricing.length.toLocaleString(), color:"#4FC3F7" },
          { label:"Vaccines", value:vaccines.length, color:"#FFA726" },
          { label:"Hospitals", value:hospitals.length, color:"#66BB6A" },
          { label:"Avg Price", value:`₹${avgPrice}`, color:"#AB47BC" },
        ].map((k) => (
          <div key={k.label} style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", padding:"16px 20px", borderTop:`3px solid ${k.color}` }}>
            <div style={{ fontSize:"11px", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:"600" }}>{k.label}</div>
            <div style={{ fontSize:"26px", fontWeight:"700", color: t.text, marginTop:"4px" }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Top Vaccines by Avg Price</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topVaccines} margin={{ top:0, right:10, left:0, bottom:40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="name" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:9 }} angle={-35} textAnchor="end" tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`₹${v}`}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"12px" }} formatter={(v)=>[`₹${v}`,"Avg Price"]}/>
              <Bar dataKey="avgPrice" fill="#4FC3F7" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Availability Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusDist} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke:"rgba(255,255,255,0.3)" }}>
                {statusDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"12px" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top hospitals table */}
      <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden", marginBottom:"20px" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)", color: t.text, fontWeight:"600", fontSize:"14px" }}>
          Top Hospitals by Coverage
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background: t.cardAlt, borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["#","Hospital","Pricing Records","Avg Price"].map((h) => (
                  <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                    color: t.textSec, textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topHospitals.map((h, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 16px", color: t.textMuted }}>{i+1}</td>
                  <td style={{ padding:"10px 16px", color: t.text, fontWeight:"500" }}>{h.name}</td>
                  <td style={{ padding:"10px 16px", color:"#4FC3F7", fontWeight:"600" }}>{h.count}</td>
                  <td style={{ padding:"10px 16px", color:"#FFA726", fontWeight:"600" }}>₹{h.avgPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email section */}
      <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
          <Mail size={18} style={{ color:"#4FC3F7" }}/>
          <span style={{ color: t.text, fontWeight:"600", fontSize:"14px" }}>Email Report</span>
          <span style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px",
            background:"rgba(245,158,11,0.15)", color:"#FCD34D", border:"1px solid rgba(245,158,11,0.3)" }}>
            Requires SendGrid API key
          </span>
        </div>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)}
            placeholder="Enter email address..."
            type="email"
            style={{ flex:1, minWidth:"200px", padding:"9px 14px", background: t.input,
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text,
              fontSize:"13px", fontFamily:"inherit", outline:"none" }}/>
          <button onClick={sendEmail} disabled={sending || !emailTo}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"9px 20px",
              borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
              background: emailSent ? "rgba(34,197,94,0.2)" : "rgba(79,195,247,0.15)",
              border: emailSent ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(79,195,247,0.3)",
              color: emailSent ? "#4ADE80" : "#4FC3F7",
              opacity: !emailTo ? 0.5 : 1 }}>
            <Mail size={15}/>
            {sending ? "Sending..." : emailSent ? "✓ Sent!" : "Send Report"}
          </button>
        </div>
        <p style={{ fontSize:"11px", color: t.textMuted, marginTop:"10px" }}>
          To enable email: add SENDGRID_API_KEY to backend secrets and uncomment the /reports/email endpoint.
        </p>
      </div>
    </div>
  );
}
