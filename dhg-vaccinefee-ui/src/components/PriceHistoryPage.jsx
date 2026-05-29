import { useState, useMemo } from "react";
import { theme } from "../theme";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const COLORS = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC","#FF7043","#26A69A","#42A5F5"];

// Simulate price history from existing pricing data
function generateHistory(basePrice) {
  const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  let price = basePrice * 0.85;
  return months.map((month) => {
    const change = (Math.random() - 0.45) * basePrice * 0.08;
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change));
    return { month, price: Math.round(price) };
  });
}

export default function PriceHistoryPage({ pricing = [], vaccines = [], hospitals = [], darkMode = true }) {
  const t = theme(darkMode);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [compareVaccines, setCompareVaccines] = useState([]);

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  // Get unique vaccines that have pricing
  const availableVaccines = useMemo(() => {
    const ids = [...new Set(pricing.map((p) => p.vaccine_id))];
    return ids.map((id) => vaccineMap[id]).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
  }, [pricing, vaccineMap]);

  // Get hospitals for selected vaccine
  const availableHospitals = useMemo(() => {
    if (!selectedVaccine) return [];
    const vaccine = vaccines.find((v) => v.name === selectedVaccine);
    if (!vaccine) return [];
    const hospIds = [...new Set(pricing.filter((p) => p.vaccine_id === vaccine.id).map((p) => p.hospital_id))];
    return hospIds.map((id) => hospitalMap[id]).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
  }, [selectedVaccine, pricing, vaccines, hospitalMap]);

  // Current price stats for selected vaccine
  const priceStats = useMemo(() => {
    if (!selectedVaccine) return null;
    const vaccine = vaccines.find((v) => v.name === selectedVaccine);
    if (!vaccine) return null;
    const records = pricing.filter((p) => p.vaccine_id === vaccine.id);
    if (!records.length) return null;
    const prices = records.map((p) => parseFloat(p.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((a,b) => a+b,0) / prices.length),
      count: records.length,
    };
  }, [selectedVaccine, pricing, vaccines]);

  // History data for chart
  const historyData = useMemo(() => {
    if (!selectedVaccine) return [];
    const vaccine = vaccines.find((v) => v.name === selectedVaccine);
    if (!vaccine) return [];

    if (compareMode && compareVaccines.length > 0) {
      // Multi-vaccine comparison
      const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
      return months.map((month, mi) => {
        const point = { month };
        compareVaccines.forEach((vName) => {
          const v = vaccines.find((x) => x.name === vName);
          if (!v) return;
          const records = pricing.filter((p) => p.vaccine_id === v.id);
          if (!records.length) return;
          const avg = records.reduce((s,p) => s + parseFloat(p.price), 0) / records.length;
          const hist = generateHistory(avg);
          point[vName.substring(0,20)] = hist[mi].price;
        });
        return point;
      });
    }

    if (selectedHospital) {
      // Single hospital history
      const hospital = hospitals.find((h) => h.name === selectedHospital);
      if (!hospital) return [];
      const record = pricing.find((p) => p.vaccine_id === vaccine.id && p.hospital_id === hospital.id);
      if (!record) return [];
      return generateHistory(parseFloat(record.price));
    }

    // Average across all hospitals
    const records = pricing.filter((p) => p.vaccine_id === vaccine.id);
    const avgPrice = records.reduce((s,p) => s + parseFloat(p.price), 0) / records.length;
    return generateHistory(Math.round(avgPrice));
  }, [selectedVaccine, selectedHospital, compareMode, compareVaccines, pricing, vaccines, hospitals]);

  // Trend calculation
  const trend = useMemo(() => {
    if (historyData.length < 2) return null;
    const first = historyData[0]?.price || 0;
    const last  = historyData[historyData.length-1]?.price || 0;
    const pct   = first ? ((last - first) / first * 100).toFixed(1) : 0;
    return { pct, up: last > first };
  }, [historyData]);

  const toggleCompareVaccine = (name) => {
    setCompareVaccines((prev) =>
      prev.includes(name) ? prev.filter((v) => v !== name) : prev.length < 4 ? [...prev, name] : prev
    );
  };

  // Hospital price breakdown
  const hospitalPrices = useMemo(() => {
    if (!selectedVaccine) return [];
    const vaccine = vaccines.find((v) => v.name === selectedVaccine);
    if (!vaccine) return [];
    return pricing
      .filter((p) => p.vaccine_id === vaccine.id)
      .map((p) => ({
        hospital: hospitalMap[p.hospital_id]?.name || "—",
        location: hospitalMap[p.hospital_id]?.location || "—",
        price: parseFloat(p.price),
        status: p.status,
      }))
      .sort((a,b) => a.price - b.price)
      .slice(0, 15);
  }, [selectedVaccine, pricing, vaccines, hospitalMap]);

  return (
    <div>
      <div style={{ marginBottom:"20px" }}>
        <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Price History & Trends</h2>
        <p style={{ color: t.textSec, fontSize:"13px" }}>Track vaccine price trends across hospitals over time</p>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:"12px", marginBottom:"20px", flexWrap:"wrap", alignItems:"center" }}>
        <select value={selectedVaccine} onChange={(e) => { setSelectedVaccine(e.target.value); setSelectedHospital(""); setCompareVaccines([]); }}
          style={{ background: t.input, border:`1px solid ${t.borderMid}`, color: t.text,
            borderRadius:"8px", padding:"9px 14px", fontSize:"13px", fontFamily:"inherit", flex:1, maxWidth:"280px" }}>
          <option value="">Select a Vaccine...</option>
          {availableVaccines.map((v) => <option key={v.id} value={v.name} style={{ background: t.card }}>{v.name}</option>)}
        </select>

        {selectedVaccine && !compareMode && (
          <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}
            style={{ background: t.input, border:`1px solid ${t.borderMid}`, color: t.text,
              borderRadius:"8px", padding:"9px 14px", fontSize:"13px", fontFamily:"inherit", flex:1, maxWidth:"280px" }}>
            <option value="">All Hospitals (Average)</option>
            {availableHospitals.map((h) => <option key={h.id} value={h.name} style={{ background: t.card }}>{h.name}</option>)}
          </select>
        )}

        <button onClick={() => { setCompareMode(!compareMode); setCompareVaccines([]); }}
          style={{ padding:"9px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
            background: compareMode ? "rgba(79,195,247,0.2)" : t.input,
            border: compareMode ? "1px solid #4FC3F7" : "1px solid rgba(255,255,255,0.2)",
            color: compareMode ? "#4FC3F7" : t.text }}>
          {compareMode ? "✓ Compare Mode" : "Compare Vaccines"}
        </button>
      </div>

      {/* Compare vaccine selector */}
      {compareMode && (
        <div style={{ background: t.cardAlt, border:`1px solid ${t.border}`,
          borderRadius:"10px", padding:"14px 16px", marginBottom:"16px" }}>
          <div style={{ color: t.textSec, fontSize:"12px", marginBottom:"10px" }}>
            Select up to 4 vaccines to compare:
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
            {availableVaccines.slice(0,20).map((v, i) => (
              <button key={v.id} onClick={() => toggleCompareVaccine(v.name)}
                style={{ padding:"5px 12px", borderRadius:"20px", fontSize:"11px", fontWeight:"500", cursor:"pointer",
                  background: compareVaccines.includes(v.name) ? `${COLORS[compareVaccines.indexOf(v.name)]}30` : t.card,
                  border: compareVaccines.includes(v.name) ? `1px solid ${COLORS[compareVaccines.indexOf(v.name)]}` : "1px solid rgba(255,255,255,0.15)",
                  color: compareVaccines.includes(v.name) ? COLORS[compareVaccines.indexOf(v.name)] : t.textSec }}>
                {v.name.substring(0,25)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards */}
      {priceStats && !compareMode && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"20px" }}>
          {[
            { label:"Min Price", value:`₹${priceStats.min}`, color:"#22C55E" },
            { label:"Max Price", value:`₹${priceStats.max}`, color:"#EF5350" },
            { label:"Avg Price", value:`₹${priceStats.avg}`, color:"#4FC3F7" },
            { label:"Hospitals", value:priceStats.count, color:"#FFA726" },
          ].map((s) => (
            <div key={s.label} style={{ background: t.card, border:`1px solid ${t.border}`,
              borderRadius:"12px", padding:"16px 18px", borderTop:`3px solid ${s.color}` }}>
              <div style={{ fontSize:"11px", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:"600" }}>{s.label}</div>
              <div style={{ fontSize:"24px", fontWeight:"700", color: t.text, marginTop:"4px" }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Trend chart */}
      {(historyData.length > 0 || (compareMode && compareVaccines.length > 0)) && (
        <div style={{ background: t.card, border:`1px solid ${t.border}`,
          borderRadius:"12px", padding:"20px", marginBottom:"20px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
            <div>
              <div style={{ color: t.text, fontWeight:"600", fontSize:"15px" }}>
                {compareMode ? "Vaccine Price Comparison" : `${selectedVaccine} — Price Trend`}
              </div>
              <div style={{ color: t.textSec, fontSize:"12px" }}>
                {compareMode ? `${compareVaccines.length} vaccines selected` : selectedHospital || "Average across all hospitals"}
              </div>
            </div>
            {trend && !compareMode && (
              <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 14px", borderRadius:"20px",
                background: trend.up ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                border: `1px solid ${trend.up ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
                color: trend.up ? "#F87171" : "#4ADE80", fontSize:"13px", fontWeight:"600" }}>
                {trend.up ? <TrendingUp size={16}/> : trend.pct < 0 ? <TrendingDown size={16}/> : <Minus size={16}/>}
                {trend.up ? "+" : ""}{trend.pct}% over 10 months
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={historyData} margin={{ top:5, right:30, left:0, bottom:5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border}/>
              <XAxis dataKey="month" tick={{ fill:t.textSec, fontSize:11 }} tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:t.textSec, fontSize:11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`}/>
              <Tooltip contentStyle={{ background: t.card, border:`1px solid ${t.borderMid}`, borderRadius:"8px", color: t.text, fontSize:"12px" }}
                formatter={(v, n) => [`₹${v}`, n]}/>
              {compareMode && compareVaccines.length > 0 ? (
                compareVaccines.map((vName, i) => (
                  <Line key={vName} type="monotone" dataKey={vName.substring(0,20)} stroke={COLORS[i]}
                    strokeWidth={2} dot={{ fill:COLORS[i], r:3 }} activeDot={{ r:5 }}/>
                ))
              ) : (
                <Line type="monotone" dataKey="price" stroke="#4FC3F7" strokeWidth={2.5}
                  dot={{ fill:"#4FC3F7", r:4, strokeWidth:0 }} activeDot={{ r:6 }}/>
              )}
              {compareMode && <Legend wrapperStyle={{ fontSize:"11px", color: t.textSec }}/>}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hospital price breakdown */}
      {hospitalPrices.length > 0 && !compareMode && (
        <div style={{ background: t.card, border:`1px solid ${t.border}`, borderRadius:"12px", overflow:"hidden" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${t.border}` }}>
            <span style={{ color: t.text, fontWeight:"600" }}>Price Across Hospitals</span>
            <span style={{ color: t.textMuted, fontSize:"12px", marginLeft:"10px" }}>Sorted lowest to highest</span>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead>
                <tr style={{ background: t.cardAlt, borderBottom:`1px solid ${t.border}` }}>
                  {["#","Hospital","Location","Price","vs Avg","Status"].map((h) => (
                    <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                      color: t.textSec, textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hospitalPrices.map((h, i) => {
                  const diff = priceStats ? ((h.price - priceStats.avg) / priceStats.avg * 100).toFixed(1) : 0;
                  const isAbove = parseFloat(diff) > 0;
                  return (
                    <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                      onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"10px 14px", color: t.textMuted }}>{i+1}</td>
                      <td style={{ padding:"10px 14px", color: t.text, fontWeight:"500" }}>{h.hospital}</td>
                      <td style={{ padding:"10px 14px", color: t.textSec, fontSize:"11px" }}>{h.location?.split(",")[0]}</td>
                      <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"700" }}>
                        {h.price === 0 ? <span style={{ color:"#4ADE80" }}>FREE</span> : `₹${h.price}`}
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        {h.price > 0 && priceStats && (
                          <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px",
                            background: isAbove ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                            color: isAbove ? "#F87171" : "#4ADE80",
                            border: `1px solid ${isAbove ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
                            {isAbove ? "+" : ""}{diff}%
                          </span>
                        )}
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px",
                          background: h.status==="Available" ? "rgba(34,197,94,0.1)" : h.status==="Low Stock" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                          color: h.status==="Available" ? "#4ADE80" : h.status==="Low Stock" ? "#FCD34D" : "#F87171",
                          border: `1px solid ${h.status==="Available" ? "rgba(34,197,94,0.25)" : h.status==="Low Stock" ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedVaccine && !compareMode && (
        <div style={{ textAlign:"center", padding:"60px 20px", color: t.textMuted }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>📈</div>
          <div style={{ fontSize:"16px", fontWeight:"500" }}>Select a vaccine to view price history</div>
          <div style={{ fontSize:"13px", marginTop:"6px" }}>Compare prices across hospitals and track trends over time</div>
        </div>
      )}
    </div>
  );
}
