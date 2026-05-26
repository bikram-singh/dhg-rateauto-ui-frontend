import { useMemo } from "react";

export default function HospitalsPage({ hospitals = [], pricing = [] }) {
  const stats = useMemo(() => hospitals.map((h) => {
    const hPricing = pricing.filter((p) => p.hospital_id === h.id);
    const avgPrice = hPricing.length
      ? Math.round(hPricing.reduce((s, p) => s + parseFloat(p.price || 0), 0) / hPricing.length)
      : 0;
    return { ...h, count: hPricing.length, avgPrice };
  }), [hospitals, pricing]);

  // Extract city from location
  const getCity = (location) => location ? location.split(",")[0].trim() : "—";

  return (
    <div>
      <div style={{ marginBottom:"16px" }}>
        <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Hospitals</h2>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px" }}>{hospitals.length} hospitals registered worldwide</p>
      </div>
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px" }}>
          <thead>
            <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
              {["#","Hospital Name","City","Location","Vaccines","Avg Price"].map((h) => (
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px",
                  fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((h, i) => (
              <tr key={h.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"11px 16px", color:"rgba(255,255,255,0.4)" }}>{i+1}</td>
                <td style={{ padding:"11px 16px", color:"#fff", fontWeight:"500" }}>{h.name}</td>
                <td style={{ padding:"11px 16px", color:"rgba(255,255,255,0.7)" }}>{getCity(h.location)}</td>
                <td style={{ padding:"11px 16px", color:"rgba(255,255,255,0.6)", fontSize:"12px" }}>{h.location || "—"}</td>
                <td style={{ padding:"11px 16px", color:"#4FC3F7", fontWeight:"600" }}>{h.count}</td>
                <td style={{ padding:"11px 16px", color:"#4FC3F7", fontWeight:"600" }}>₹{h.avgPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
