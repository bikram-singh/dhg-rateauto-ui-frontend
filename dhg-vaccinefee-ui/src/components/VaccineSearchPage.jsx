import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

const AGE_GROUPS = ["All Ages","Newborn (0-1m)","Infant (1-12m)","Toddler (1-3y)","Children (4-12y)","Adolescent (13-18y)","Adult (19-60y)","Senior (60+)"];

const DISEASE_CATEGORIES = {
  "Respiratory":   [1,41,42,43,44,45,46,47,48,59,60,2,39,40,61,62,34,35,36],
  "Liver":         [3,11,58],
  "Gastrointestinal":[18,19,26,27],
  "Viral/Childhood":[4,8,9,10,6,7,14,20,56],
  "HPV/Cancer":    [12,13],
  "Meningitis":    [16,17,57],
  "Travel":        [28,29,24,25,26,27,30,31,32,54],
  "Tropical":      [28,29,32,33,27],
  "Neurological":  [29,30,31,54],
  "Bacterial":     [23,5,20,21,22,51,63,64],
  "Hemorrhagic":   [49,50],
  "Shingles/VZV":  [10,37,38],
  "Biodefense":    [51,52,53,63,64],
};

const VACCINE_AGE = {
  1:"Adult (19-60y)", 2:"All Ages", 3:"All Ages", 4:"Children (4-12y)",
  5:"All Ages", 6:"Infant (1-12m)", 7:"Infant (1-12m)", 8:"Toddler (1-3y)",
  9:"Toddler (1-3y)", 10:"Children (4-12y)", 11:"All Ages", 12:"Adolescent (13-18y)",
  13:"Adolescent (13-18y)", 14:"Infant (1-12m)", 15:"Senior (60+)", 16:"Adolescent (13-18y)",
  17:"Adolescent (13-18y)", 18:"Infant (1-12m)", 19:"Infant (1-12m)", 20:"Infant (1-12m)",
  21:"Adult (19-60y)", 22:"Adult (19-60y)", 23:"Newborn (0-1m)", 24:"All Ages",
  25:"All Ages", 26:"All Ages", 27:"All Ages", 28:"All Ages", 29:"All Ages",
  30:"All Ages", 31:"All Ages", 32:"Adult (19-60y)", 33:"Children (4-12y)",
  34:"Senior (60+)", 35:"Senior (60+)", 36:"Newborn (0-1m)", 37:"Senior (60+)",
  38:"Senior (60+)", 39:"All Ages", 40:"Children (4-12y)", 41:"Adult (19-60y)",
  42:"Adult (19-60y)", 43:"Adult (19-60y)", 44:"Adult (19-60y)", 45:"Adult (19-60y)",
  46:"Adult (19-60y)", 47:"Adult (19-60y)", 48:"Adult (19-60y)", 49:"Adult (19-60y)",
  50:"Adult (19-60y)", 51:"Adult (19-60y)", 52:"Adult (19-60y)", 53:"Adult (19-60y)",
  54:"All Ages", 55:"Adult (19-60y)", 56:"Infant (1-12m)", 57:"Infant (1-12m)",
  58:"Adult (19-60y)", 59:"Adult (19-60y)", 60:"Adult (19-60y)", 61:"Senior (60+)",
  62:"Senior (60+)", 63:"Adult (19-60y)", 64:"Adult (19-60y)", 65:"Adult (19-60y)",
};

export default function VaccineSearchPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [search, setSearch]       = useState("");
  const [ageGroup, setAgeGroup]   = useState("All Ages");
  const [category, setCategory]   = useState("All");
  const [maxPrice, setMaxPrice]   = useState(10000);
  const [selected, setSelected]   = useState(null);

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  // Enrich vaccines with pricing stats
  const enriched = useMemo(() => vaccines.map((v) => {
    const records = pricing.filter((p) => p.vaccine_id === v.id);
    const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
    const catEntry = Object.entries(DISEASE_CATEGORIES).find(([,ids]) => ids.includes(v.id));
    return {
      ...v,
      category:   catEntry ? catEntry[0] : "Other",
      ageGroup:   VACCINE_AGE[v.id] || "All Ages",
      minPrice:   prices.length ? Math.min(...prices) : 0,
      maxPriceV:  prices.length ? Math.max(...prices) : 0,
      avgPrice:   prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
      hospitals:  records.length,
      available:  records.filter((p) => p.status === "Available").length,
    };
  }), [vaccines, pricing]);

  const filtered = useMemo(() => enriched.filter((v) => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) &&
        !v.manufacturer?.toLowerCase().includes(search.toLowerCase()) &&
        !v.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (ageGroup !== "All Ages" && v.ageGroup !== ageGroup && v.ageGroup !== "All Ages") return false;
    if (category !== "All" && v.category !== category) return false;
    if (v.minPrice > maxPrice && v.minPrice > 0) return false;
    return true;
  }), [enriched, search, ageGroup, category, maxPrice]);

  // Selected vaccine hospitals
  const selectedHospitals = useMemo(() => {
    if (!selected) return [];
    return pricing
      .filter((p) => p.vaccine_id === selected.id)
      .map((p) => ({
        hospital: hospitalMap[p.hospital_id]?.name || "—",
        location: hospitalMap[p.hospital_id]?.location || "—",
        price:    parseFloat(p.price),
        status:   p.status,
        insurance: p.insurance_covered,
      }))
      .sort((a,b) => a.price - b.price);
  }, [selected, pricing, hospitalMap]);

  const ageColors = {
    "Newborn (0-1m)":"#4FC3F7", "Infant (1-12m)":"#66BB6A", "Toddler (1-3y)":"#FFA726",
    "Children (4-12y)":"#AB47BC", "Adolescent (13-18y)":"#EF5350", "Adult (19-60y)":"#42A5F5",
    "Senior (60+)":"#FF7043", "All Ages":"#26A69A"
  };

  return (
    <div style={{ display:"flex", gap:"16px", height:"calc(100vh - 140px)" }}>
      {/* Left panel */}
      <div style={{ flex:"1", display:"flex", flexDirection:"column", gap:"14px", minWidth:0 }}>
        <div style={{ marginBottom:"4px" }}>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Vaccine Search</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Find vaccines by disease, age group or category</p>
        </div>

        {/* Search + filters */}
        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", padding:"14px 16px", display:"flex", gap:"10px", flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, minWidth:"180px" }}>
            <Search size={14} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vaccine, manufacturer, disease..."
              style={{ width:"100%", paddingLeft:"34px", padding:"8px 12px 8px 34px", background:"rgba(255,255,255,0.08)",
                border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff", fontSize:"13px", outline:"none" }}/>
          </div>

          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}
            style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff",
              borderRadius:"8px", padding:"8px 12px", fontSize:"12px", fontFamily:"inherit" }}>
            {AGE_GROUPS.map((a) => <option key={a} value={a} style={{ background:"#0D1B4B" }}>{a}</option>)}
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}
            style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff",
              borderRadius:"8px", padding:"8px 12px", fontSize:"12px", fontFamily:"inherit" }}>
            <option value="All" style={{ background:"#0D1B4B" }}>All Categories</option>
            {Object.keys(DISEASE_CATEGORIES).map((c) => <option key={c} value={c} style={{ background:"#0D1B4B" }}>{c}</option>)}
          </select>

          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Max ₹{maxPrice.toLocaleString()}</span>
            <input type="range" min="0" max="20000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width:"90px", accentColor:"#4FC3F7" }}/>
          </div>

          <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>{filtered.length} vaccines</span>
        </div>

        {/* Vaccine cards grid */}
        <div style={{ flex:1, overflowY:"auto", display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
          gap:"12px", alignContent:"start" }}>
          {filtered.map((v) => (
            <div key={v.id} onClick={() => setSelected(selected?.id === v.id ? null : v)}
              style={{ background: selected?.id === v.id ? "rgba(79,195,247,0.12)" : "rgba(255,255,255,0.06)",
                border: selected?.id === v.id ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.1)",
                borderRadius:"12px", padding:"14px 16px", cursor:"pointer", transition:"all 0.15s" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"8px", marginBottom:"10px" }}>
                <div style={{ fontWeight:"600", fontSize:"13px", color:"#fff", lineHeight:1.3 }}>{v.name}</div>
                <span style={{ fontSize:"10px", fontWeight:"600", padding:"2px 8px", borderRadius:"20px", whiteSpace:"nowrap",
                  background:`${ageColors[v.ageGroup] || "#4FC3F7"}20`, color:ageColors[v.ageGroup] || "#4FC3F7",
                  border:`1px solid ${ageColors[v.ageGroup] || "#4FC3F7"}40` }}>
                  {v.ageGroup.split(" ")[0]}
                </span>
              </div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", marginBottom:"10px" }}>{v.manufacturer}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"700", color:"#4FC3F7" }}>
                    {v.minPrice === 0 ? "FREE" : `₹${v.minPrice}`}
                    {v.maxPriceV > v.minPrice && v.minPrice > 0 && (
                      <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}> – ₹{v.maxPriceV}</span>
                    )}
                  </div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>min price</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:"rgba(255,255,255,0.7)" }}>{v.available}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>hospitals</div>
                </div>
              </div>
              <div style={{ marginTop:"8px" }}>
                <span style={{ fontSize:"10px", padding:"2px 8px", borderRadius:"20px",
                  background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.5)",
                  border:"1px solid rgba(255,255,255,0.1)" }}>{v.category}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize:"36px" }}>🔍</div>
              <div style={{ fontSize:"14px", marginTop:"8px" }}>No vaccines found</div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel - hospital prices for selected vaccine */}
      {selected && (
        <div style={{ width:"340px", flexShrink:0, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"4px" }}>{selected.name}</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px" }}>{selected.manufacturer}</div>
            <div style={{ display:"flex", gap:"8px", marginTop:"10px" }}>
              <div style={{ flex:1, background:"rgba(79,195,247,0.1)", borderRadius:"8px", padding:"8px", textAlign:"center" }}>
                <div style={{ fontSize:"15px", fontWeight:"700", color:"#4FC3F7" }}>₹{selected.avgPrice || "FREE"}</div>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>avg price</div>
              </div>
              <div style={{ flex:1, background:"rgba(34,197,94,0.1)", borderRadius:"8px", padding:"8px", textAlign:"center" }}>
                <div style={{ fontSize:"15px", fontWeight:"700", color:"#4ADE80" }}>{selected.available}</div>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>hospitals</div>
              </div>
            </div>
          </div>
          <div style={{ flex:1, overflowY:"auto" }}>
            {selectedHospitals.map((h, i) => (
              <div key={i} style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.05)",
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.85)", fontWeight:"500",
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.hospital}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", marginTop:"2px" }}>{h.location?.split(",")[0]}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:"10px" }}>
                  <div style={{ fontSize:"13px", fontWeight:"700", color: h.price === 0 ? "#4ADE80" : "#4FC3F7" }}>
                    {h.price === 0 ? "FREE" : `₹${h.price}`}
                  </div>
                  <span style={{ fontSize:"10px", padding:"1px 6px", borderRadius:"10px",
                    background: h.status==="Available"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)",
                    color: h.status==="Available"?"#4ADE80":"#FCD34D" }}>{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
