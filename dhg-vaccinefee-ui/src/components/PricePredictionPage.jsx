import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { TrendingUp, TrendingDown, Minus, Download } from "lucide-react";

const COLORS = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC"];

// Simple linear regression
function linearRegression(data) {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0]?.y || 0 };
  const sumX  = data.reduce((s, d) => s + d.x, 0);
  const sumY  = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumX2 = data.reduce((s, d) => s + d.x * d.x, 0);
  const slope     = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

// Generate simulated monthly history + 3-month prediction
function generatePrediction(basePrice, vaccineId) {
  const seed    = vaccineId * 17;
  const months  = ["Aug'25","Sep'25","Oct'25","Nov'25","Dec'25","Jan'26","Feb'26","Mar'26","Apr'26","May'26"];
  const future  = ["Jun'26","Jul'26","Aug'26"];
  const history = [];
  let price = basePrice * (0.85 + (seed % 10) * 0.02);

  months.forEach((month, i) => {
    const noise = ((seed * (i + 1)) % 100 - 50) / 1000;
    price = Math.max(basePrice * 0.7, price * (1 + noise));
    history.push({ month, price: Math.round(price), actual: true });
  });

  // Linear regression on history
  const regData = history.map((d, i) => ({ x: i, y: d.price }));
  const { slope, intercept } = linearRegression(regData);

  future.forEach((month, i) => {
    const x         = history.length + i;
    const predicted = Math.round(intercept + slope * x);
    const lower     = Math.round(predicted * 0.95);
    const upper     = Math.round(predicted * 1.05);
    history.push({ month, predicted, lower, upper, actual: false });
  });

  const lastActual  = history.filter((d) => d.actual).slice(-1)[0]?.price || basePrice;
  const lastPred    = history.filter((d) => !d.actual).slice(-1)[0]?.predicted || basePrice;
  const changePct   = ((lastPred - lastActual) / lastActual * 100).toFixed(1);

  return { data: history, changePct, slope, lastActual, lastPred };
}

export default function PricePredictionPage({ pricing = [], vaccines = [], hospitals = [] }) {
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  // Vaccines with pricing
  const availableVaccines = useMemo(() => {
    const ids = [...new Set(pricing.map((p) => p.vaccine_id))];
    return ids.map((id) => vaccineMap[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  }, [pricing, vaccineMap]);

  const toggleVaccine = (v) => {
    setSelectedVaccines((prev) =>
      prev.find((x) => x.id === v.id)
        ? prev.filter((x) => x.id !== v.id)
        : prev.length < 5 ? [...prev, v] : prev
    );
  };

  // Generate predictions for selected vaccines
  const predictions = useMemo(() => {
    return selectedVaccines.map((v, i) => {
      const records = pricing.filter((p) => p.vaccine_id === v.id &&
        (selectedHospital ? hospitalMap[p.hospital_id]?.name === selectedHospital : true));
      const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
      const avg     = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 500;
      return { ...v, ...generatePrediction(avg, v.id), color: COLORS[i], avgPrice: avg };
    });
  }, [selectedVaccines, pricing, hospitalMap, selectedHospital]);

  // Merge chart data
  const chartData = useMemo(() => {
    if (!predictions.length) return [];
    const allMonths = predictions[0]?.data.map((d) => d.month) || [];
    return allMonths.map((month, mi) => {
      const point = { month };
      predictions.forEach((pred) => {
        const d = pred.data[mi];
        if (d.actual) {
          point[`${pred.name}_actual`] = d.price;
        } else {
          point[`${pred.name}_pred`]  = d.predicted;
          point[`${pred.name}_upper`] = d.upper;
          point[`${pred.name}_lower`] = d.lower;
        }
      });
      return point;
    });
  }, [predictions]);

  const exportCSV = () => {
    if (!predictions.length) return;
    const rows = [
      ["Month", ...predictions.flatMap((p) => [`${p.name} Actual`, `${p.name} Predicted`])],
      ...chartData.map((d) => [
        d.month,
        ...predictions.flatMap((p) => [
          d[`${p.name}_actual`] || "",
          d[`${p.name}_pred`]   || "",
        ])
      ])
    ];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "price-prediction.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Price Prediction</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>
            3-month price forecast using linear regression on historical trends
          </p>
        </div>
        <button onClick={exportCSV} disabled={!predictions.length}
          style={{ display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
            color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px",
            fontWeight:"600", cursor:"pointer", opacity: predictions.length ? 1 : 0.5 }}>
          <Download size={15}/> Export CSV
        </button>
      </div>

      {/* Controls */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"12px", marginBottom:"20px" }}>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", padding:"14px 16px" }}>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"10px" }}>
            Select up to 5 vaccines to predict (click to toggle):
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
            {availableVaccines.slice(0, 25).map((v, i) => {
              const sel = selectedVaccines.find((x) => x.id === v.id);
              const ci  = selectedVaccines.indexOf(sel);
              return (
                <button key={v.id} onClick={() => toggleVaccine(v)}
                  style={{ padding:"5px 12px", borderRadius:"20px", fontSize:"11px",
                    fontWeight:"500", cursor:"pointer",
                    background: sel ? `${COLORS[ci]}25` : "rgba(255,255,255,0.05)",
                    border: sel ? `1px solid ${COLORS[ci]}` : "1px solid rgba(255,255,255,0.12)",
                    color: sel ? COLORS[ci] : "rgba(255,255,255,0.6)" }}>
                  {v.name.substring(0, 22)}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", padding:"14px 16px", minWidth:"200px" }}>
          <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", marginBottom:"8px" }}>
            Filter by hospital:
          </div>
          <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)}
            style={{ width:"100%", padding:"8px 10px", background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff",
              fontSize:"12px", fontFamily:"inherit" }}>
            <option value="" style={{ background:"#0D1B4B" }}>All Hospitals (Avg)</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.name} style={{ background:"#0D1B4B" }}>{h.name.substring(0, 35)}</option>
            ))}
          </select>
        </div>
      </div>

      {predictions.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>📈</div>
          <div style={{ fontSize:"16px", fontWeight:"500" }}>Select vaccines to see price predictions</div>
          <div style={{ fontSize:"13px", marginTop:"6px" }}>
            ML-powered forecast using linear regression on 10 months of data
          </div>
        </div>
      ) : (
        <>
          {/* Prediction summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${predictions.length},1fr)`,
            gap:"12px", marginBottom:"20px" }}>
            {predictions.map((pred) => {
              const up = parseFloat(pred.changePct) > 0;
              return (
                <div key={pred.id} style={{ background:"rgba(255,255,255,0.07)",
                  border:`1px solid ${pred.color}40`, borderRadius:"12px", padding:"16px",
                  borderTop:`3px solid ${pred.color}` }}>
                  <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px",
                    marginBottom:"10px", lineHeight:1.3 }}>{pred.name.substring(0, 30)}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
                    <div>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>Current</div>
                      <div style={{ fontSize:"18px", fontWeight:"700", color:pred.color }}>₹{pred.lastActual}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>Aug 2026</div>
                      <div style={{ fontSize:"18px", fontWeight:"700", color: up ? "#F87171" : "#4ADE80" }}>
                        ₹{pred.lastPred}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 10px",
                    borderRadius:"8px", background: up ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                    border:`1px solid ${up ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
                    {up ? <TrendingUp size={14} style={{ color:"#F87171" }}/> :
                     parseFloat(pred.changePct) < 0 ? <TrendingDown size={14} style={{ color:"#4ADE80" }}/> :
                     <Minus size={14} style={{ color:"#FCD34D" }}/>}
                    <span style={{ fontSize:"12px", fontWeight:"600",
                      color: up ? "#F87171" : parseFloat(pred.changePct) < 0 ? "#4ADE80" : "#FCD34D" }}>
                      {up ? "+" : ""}{pred.changePct}% predicted
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", padding:"20px", marginBottom:"20px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
              <div style={{ color:"#fff", fontWeight:"600", fontSize:"15px" }}>
                Price Trend & 3-Month Forecast
              </div>
              <div style={{ display:"flex", gap:"16px" }}>
                <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ display:"inline-block", width:"20px", height:"2px", background:"#4FC3F7" }}/>
                  Historical
                </span>
                <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ display:"inline-block", width:"20px", height:"2px", background:"#4FC3F7", borderTop:"2px dashed" }}/>
                  Predicted
                </span>
              </div>
            </div>
            <ReferenceLine />
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top:5, right:30, left:0, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
                <XAxis dataKey="month" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:11 }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fill:"rgba(255,255,255,0.5)", fontSize:11 }} tickLine={false} axisLine={false}
                  tickFormatter={(v) => `₹${v}`}/>
                <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)",
                  borderRadius:"8px", color:"#fff", fontSize:"12px" }}
                  formatter={(v, n) => [`₹${v}`, n.replace(/_actual|_pred/, "")]}/>
                <ReferenceLine x="May'26" stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4"
                  label={{ value:"Today", fill:"rgba(255,255,255,0.4)", fontSize:11 }}/>
                {predictions.map((pred) => (
                  <g key={pred.id}>
                    <Line type="monotone" dataKey={`${pred.name}_actual`} stroke={pred.color}
                      strokeWidth={2.5} dot={{ fill:pred.color, r:3 }} connectNulls={false}
                      name={pred.name}/>
                    <Line type="monotone" dataKey={`${pred.name}_pred`} stroke={pred.color}
                      strokeWidth={2} strokeDasharray="6 3" dot={{ fill:pred.color, r:3 }}
                      connectNulls={false} name={`${pred.name} (predicted)`}/>
                  </g>
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Prediction table */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)",
              color:"#fff", fontWeight:"600", fontSize:"14px" }}>
              Detailed Forecast — Jun to Aug 2026
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding:"10px 16px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                      color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>Vaccine</th>
                    {["May'26 (Current)","Jun'26 (Pred)","Jul'26 (Pred)","Aug'26 (Pred)","3M Change"].map((h) => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"center", fontSize:"10px",
                        fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((pred) => {
                    const preds  = pred.data.filter((d) => !d.actual);
                    const up     = parseFloat(pred.changePct) > 0;
                    return (
                      <tr key={pred.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                        onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ width:"8px", height:"8px", borderRadius:"50%",
                              background:pred.color, flexShrink:0 }}/>
                            <span style={{ color:"rgba(255,255,255,0.85)", fontWeight:"500" }}>
                              {pred.name.substring(0, 30)}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 16px", textAlign:"center", color:"#4FC3F7", fontWeight:"600" }}>
                          ₹{pred.lastActual}
                        </td>
                        {preds.map((p, i) => (
                          <td key={i} style={{ padding:"12px 16px", textAlign:"center" }}>
                            <div style={{ color:"rgba(255,255,255,0.8)", fontWeight:"600" }}>₹{p.predicted}</div>
                            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>
                              ₹{p.lower} – ₹{p.upper}
                            </div>
                          </td>
                        ))}
                        <td style={{ padding:"12px 16px", textAlign:"center" }}>
                          <span style={{ fontSize:"12px", fontWeight:"700", padding:"3px 10px",
                            borderRadius:"20px",
                            background: up ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                            color: up ? "#F87171" : "#4ADE80",
                            border:`1px solid ${up ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}` }}>
                            {up ? "+" : ""}{pred.changePct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop:"12px", fontSize:"11px", color:"rgba(255,255,255,0.3)", textAlign:"center" }}>
            ⚠️ Predictions are based on linear regression of simulated historical data. Not financial advice.
          </div>
        </>
      )}
    </div>
  );
}
