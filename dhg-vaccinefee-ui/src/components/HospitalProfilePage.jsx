import { useState, useMemo } from "react";
import { MapPin, Star, Activity, DollarSign, Package, TrendingUp, ArrowLeft, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4FC3F7","#FFA726","#66BB6A","#EF5350","#AB47BC","#FF7043","#42A5F5","#26A69A"];

const STATUS_STYLE = {
  Available:    { bg:"rgba(34,197,94,0.12)",  color:"#4ADE80", border:"rgba(34,197,94,0.25)" },
  "Low Stock":  { bg:"rgba(245,158,11,0.12)", color:"#FCD34D", border:"rgba(245,158,11,0.25)" },
  "Out of Stock":{ bg:"rgba(239,68,68,0.12)", color:"#F87171", border:"rgba(239,68,68,0.25)" },
};

export default function HospitalProfilePage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [search, setSearch]   = useState("");
  const [filterCity, setFilter] = useState("All");

  const vaccineMap    = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const deptMap       = useMemo(() => Object.fromEntries(departments.map((d) => [d.id, d])), [departments]);

  const cities = useMemo(() => ["All", ...new Set(
    hospitals.map((h) => h.location?.split(",")[0].trim()).filter(Boolean)
  ).values()].sort(), [hospitals]);

  // Enrich hospitals
  const enriched = useMemo(() => hospitals.map((h) => {
    const records = pricing.filter((p) => p.hospital_id === h.id);
    const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
    return {
      ...h,
      city:      h.location?.split(",")[0].trim() || "",
      total:     records.length,
      available: records.filter((p) => p.status === "Available").length,
      avgPrice:  prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
      minPrice:  prices.length ? Math.min(...prices) : 0,
      maxPrice:  prices.length ? Math.max(...prices) : 0,
      insured:   records.filter((p) => p.insurance_covered !== "No").length,
    };
  }), [hospitals, pricing]);

  const filtered = useMemo(() => enriched.filter((h) => {
    if (filterCity !== "All" && h.city !== filterCity) return false;
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) &&
        !(h.location||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [enriched, search, filterCity]);

  // Selected hospital detail data
  const hospitalPricing = useMemo(() => {
    if (!selectedHospital) return [];
    return pricing
      .filter((p) => p.hospital_id === selectedHospital.id)
      .map((p) => ({
        vaccine:   vaccineMap[p.vaccine_id]?.name || "—",
        mfg:       vaccineMap[p.vaccine_id]?.manufacturer || "—",
        dept:      deptMap[p.department_id]?.name || "—",
        price:     parseFloat(p.price),
        status:    p.status || "Available",
        insurance: p.insurance_covered || "No",
        stock:     p.stock_quantity,
      }))
      .sort((a,b) => a.price - b.price);
  }, [selectedHospital, pricing, vaccineMap, deptMap]);

  // Chart data
  const deptChart = useMemo(() => {
    if (!selectedHospital) return [];
    const map = {};
    pricing.filter((p) => p.hospital_id === selectedHospital.id).forEach((p) => {
      const d = deptMap[p.department_id]?.name || "Other";
      map[d] = (map[d]||0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name: name.substring(0,15), count }))
      .sort((a,b) => b.count - a.count).slice(0,8);
  }, [selectedHospital, pricing, deptMap]);

  const statusChart = useMemo(() => {
    if (!selectedHospital) return [];
    const map = {};
    pricing.filter((p) => p.hospital_id === selectedHospital.id)
      .forEach((p) => { const s = p.status||"Available"; map[s]=(map[s]||0)+1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [selectedHospital, pricing]);

  const exportCSV = () => {
    if (!selectedHospital) return;
    const rows = [
      ["Vaccine","Manufacturer","Department","Price","Status","Insurance","Stock"],
      ...hospitalPricing.map((p) => [`"${p.vaccine}"`,`"${p.mfg}"`,`"${p.dept}"`,p.price,p.status,p.insurance,p.stock||"—"])
    ];
    const blob = new Blob([rows.map((r)=>r.join(",")).join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`${selectedHospital.name}-vaccines.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Hospital list view
  if (!selectedHospital) return (
    <div>
      <div style={{ marginBottom:"20px" }}>
        <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Hospital Profiles</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>
          Click any hospital to view full profile, vaccines and pricing
        </p>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hospitals..."
          style={{ flex:1, minWidth:"200px", padding:"9px 14px", background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff",
            fontSize:"13px", fontFamily:"inherit", outline:"none" }}/>
        <select value={filterCity} onChange={(e) => setFilter(e.target.value)}
          style={{ padding:"9px 14px", background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color:"#fff",
            fontSize:"13px", fontFamily:"inherit" }}>
          {cities.map((c) => <option key={c} value={c} style={{ background:"#0D1B4B" }}>{c}</option>)}
        </select>
        <span style={{ alignSelf:"center", fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>
          {filtered.length} hospitals
        </span>
      </div>

      {/* Hospital grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"12px" }}>
        {filtered.map((h) => (
          <div key={h.id} onClick={() => setSelectedHospital(h)}
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:"12px", padding:"16px", cursor:"pointer", transition:"all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background="rgba(79,195,247,0.08)"; e.currentTarget.style.borderColor="rgba(79,195,247,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}>
            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:"12px", marginBottom:"12px" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"10px", flexShrink:0,
                background:"linear-gradient(135deg,#1565C0,#0D47A1)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>
                🏥
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px",
                  lineHeight:1.3, marginBottom:"3px" }}>{h.name}</div>
                <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px",
                  display:"flex", alignItems:"center", gap:"4px" }}>
                  <MapPin size={11}/> {h.location?.split(",")[0]}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px" }}>
              {[
                { label:"Vaccines", value:h.total, color:"#4FC3F7" },
                { label:"Avg Price", value:`₹${h.avgPrice}`, color:"#FFA726" },
                { label:"Available", value:h.available, color:"#4ADE80" },
              ].map((s) => (
                <div key={s.label} style={{ background:"rgba(255,255,255,0.05)", borderRadius:"7px",
                  padding:"8px", textAlign:"center" }}>
                  <div style={{ fontSize:"15px", fontWeight:"700", color:s.color }}>{s.value}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", marginTop:"1px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop:"10px", display:"flex", justifyContent:"flex-end" }}>
              <span style={{ fontSize:"12px", color:"#4FC3F7" }}>View Profile →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Hospital profile view
  const h = selectedHospital;
  return (
    <div>
      {/* Back button */}
      <button onClick={() => setSelectedHospital(null)}
        style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"20px",
          background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:"8px", padding:"8px 14px", color:"rgba(255,255,255,0.7)",
          fontSize:"13px", cursor:"pointer" }}>
        <ArrowLeft size={14}/> All Hospitals
      </button>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,rgba(21,101,192,0.2),rgba(13,71,161,0.2))",
        border:"1px solid rgba(79,195,247,0.2)", borderRadius:"14px", padding:"24px", marginBottom:"20px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
          gap:"16px", flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>
            <div style={{ width:"64px", height:"64px", borderRadius:"14px", flexShrink:0,
              background:"linear-gradient(135deg,#1565C0,#0D47A1)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:"32px" }}>
              🏥
            </div>
            <div>
              <h2 style={{ color:"#fff", fontSize:"22px", fontWeight:"700", marginBottom:"6px" }}>{h.name}</h2>
              <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px",
                display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px" }}>
                <MapPin size={13}/> {h.location || "—"}
              </div>
              {h.address && (
                <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>{h.address}</div>
              )}
            </div>
          </div>
          <button onClick={exportCSV}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"9px 18px",
              borderRadius:"9px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
              background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
            <Download size={15}/> Export CSV
          </button>
        </div>

        {/* KPI row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",
          gap:"12px", marginTop:"20px" }}>
          {[
            { label:"Total Vaccines", value:h.total, icon:<Activity size={16}/>, color:"#4FC3F7" },
            { label:"Available",      value:h.available, icon:<Package size={16}/>, color:"#4ADE80" },
            { label:"Avg Price",      value:`₹${h.avgPrice}`, icon:<DollarSign size={16}/>, color:"#FFA726" },
            { label:"Min Price",      value:h.minPrice===0?"FREE":`₹${h.minPrice}`, icon:<TrendingUp size={16}/>, color:"#4ADE80" },
            { label:"Max Price",      value:`₹${h.maxPrice}`, icon:<TrendingUp size={16}/>, color:"#EF5350" },
            { label:"Insured",        value:h.insured, icon:<Star size={16}/>, color:"#AB47BC" },
          ].map((s) => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.08)", borderRadius:"10px",
              padding:"12px 14px", display:"flex", gap:"10px", alignItems:"center" }}>
              <div style={{ color:s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:"18px", fontWeight:"700", color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"1px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", padding:"18px" }}>
          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>
            Vaccines by Department
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptChart} margin={{ top:0, right:10, left:0, bottom:30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)"/>
              <XAxis dataKey="name" tick={{ fill:"rgba(255,255,255,0.5)", fontSize:9 }}
                angle={-30} textAnchor="end" tickLine={false} axisLine={false}/>
              <YAxis tick={{ fill:"rgba(255,255,255,0.5)", fontSize:10 }} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"8px", color:"#fff", fontSize:"12px" }}/>
              <Bar dataKey="count" fill="#4FC3F7" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", padding:"18px" }}>
          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"14px" }}>
            Stock Status
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusChart} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                labelLine={{ stroke:"rgba(255,255,255,0.3)" }}>
                {statusChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:"#0D1B4B", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:"8px", color:"#fff", fontSize:"12px" }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vaccine list */}
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid rgba(255,255,255,0.08)",
          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ color:"#fff", fontWeight:"600", fontSize:"14px" }}>
            All Vaccines ({hospitalPricing.length})
          </span>
          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>Sorted by price ↑</span>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["Vaccine","Manufacturer","Department","Price","Stock","Insurance","Status"].map((col) => (
                  <th key={col} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px",
                    fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase",
                    letterSpacing:"0.4px", whiteSpace:"nowrap" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hospitalPricing.map((p, i) => {
                const ss = STATUS_STYLE[p.status] || STATUS_STYLE.Available;
                return (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.85)", fontWeight:"500" }}>
                      {p.vaccine.substring(0,30)}
                    </td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.6)", fontSize:"11px" }}>
                      {p.mfg.substring(0,25)}
                    </td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.6)" }}>{p.dept}</td>
                    <td style={{ padding:"10px 14px", color:"#4FC3F7", fontWeight:"700" }}>
                      {p.price === 0 ? <span style={{ color:"#4ADE80" }}>FREE</span> : `₹${p.price}`}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      {p.stock !== null && p.stock !== undefined ? (
                        <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px",
                          background: p.stock===0?"rgba(239,68,68,0.1)":p.stock<=10?"rgba(245,158,11,0.1)":"rgba(34,197,94,0.1)",
                          color: p.stock===0?"#F87171":p.stock<=10?"#FCD34D":"#4ADE80" }}>
                          {p.stock===0?"Out":p.stock<=10?`Low(${p.stock})`:p.stock}
                        </span>
                      ) : "—"}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px",
                        background: p.insurance==="No"?"rgba(148,163,184,0.1)":"rgba(34,197,94,0.1)",
                        color: p.insurance==="No"?"rgba(255,255,255,0.4)":"#4ADE80" }}>
                        {p.insurance==="No"?"✗ No":"✓ Yes"}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:"11px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px",
                        background:ss.bg, color:ss.color, border:`1px solid ${ss.border}` }}>
                        {p.status}
                      </span>
                    </td>
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
