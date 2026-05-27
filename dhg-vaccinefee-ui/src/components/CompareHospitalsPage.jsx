import { useState, useMemo } from "react";
import { X, Plus, Download } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC","#FF7043"];

export default function CompareHospitalsPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [selectedHospitals, setSelectedHospitals] = useState([]);
  const [searchH, setSearchH]       = useState("");
  const [selectedVaccine, setSelectedVaccine] = useState("all");

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  // Hospitals with pricing
  const hospitalsWithPricing = useMemo(() => {
    const ids = [...new Set(pricing.map((p) => p.hospital_id))];
    return ids.map((id) => hospitalMap[id]).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
  }, [pricing, hospitalMap]);

  const filteredHospitals = useMemo(() =>
    hospitalsWithPricing.filter((h) =>
      h.name.toLowerCase().includes(searchH.toLowerCase()) ||
      (h.location || "").toLowerCase().includes(searchH.toLowerCase())
    ).filter((h) => !selectedHospitals.find((s) => s.id === h.id)),
    [hospitalsWithPricing, searchH, selectedHospitals]
  );

  const addHospital = (h) => {
    if (selectedHospitals.length < 4) setSelectedHospitals([...selectedHospitals, h]);
  };

  const removeHospital = (id) => setSelectedHospitals(selectedHospitals.filter((h) => h.id !== id));

  // Vaccines available across selected hospitals
  const commonVaccines = useMemo(() => {
    if (!selectedHospitals.length) return [];
    const vaccineIds = [...new Set(
      pricing.filter((p) => selectedHospitals.some((h) => h.id === p.hospital_id)).map((p) => p.vaccine_id)
    )];
    return vaccineIds.map((id) => vaccineMap[id]).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
  }, [selectedHospitals, pricing, vaccineMap]);

  // Comparison data
  const comparisonData = useMemo(() => {
    if (!selectedHospitals.length) return [];
    const targetVaccines = selectedVaccine === "all"
      ? commonVaccines.slice(0, 15)
      : commonVaccines.filter((v) => v.id === parseInt(selectedVaccine));

    return targetVaccines.map((vaccine) => {
      const row = { vaccine: vaccine.name.substring(0,25), manufacturer: vaccine.manufacturer };
      selectedHospitals.forEach((h) => {
        const record = pricing.find((p) => p.vaccine_id === vaccine.id && p.hospital_id === h.id);
        row[h.id] = record ? parseFloat(record.price) : null;
        row[`${h.id}_status`] = record?.status || null;
        row[`${h.id}_insurance`] = record?.insurance_covered || null;
      });
      return row;
    });
  }, [selectedHospitals, selectedVaccine, commonVaccines, pricing]);

  // Summary stats per hospital
  const hospitalStats = useMemo(() =>
    selectedHospitals.map((h) => {
      const records = pricing.filter((p) => p.hospital_id === h.id && parseFloat(p.price) > 0);
      const prices  = records.map((p) => parseFloat(p.price));
      return {
        ...h,
        avgPrice:  prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
        minPrice:  prices.length ? Math.min(...prices) : 0,
        maxPrice:  prices.length ? Math.max(...prices) : 0,
        total:     records.length,
        available: pricing.filter((p) => p.hospital_id === h.id && p.status === "Available").length,
      };
    }), [selectedHospitals, pricing]);

  // Radar chart data
  const radarData = useMemo(() => {
    const metrics = ["COVID Vaccines","Flu Vaccines","Pediatric","Travel","Specialist","Total Stock"];
    return metrics.map((metric) => {
      const point = { metric };
      selectedHospitals.forEach((h, i) => {
        const records = pricing.filter((p) => p.hospital_id === h.id);
        let score = 0;
        if (metric === "COVID Vaccines") score = records.filter((p) => [1,41,42,43,44,45,46,47,48,59,60].includes(p.vaccine_id)).length * 10;
        if (metric === "Flu Vaccines")   score = records.filter((p) => [2,39,40,61,62].includes(p.vaccine_id)).length * 20;
        if (metric === "Pediatric")      score = records.filter((p) => [6,7,8,14,18,19,20,23,56].includes(p.vaccine_id)).length * 12;
        if (metric === "Travel")         score = records.filter((p) => [24,25,28,29,30,31,32].includes(p.vaccine_id)).length * 15;
        if (metric === "Specialist")     score = records.filter((p) => [12,13,37,34,35,16,17].includes(p.vaccine_id)).length * 8;
        if (metric === "Total Stock")    score = Math.min(100, records.length * 2);
        point[h.name.substring(0,15)] = Math.min(100, score);
      });
      return point;
    });
  }, [selectedHospitals, pricing]);

  const exportCSV = () => {
    const headers = ["Vaccine","Manufacturer", ...selectedHospitals.map((h) => h.name)];
    const rows = [
      headers.join(","),
      ...comparisonData.map((row) =>
        [`"${row.vaccine}"`, `"${row.manufacturer}"`,
          ...selectedHospitals.map((h) => row[h.id] !== null ? row[h.id] : "N/A")
        ].join(",")
      )
    ];
    const blob = new Blob([rows.join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "hospital-comparison.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"18px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Compare Hospitals</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Side-by-side vaccine price comparison across hospitals</p>
        </div>
        {comparisonData.length > 0 && (
          <button onClick={exportCSV} style={{ display:"flex", alignItems:"center", gap:"6px",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
            color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
            <Download size={15}/> Export CSV
          </button>
        )}
      </div>

      {/* Hospital selector */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        {/* Search panel */}
        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"14px" }}>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"12px", marginBottom:"10px" }}>
            Select up to 4 hospitals to compare:
          </div>
          <input value={searchH} onChange={(e) => setSearchH(e.target.value)} placeholder="Search hospitals..."
            style={{ width:"100%", padding:"8px 12px", background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff",
              fontSize:"12px", outline:"none", marginBottom:"10px" }}/>
          <div style={{ maxHeight:"200px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"4px" }}>
            {filteredHospitals.slice(0,20).map((h) => (
              <button key={h.id} onClick={() => addHospital(h)} disabled={selectedHospitals.length >= 4}
                style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 12px", borderRadius:"8px",
                  background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                  color:"rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer", textAlign:"left" }}>
                <Plus size={13} style={{ flexShrink:0, color:"#4FC3F7" }}/>
                <div>
                  <div style={{ fontWeight:"500" }}>{h.name}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>{h.location?.split(",")[0]}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected hospitals */}
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {selectedHospitals.length === 0 ? (
            <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(255,255,255,0.03)", border:"1px dashed rgba(255,255,255,0.15)",
              borderRadius:"12px", color:"rgba(255,255,255,0.3)", fontSize:"13px" }}>
              Select hospitals from the left →
            </div>
          ) : selectedHospitals.map((h, i) => (
            <div key={h.id} style={{ background:`${COLORS[i]}15`, border:`1px solid ${COLORS[i]}40`,
              borderRadius:"10px", padding:"12px 14px", display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"10px", height:"10px", borderRadius:"50%", background:COLORS[i], flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px" }}>{h.name}</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px" }}>{h.location}</div>
              </div>
              <button onClick={() => removeHospital(h.id)}
                style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer", padding:"2px" }}>
                <X size={16}/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedHospitals.length > 1 && (
        <>
          {/* Summary cards */}
          <div style={{ display:"grid", gridTemplateColumns:`repeat(${selectedHospitals.length},1fr)`, gap:"12px", marginBottom:"20px" }}>
            {hospitalStats.map((h, i) => (
              <div key={h.id} style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${COLORS[i]}40`,
                borderRadius:"12px", padding:"16px", borderTop:`3px solid ${COLORS[i]}` }}>
                <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.8)", fontWeight:"600", marginBottom:"10px",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.name}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Avg Price</span>
                    <span style={{ fontSize:"12px", fontWeight:"700", color:COLORS[i] }}>₹{h.avgPrice}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Min</span>
                    <span style={{ fontSize:"12px", color:"#4ADE80" }}>₹{h.minPrice}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Max</span>
                    <span style={{ fontSize:"12px", color:"#F87171" }}>₹{h.maxPrice}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Vaccines</span>
                    <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)" }}>{h.available}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar chart */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", padding:"18px", marginBottom:"20px" }}>
            <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>
              Hospital Coverage Comparison
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)"/>
                <PolarAngleAxis dataKey="metric" tick={{ fill:"rgba(255,255,255,0.6)", fontSize:11 }}/>
                <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)",
                  borderRadius:"8px", color:"#fff", fontSize:"12px" }}/>
                {selectedHospitals.map((h, i) => (
                  <Radar key={h.id} name={h.name.substring(0,15)} dataKey={h.name.substring(0,15)}
                    stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15}/>
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Vaccine filter */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
            <span style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px" }}>Filter vaccine:</span>
            <select value={selectedVaccine} onChange={(e) => setSelectedVaccine(e.target.value)}
              style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff",
                borderRadius:"8px", padding:"7px 12px", fontSize:"13px", fontFamily:"inherit" }}>
              <option value="all" style={{ background:"#0D1B4B" }}>All Common Vaccines</option>
              {commonVaccines.map((v) => <option key={v.id} value={v.id} style={{ background:"#0D1B4B" }}>{v.name}</option>)}
            </select>
            <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>{comparisonData.length} vaccines</span>
          </div>

          {/* Comparison table */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
            borderRadius:"12px", overflow:"hidden" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                <thead>
                  <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding:"12px 16px", textAlign:"left", fontSize:"11px", fontWeight:"600",
                      color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.4px", minWidth:"200px" }}>Vaccine</th>
                    {selectedHospitals.map((h, i) => (
                      <th key={h.id} style={{ padding:"12px 16px", textAlign:"center", fontSize:"11px",
                        fontWeight:"600", color:COLORS[i], minWidth:"140px" }}>
                        <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"130px" }}>{h.name}</div>
                        <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", fontWeight:"400" }}>{h.location?.split(",")[0]}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, ri) => {
                    const prices = selectedHospitals.map((h) => row[h.id]).filter((p) => p !== null && p > 0);
                    const minP = prices.length ? Math.min(...prices) : null;
                    const maxP = prices.length ? Math.max(...prices) : null;
                    return (
                      <tr key={ri} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                        onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                        <td style={{ padding:"11px 16px" }}>
                          <div style={{ color:"rgba(255,255,255,0.85)", fontWeight:"500" }}>{row.vaccine}</div>
                          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px" }}>{row.manufacturer?.substring(0,25)}</div>
                        </td>
                        {selectedHospitals.map((h, i) => {
                          const price = row[h.id];
                          const status = row[`${h.id}_status`];
                          const insurance = row[`${h.id}_insurance`];
                          const isBest = price !== null && price > 0 && price === minP;
                          const isWorst = price !== null && price > 0 && price === maxP && prices.length > 1;
                          return (
                            <td key={h.id} style={{ padding:"11px 16px", textAlign:"center" }}>
                              {price === null ? (
                                <span style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px" }}>—</span>
                              ) : (
                                <div>
                                  <div style={{ fontSize:"14px", fontWeight:"700",
                                    color: price === 0 ? "#4ADE80" : isBest ? "#4ADE80" : isWorst ? "#F87171" : COLORS[i] }}>
                                    {price === 0 ? "FREE" : `₹${price}`}
                                    {isBest && <span style={{ fontSize:"9px", marginLeft:"3px" }}>✓</span>}
                                  </div>
                                  <div style={{ display:"flex", gap:"4px", justifyContent:"center", marginTop:"3px", flexWrap:"wrap" }}>
                                    {status && (
                                      <span style={{ fontSize:"9px", padding:"1px 5px", borderRadius:"10px",
                                        background: status==="Available"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)",
                                        color: status==="Available"?"#4ADE80":"#FCD34D" }}>{status}</span>
                                    )}
                                    {insurance && insurance !== "No" && (
                                      <span style={{ fontSize:"9px", padding:"1px 5px", borderRadius:"10px",
                                        background:"rgba(79,195,247,0.1)", color:"#4FC3F7" }}>✓ Ins</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop:"10px", display:"flex", gap:"16px", fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>
            <span>✓ Best price</span>
            <span style={{ color:"#4ADE80" }}>■ Lowest price</span>
            <span style={{ color:"#F87171" }}>■ Highest price</span>
            <span>— Not available</span>
          </div>
        </>
      )}

      {selectedHospitals.length < 2 && selectedHospitals.length > 0 && (
        <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:"32px" }}>➕</div>
          <div style={{ fontSize:"14px", marginTop:"8px" }}>Add at least one more hospital to compare</div>
        </div>
      )}

      {selectedHospitals.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px", color:"rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>🏥</div>
          <div style={{ fontSize:"16px", fontWeight:"500" }}>Select hospitals to compare</div>
          <div style={{ fontSize:"13px", marginTop:"6px" }}>Compare vaccine prices side by side across up to 4 hospitals</div>
        </div>
      )}
    </div>
  );
}
