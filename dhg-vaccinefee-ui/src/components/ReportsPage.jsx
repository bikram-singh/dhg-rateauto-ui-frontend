import { useMemo } from "react";
import { theme } from "../theme";
import { Download, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4FC3F7","#1565C0","#26A69A","#FFA726","#EF5350","#AB47BC","#66BB6A","#FF7043"];

export default function ReportsPage({ pricing = [], vaccines = [], hospitals = [], departments = [], darkMode = true }) {
  const t = theme(darkMode);
  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap   = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);
  const departmentMap = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  // Top 10 vaccines by avg price
  const byVaccine = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = vaccineMap[p.vaccine_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, total: 0, count: 0 };
      map[name].total += parseFloat(p.price || 0);
      map[name].count++;
    });
    return Object.values(map)
      .map((v) => ({ name: v.name.substring(0,20), avgPrice: Math.round(v.total / v.count), count: v.count }))
      .sort((a, b) => b.avgPrice - a.avgPrice)
      .slice(0, 10);
  }, [pricing, vaccineMap]);

  // By department
  const byDept = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = departmentMap[p.department_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, count: 0 };
      map[name].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [pricing, departmentMap]);

  // By status
  const byStatus = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const s = p.status || "Available";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [pricing]);

  // Top hospitals by pricing count
  const topHospitals = useMemo(() => {
    const map = {};
    pricing.forEach((p) => {
      const name = hospitalMap[p.hospital_id]?.name || "Unknown";
      if (!map[name]) map[name] = { name, count: 0, total: 0 };
      map[name].count++;
      map[name].total += parseFloat(p.price || 0);
    });
    return Object.values(map)
      .map((h) => ({ ...h, avgPrice: Math.round(h.total / h.count) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [pricing, hospitalMap]);

  const totalRevenue = useMemo(() =>
    pricing.reduce((s, p) => s + parseFloat(p.price || 0), 0), [pricing]);

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const rows = [
      ["Metric","Value"],
      ["Total Pricing Records", pricing.length],
      ["Total Vaccines", vaccines.length],
      ["Total Hospitals", hospitals.length],
      ["Total Departments", departments.length],
      ["Total Revenue (₹)", Math.round(totalRevenue)],
      ["Average Price (₹)", pricing.length ? Math.round(totalRevenue / pricing.length) : 0],
      [],
      ["Top Vaccines by Avg Price"],
      ["Vaccine","Avg Price","Records"],
      ...byVaccine.map((v) => [v.name, v.avgPrice, v.count]),
      [],
      ["Top Hospitals by Records"],
      ["Hospital","Records","Avg Price"],
      ...topHospitals.map((h) => [h.name, h.count, h.avgPrice]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "dhg-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const Card = ({ title, value, sub, color }) => (
    <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:"12px", padding:"18px 22px", borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:"11px", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.6px", fontWeight:"600" }}>{title}</div>
      <div style={{ fontSize:"28px", fontWeight:"700", color: t.text, margin:"6px 0 2px" }}>{value}</div>
      {sub && <div style={{ fontSize:"12px", color: t.textSec }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Reports & Analytics</h2>
          <p style={{ color: t.textSec, fontSize:"13px" }}>Comprehensive vaccine pricing analytics</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={exportCSV} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
            color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer"
          }}><Download size={15}/> Export Report</button>
          <button onClick={handlePrint} style={{
            display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)",
            color:"#F59E0B", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer"
          }}><Printer size={15}/> Print</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:"14px", marginBottom:"22px" }}>
        <Card title="Total Records"    value={pricing.length.toLocaleString()}     color="#4FC3F7" />
        <Card title="Total Vaccines"   value={vaccines.length}                      color="#26A69A" />
        <Card title="Total Hospitals"  value={hospitals.length}                     color="#FFA726" />
        <Card title="Departments"      value={departments.length}                   color="#AB47BC" />
        <Card title="Avg Price"        value={`₹${pricing.length ? Math.round(totalRevenue/pricing.length) : 0}`} color="#22C55E" />
        <Card title="Available"        value={pricing.filter(p=>p.status==="Available").length.toLocaleString()} color="#1565C0" />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        {/* Top Vaccines Bar Chart */}
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Top Vaccines by Avg Price</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byVaccine} margin={{ top:0, right:10, left:0, bottom:40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="name" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:9 }} angle={-35} textAnchor="end" tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false} tickFormatter={(v)=>`₹${v}`}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"12px" }} formatter={(v)=>[`₹${v}`,"Avg Price"]}/>
              <Bar dataKey="avgPrice" fill="#4FC3F7" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Availability Status</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke:"rgba(255,255,255,0.3)" }}>
                {byStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"12px" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Departments and Top Hospitals */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
        {/* By Department */}
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Records by Department</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byDept} layout="vertical" margin={{ top:0, right:30, left:0, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false}/>
              <XAxis type="number" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false}/>
              <YAxis type="category" dataKey="name" tick={{ fill:"rgba(255,255,255,0.6)", fontSize:10 }} tickLine={false} axisLine={false} width={120}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"12px" }}/>
              <Bar dataKey="count" fill="#26A69A" radius={[0,4,4,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Hospitals Table */}
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Top Hospitals by Records</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding:"6px 10px", textAlign:"left", color: t.textSec, fontWeight:"600", fontSize:"10px", textTransform:"uppercase" }}>Hospital</th>
                <th style={{ padding:"6px 10px", textAlign:"right", color: t.textSec, fontWeight:"600", fontSize:"10px", textTransform:"uppercase" }}>Records</th>
                <th style={{ padding:"6px 10px", textAlign:"right", color: t.textSec, fontWeight:"600", fontSize:"10px", textTransform:"uppercase" }}>Avg ₹</th>
              </tr>
            </thead>
            <tbody>
              {topHospitals.map((h, i) => (
                <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding:"8px 10px", color: t.text, fontSize:"12px" }}>{h.name.substring(0,28)}</td>
                  <td style={{ padding:"8px 10px", textAlign:"right", color:"#4FC3F7", fontWeight:"600" }}>{h.count}</td>
                  <td style={{ padding:"8px 10px", textAlign:"right", color:"#4FC3F7", fontWeight:"600" }}>₹{h.avgPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
