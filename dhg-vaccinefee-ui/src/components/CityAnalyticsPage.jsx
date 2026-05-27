import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, Legend } from "recharts";
import { Download } from "lucide-react";

const CITIES = ["New Delhi","Noida","Mumbai","Bengaluru","Hyderabad","Pune","Chennai","Kolkata","Jaipur","Ahmedabad"];
const COLORS  = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC","#FF7043","#42A5F5","#26A69A","#EC407A","#FFCA28"];

export default function CityAnalyticsPage({ pricing = [], vaccines = [], hospitals = [] }) {
  const [selectedCities, setSelectedCities] = useState(["New Delhi","Mumbai","Bengaluru"]);
  const [metric, setMetric] = useState("vaccines");

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : prev.length < 5 ? [...prev, city] : prev
    );
  };

  // Build city stats
  const cityStats = useMemo(() => {
    return CITIES.map((city) => {
      const cityHospitals = hospitals.filter((h) => (h.location || "").startsWith(city));
      const cityPricing   = pricing.filter((p) => cityHospitals.some((h) => h.id === p.hospital_id));
      const prices        = cityPricing.map((p) => parseFloat(p.price)).filter((p) => p > 0);
      const available     = cityPricing.filter((p) => p.status === "Available").length;
      const insured       = cityPricing.filter((p) => p.insurance_covered !== "No").length;
      const uniqueVaccines = new Set(cityPricing.map((p) => p.vaccine_id)).size;

      return {
        city,
        hospitals:    cityHospitals.length,
        vaccines:     uniqueVaccines,
        avgPrice:     prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
        minPrice:     prices.length ? Math.min(...prices) : 0,
        available,
        insured,
        totalPricing: cityPricing.length,
        availPct:     cityPricing.length ? Math.round((available/cityPricing.length)*100) : 0,
        insuredPct:   cityPricing.length ? Math.round((insured/cityPricing.length)*100) : 0,
        score:        Math.round((uniqueVaccines * 0.4) + (cityHospitals.length * 2) + (available * 0.1)),
      };
    });
  }, [hospitals, pricing]);

  const selectedStats = cityStats.filter((c) => selectedCities.includes(c.city));

  // Bar chart data
  const barData = selectedStats.map((c, i) => ({
    city: c.city.replace(" ", "\n"),
    Hospitals: c.hospitals,
    Vaccines: c.vaccines,
    "Avg Price (₹100s)": Math.round(c.avgPrice / 100),
    "Available%": c.availPct,
  }));

  // Radar data
  const radarData = [
    { metric: "Hospitals",   ...Object.fromEntries(selectedStats.map((c) => [c.city, Math.min(100, c.hospitals * 5)])) },
    { metric: "Vaccines",    ...Object.fromEntries(selectedStats.map((c) => [c.city, Math.min(100, c.vaccines * 2)])) },
    { metric: "Availability",...Object.fromEntries(selectedStats.map((c) => [c.city, c.availPct])) },
    { metric: "Insurance",   ...Object.fromEntries(selectedStats.map((c) => [c.city, c.insuredPct])) },
    { metric: "Low Price",   ...Object.fromEntries(selectedStats.map((c) => [c.city, Math.max(0, 100 - c.avgPrice/100)])) },
    { metric: "Coverage",    ...Object.fromEntries(selectedStats.map((c) => [c.city, Math.min(100, c.score)])) },
  ];

  const exportCSV = () => {
    const rows = [
      ["City","Hospitals","Unique Vaccines","Avg Price","Min Price","Available","Insured","Available%","Score"],
      ...cityStats.map((c) => [c.city,c.hospitals,c.vaccines,c.avgPrice,c.minPrice,c.available,c.insured,`${c.availPct}%`,c.score])
    ];
    const blob = new Blob([rows.map((r)=>r.join(",")).join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download="city-analytics.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>City-wise Analytics</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Compare vaccine coverage across Indian cities</p>
        </div>
        <button onClick={exportCSV} style={{ display:"flex", alignItems:"center", gap:"6px",
          background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
          color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
          <Download size={15}/> Export CSV
        </button>
      </div>

      {/* City selector */}
      <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", padding:"14px 16px", marginBottom:"20px" }}>
        <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"10px" }}>
          Select up to 5 cities to compare:
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
          {CITIES.map((city, i) => (
            <button key={city} onClick={() => toggleCity(city)}
              style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"500", cursor:"pointer",
                background: selectedCities.includes(city) ? `${COLORS[i]}25` : "rgba(255,255,255,0.05)",
                border: selectedCities.includes(city) ? `1px solid ${COLORS[i]}` : "1px solid rgba(255,255,255,0.12)",
                color: selectedCities.includes(city) ? COLORS[i] : "rgba(255,255,255,0.6)" }}>
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(selectedStats.length,3)},1fr)`, gap:"12px", marginBottom:"20px" }}>
        {selectedStats.map((c, i) => (
          <div key={c.city} style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${COLORS[i]}40`,
            borderRadius:"12px", padding:"16px", borderTop:`3px solid ${COLORS[i]}` }}>
            <div style={{ color:"#fff", fontWeight:"700", fontSize:"15px", marginBottom:"12px" }}>{c.city}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
              {[
                { label:"Hospitals", value:c.hospitals, color:COLORS[i] },
                { label:"Vaccines",  value:c.vaccines,  color:COLORS[i] },
                { label:"Avg Price", value:`₹${c.avgPrice}`, color:"#4FC3F7" },
                { label:"Available", value:`${c.availPct}%`, color:"#4ADE80" },
                { label:"Insured",   value:`${c.insuredPct}%`, color:"#AB47BC" },
                { label:"Score",     value:c.score, color:"#FFD700" },
              ].map((s) => (
                <div key={s.label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"8px", padding:"8px 10px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Hospitals & Vaccines by City</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top:0, right:10, left:0, bottom:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="city" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff", fontSize:"12px" }}/>
              <Bar dataKey="Hospitals" fill="#4FC3F7" radius={[4,4,0,0]}/>
              <Bar dataKey="Vaccines"  fill="#FFA726" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"18px" }}>
          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>Coverage Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)"/>
              <PolarAngleAxis dataKey="metric" tick={{ fill:"rgba(255,255,255,0.6)", fontSize:10 }}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff", fontSize:"12px" }}/>
              {selectedStats.map((c, i) => (
                <Radar key={c.city} name={c.city} dataKey={c.city} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.12}/>
              ))}
              <Legend wrapperStyle={{ fontSize:"11px", color:"rgba(255,255,255,0.6)" }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full city table */}
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ color:"#fff", fontWeight:"600" }}>All Cities — Complete Comparison</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["City","Hospitals","Vaccines","Avg Price","Min Price","Available","Insured%","Score"].map((h) => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                    color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cityStats.sort((a,b)=>b.score-a.score).map((c, i) => (
                <tr key={c.city} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ fontSize:"14px" }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"  "}</span>
                      <span style={{ color:"#fff", fontWeight:"500" }}>{c.city}</span>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"600" }}>{c.hospitals}</td>
                  <td style={{ padding:"10px 14px", color:"#FFA726", fontWeight:"600" }}>{c.vaccines}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.8)" }}>₹{c.avgPrice}</td>
                  <td style={{ padding:"10px 14px", color:"#4ADE80" }}>₹{c.minPrice}</td>
                  <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.8)" }}>{c.available}</td>
                  <td style={{ padding:"10px 14px", color:"#AB47BC", fontWeight:"600" }}>{c.insuredPct}%</td>
                  <td style={{ padding:"10px 14px" }}>
                    <span style={{ fontSize:"14px", fontWeight:"700",
                      color:c.score>50?"#4ADE80":c.score>30?"#FCD34D":"#F87171" }}>{c.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
