import { useMemo } from "react";
import { theme } from "../theme";

export default function DepartmentsPage({ departments = [], pricing = [], darkMode = true }) {
  const t = theme(darkMode);
  const stats = useMemo(() => departments.map((d) => {
    const deptPricing = pricing.filter((p) => p.department_id === d.id);
    const avgPrice = deptPricing.length
      ? Math.round(deptPricing.reduce((s, p) => s + parseFloat(p.price || 0), 0) / deptPricing.length)
      : 0;
    return { ...d, count: deptPricing.length, avgPrice };
  }), [departments, pricing]);

  return (
    <div>
      <div style={{ marginBottom:"16px" }}>
        <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Departments</h2>
        <p style={{ color: t.textSec, fontSize:"13px" }}>{departments.length} departments registered</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"16px" }}>
        {stats.map((d) => (
          <div key={d.id} style={{
            background: t.card, border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", padding:"20px", backdropFilter:"blur(10px)"
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"14px" }}>
              <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:"rgba(79,195,247,0.15)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>🏥</div>
              <div>
                <div style={{ color: t.text, fontWeight:"600", fontSize:"14px" }}>{d.name}</div>
                <div style={{ color: t.textSec, fontSize:"11px" }}>{d.description || "Medical department"}</div>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"#4FC3F7", fontSize:"20px", fontWeight:"700" }}>{d.count}</div>
                <div style={{ color: t.textSec, fontSize:"11px" }}>Pricing Records</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ color:"#4FC3F7", fontSize:"20px", fontWeight:"700" }}>{d.avgPrice > 0 ? `₹${d.avgPrice}` : ""}</div>
                <div style={{ color: t.textSec, fontSize:"11px" }}>Avg Price</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}