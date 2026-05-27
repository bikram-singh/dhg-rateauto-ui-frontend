import { useState, useMemo } from "react";
import { MapPin, X, Building, Activity, DollarSign } from "lucide-react";

// City coordinates for known locations
const CITY_COORDS = {
  "New York":       { lat: 40.7128, lng: -74.0060 },
  "Los Angeles":    { lat: 34.0522, lng: -118.2437 },
  "Chicago":        { lat: 41.8781, lng: -87.6298 },
  "Houston":        { lat: 29.7604, lng: -95.3698 },
  "Phoenix":        { lat: 33.4484, lng: -112.0740 },
  "San Francisco":  { lat: 37.7749, lng: -122.4194 },
  "Seattle":        { lat: 47.6062, lng: -122.3321 },
  "Dallas":         { lat: 32.7767, lng: -96.7970 },
  "Miami":          { lat: 25.7617, lng: -80.1918 },
  "Denver":         { lat: 39.7392, lng: -104.9903 },
  "Boston":         { lat: 42.3601, lng: -71.0589 },
  "Washington DC":  { lat: 38.9072, lng: -77.0369 },
  "San Diego":      { lat: 32.7157, lng: -117.1611 },
  "Rochester":      { lat: 44.0121, lng: -92.4802 },
  "Baltimore":      { lat: 39.2904, lng: -76.6122 },
  "Cleveland":      { lat: 41.4993, lng: -81.6944 },
  "Stanford":       { lat: 37.4419, lng: -122.1430 },
  "Toronto":        { lat: 43.6532, lng: -79.3832 },
  "London":         { lat: 51.5074, lng: -0.1278 },
  "Paris":          { lat: 48.8566, lng: 2.3522 },
  "Berlin":         { lat: 52.5200, lng: 13.4050 },
  "Tokyo":          { lat: 35.6762, lng: 139.6503 },
  "Sydney":         { lat: -33.8688, lng: 151.2093 },
  "Singapore":      { lat: 1.3521,  lng: 103.8198 },
  "Mumbai":         { lat: 19.0760, lng: 72.8777 },
  "Bengaluru":      { lat: 12.9716, lng: 77.5946 },
  "Hyderabad":      { lat: 17.3850, lng: 78.4867 },
  "Pune":           { lat: 18.5204, lng: 73.8567 },
  "Chennai":        { lat: 13.0827, lng: 80.2707 },
  "Kolkata":        { lat: 22.5726, lng: 88.3639 },
  "Jaipur":         { lat: 26.9124, lng: 75.7873 },
  "Ahmedabad":      { lat: 23.0225, lng: 72.5714 },
  "New Delhi":      { lat: 28.6139, lng: 77.2090 },
  "Noida":          { lat: 28.5355, lng: 77.3910 },
  "Vellore":        { lat: 12.9165, lng: 79.1325 },
  "Chandigarh":     { lat: 30.7333, lng: 76.7794 },
  "Lucknow":        { lat: 26.8467, lng: 80.9462 },
  "Bhopal":         { lat: 23.2599, lng: 77.4126 },
  "Jodhpur":        { lat: 26.2389, lng: 73.0243 },
  "Gurugram":       { lat: 28.4595, lng: 77.0266 },
};

function getCoords(location) {
  if (!location) return null;
  const city = location.split(",")[0].trim();
  return CITY_COORDS[city] || null;
}

// Simple SVG World Map with hospital dots
export default function HospitalMapPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [selected, setSelected]     = useState(null);
  const [filterCity, setFilterCity] = useState("All");
  const [filterVax, setFilterVax]   = useState("");
  const [hoveredId, setHoveredId]   = useState(null);

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);

  // Enrich hospitals with coords and stats
  const enriched = useMemo(() => hospitals.map((h) => {
    const coords  = getCoords(h.location);
    const records = pricing.filter((p) => p.hospital_id === h.id);
    const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
    return {
      ...h,
      coords,
      vaccineCount: records.length,
      avgPrice: prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
      available: records.filter((p) => p.status === "Available").length,
      city: h.location?.split(",")[0].trim() || "",
    };
  }).filter((h) => h.coords), [hospitals, pricing]);

  const cities = useMemo(() => ["All", ...new Set(enriched.map((h) => h.city)).values()].sort(), [enriched]);

  const filtered = useMemo(() => enriched.filter((h) => {
    if (filterCity !== "All" && h.city !== filterCity) return false;
    if (filterVax) {
      const vaccine = vaccines.find((v) => v.name === filterVax);
      if (vaccine && !pricing.some((p) => p.hospital_id === h.id && p.vaccine_id === vaccine.id)) return false;
    }
    return true;
  }), [enriched, filterCity, filterVax, pricing, vaccines]);

  // Selected hospital vaccines
  const selectedVaccines = useMemo(() => {
    if (!selected) return [];
    return pricing
      .filter((p) => p.hospital_id === selected.id)
      .map((p) => ({ ...vaccineMap[p.vaccine_id], price: parseFloat(p.price), status: p.status, insurance: p.insurance_covered }))
      .filter((v) => v.name)
      .sort((a,b) => a.price - b.price)
      .slice(0, 20);
  }, [selected, pricing, vaccineMap]);

  // Convert lat/lng to SVG coordinates
  // Using a simple equirectangular projection
  const toSVG = (lat, lng) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const regionColor = (h) => {
    const loc = h.location || "";
    if (loc.includes("India") || loc.includes("Karnataka") || loc.includes("Maharashtra") ||
        loc.includes("Delhi") || loc.includes("Telangana") || loc.includes("Tamil Nadu") ||
        loc.includes("West Bengal") || loc.includes("Rajasthan") || loc.includes("Gujarat") ||
        loc.includes("Uttar Pradesh") || loc.includes("Haryana")) return "#4FC3F7";
    if (loc.includes("California") || loc.includes("New York") || loc.includes("Texas") ||
        loc.includes("Illinois") || loc.includes("Ohio") || loc.includes("Minnesota") ||
        loc.includes("Maryland") || loc.includes("Massachusetts") || loc.includes("Washington") ||
        loc.includes("Florida") || loc.includes("Colorado") || loc.includes("Arizona")) return "#FFA726";
    if (loc.includes("UK") || loc.includes("France") || loc.includes("Germany")) return "#66BB6A";
    if (loc.includes("Japan") || loc.includes("Singapore") || loc.includes("Australia")) return "#AB47BC";
    if (loc.includes("Canada")) return "#EF5350";
    return "#4FC3F7";
  };

  return (
    <div>
      <div style={{ marginBottom:"16px" }}>
        <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Hospital Map View</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>{filtered.length} hospitals mapped worldwide</p>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap" }}>
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
          style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff",
            borderRadius:"8px", padding:"8px 12px", fontSize:"12px", fontFamily:"inherit" }}>
          {cities.map((c) => <option key={c} value={c} style={{ background:"#0D1B4B" }}>{c}</option>)}
        </select>

        <select value={filterVax} onChange={(e) => setFilterVax(e.target.value)}
          style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.2)", color:"#fff",
            borderRadius:"8px", padding:"8px 12px", fontSize:"12px", fontFamily:"inherit" }}>
          <option value="" style={{ background:"#0D1B4B" }}>Filter by Vaccine</option>
          {vaccines.map((v) => <option key={v.id} value={v.name} style={{ background:"#0D1B4B" }}>{v.name}</option>)}
        </select>

        {(filterCity !== "All" || filterVax) && (
          <button onClick={() => { setFilterCity("All"); setFilterVax(""); }}
            style={{ padding:"8px 14px", borderRadius:"8px", background:"rgba(239,68,68,0.15)",
              border:"1px solid rgba(239,68,68,0.3)", color:"#F87171", fontSize:"12px", cursor:"pointer" }}>
            Clear Filters
          </button>
        )}

        {/* Legend */}
        <div style={{ display:"flex", gap:"14px", alignItems:"center", marginLeft:"auto", flexWrap:"wrap" }}>
          {[["#4FC3F7","India"],["#FFA726","USA"],["#66BB6A","Europe"],["#AB47BC","Asia-Pacific"],["#EF5350","Canada"]].map(([c,l]) => (
            <span key={l} style={{ display:"flex", alignItems:"center", gap:"5px", fontSize:"11px", color:"rgba(255,255,255,0.6)" }}>
              <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:c, display:"inline-block" }}/>
              {l}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:"16px" }}>
        {/* Map */}
        <div style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"12px", overflow:"hidden", position:"relative" }}>
          <svg viewBox="0 0 1000 500" style={{ width:"100%", height:"auto", display:"block" }}>
            {/* World map background */}
            <rect width="1000" height="500" fill="#0a1628"/>

            {/* Grid lines */}
            {[-60,-30,0,30,60].map((lat) => {
              const y = ((90-lat)/180)*500;
              return <line key={lat} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>;
            })}
            {[-120,-60,0,60,120].map((lng) => {
              const x = ((lng+180)/360)*1000;
              return <line key={lng} x1={x} y1="0" x2={x} y2="500" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>;
            })}

            {/* Continent outlines - simplified */}
            {/* North America */}
            <path d="M 80 80 L 220 60 L 260 100 L 280 180 L 250 250 L 200 280 L 160 260 L 120 220 L 80 180 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* South America */}
            <path d="M 180 280 L 240 270 L 270 320 L 260 400 L 220 440 L 190 420 L 175 370 L 170 320 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* Europe */}
            <path d="M 440 70 L 530 60 L 560 100 L 540 140 L 500 150 L 460 130 L 440 100 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* Africa */}
            <path d="M 460 150 L 560 140 L 580 200 L 560 300 L 520 360 L 480 340 L 450 280 L 440 200 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* Asia */}
            <path d="M 540 60 L 800 50 L 840 100 L 820 180 L 750 200 L 680 180 L 620 160 L 570 140 L 540 100 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* India subcontinent */}
            <path d="M 640 160 L 680 155 L 700 200 L 690 250 L 660 260 L 640 230 L 635 190 Z"
              fill="rgba(79,195,247,0.08)" stroke="rgba(79,195,247,0.2)" strokeWidth="0.8"/>
            {/* Australia */}
            <path d="M 760 280 L 860 270 L 880 320 L 860 370 L 800 380 L 760 350 L 750 310 Z"
              fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>

            {/* Hospital dots */}
            {filtered.map((h) => {
              const { x, y } = toSVG(h.coords.lat, h.coords.lng);
              const isSelected = selected?.id === h.id;
              const isHovered  = hoveredId === h.id;
              const color      = regionColor(h);
              const r          = isSelected ? 9 : isHovered ? 7 : 5;
              return (
                <g key={h.id} style={{ cursor:"pointer" }}
                  onClick={() => setSelected(selected?.id === h.id ? null : h)}
                  onMouseEnter={() => setHoveredId(h.id)}
                  onMouseLeave={() => setHoveredId(null)}>
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <circle cx={x} cy={y} r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4"/>
                  )}
                  <circle cx={x} cy={y} r={r} fill={color} opacity={isSelected ? 1 : 0.75}
                    stroke={isSelected ? "#fff" : "rgba(0,0,0,0.3)"} strokeWidth={isSelected ? 1.5 : 0.5}/>

                  {/* Tooltip on hover */}
                  {isHovered && !isSelected && (
                    <g>
                      <rect x={x+10} y={y-20} width={Math.min(h.name.length*5.5, 160)} height="22"
                        rx="4" fill="rgba(13,27,75,0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
                      <text x={x+16} y={y-5} fontSize="9" fill="#fff" fontFamily="sans-serif"
                        fontWeight="500">{h.name.substring(0,28)}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Stats overlay */}
          <div style={{ position:"absolute", bottom:"12px", left:"12px", display:"flex", gap:"8px" }}>
            {[
              { label:"Total", value:filtered.length, color:"#4FC3F7" },
              { label:"India", value:filtered.filter((h) => (h.location||"").match(/Karnataka|Maharashtra|Delhi|Telangana|Tamil Nadu|West Bengal|Rajasthan|Gujarat|Uttar Pradesh|Haryana|Punjab/)).length, color:"#4FC3F7" },
              { label:"USA", value:filtered.filter((h) => (h.location||"").match(/California|New York|Texas|Illinois|Ohio|Minnesota|Maryland|Massachusetts|Washington DC|Florida|Colorado|Arizona/)).length, color:"#FFA726" },
              { label:"International", value:filtered.filter((h) => (h.location||"").match(/UK|France|Germany|Japan|Singapore|Australia|Canada/)).length, color:"#66BB6A" },
            ].map((s) => (
              <div key={s.label} style={{ background:"rgba(13,27,75,0.9)", border:`1px solid ${s.color}40`,
                borderRadius:"8px", padding:"6px 12px", textAlign:"center" }}>
                <div style={{ fontSize:"16px", fontWeight:"700", color:s.color }}>{s.value}</div>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        {selected ? (
          <div style={{ width:"300px", flexShrink:0, background:"rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"16px", borderBottom:"1px solid rgba(255,255,255,0.08)",
              display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ color:"#fff", fontWeight:"700", fontSize:"14px", lineHeight:1.3 }}>{selected.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"4px", marginTop:"4px" }}>
                  <MapPin size={11} style={{ color:"#4FC3F7", flexShrink:0 }}/>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"11px" }}>{selected.location}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer" }}>
                <X size={16}/>
              </button>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1px",
              background:"rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              {[
                { icon:<Activity size={14}/>, label:"Vaccines", value:selected.vaccineCount },
                { icon:<DollarSign size={14}/>, label:"Avg Price", value:`₹${selected.avgPrice}` },
                { icon:<Building size={14}/>, label:"Available", value:selected.available },
              ].map((s) => (
                <div key={s.label} style={{ padding:"12px", textAlign:"center", background:"rgba(255,255,255,0.03)" }}>
                  <div style={{ color:"#4FC3F7", display:"flex", justifyContent:"center", marginBottom:"4px" }}>{s.icon}</div>
                  <div style={{ fontSize:"15px", fontWeight:"700", color:"#fff" }}>{s.value}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Vaccine list */}
            <div style={{ flex:1, overflowY:"auto" }}>
              <div style={{ padding:"10px 14px", fontSize:"11px", color:"rgba(255,255,255,0.4)",
                borderBottom:"1px solid rgba(255,255,255,0.06)", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.4px" }}>
                Available Vaccines
              </div>
              {selectedVaccines.map((v, i) => (
                <div key={i} style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.05)",
                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ color:"rgba(255,255,255,0.85)", fontSize:"12px", fontWeight:"500",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px" }}>{v.manufacturer?.substring(0,25)}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0, marginLeft:"8px" }}>
                    <div style={{ fontSize:"13px", fontWeight:"700", color: v.price === 0 ? "#4ADE80" : "#4FC3F7" }}>
                      {v.price === 0 ? "FREE" : `₹${v.price}`}
                    </div>
                    <span style={{ fontSize:"10px", padding:"1px 5px", borderRadius:"10px",
                      background: v.status==="Available"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)",
                      color: v.status==="Available"?"#4ADE80":"#FCD34D" }}>{v.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width:"300px", flexShrink:0, background:"rgba(255,255,255,0.04)",
            border:"1px dashed rgba(255,255,255,0.12)", borderRadius:"12px",
            display:"flex", flexDirection:"column", gap:"16px", padding:"24px" }}>
            <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)" }}>
              <MapPin size={40} style={{ margin:"0 auto 12px" }}/>
              <div style={{ fontSize:"14px", fontWeight:"500" }}>Click a hospital pin</div>
              <div style={{ fontSize:"12px", marginTop:"6px" }}>to see vaccine prices and details</div>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"16px" }}>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)", marginBottom:"10px", fontWeight:"600", textTransform:"uppercase" }}>
                All Hospitals
              </div>
              <div style={{ maxHeight:"300px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"4px" }}>
                {filtered.slice(0,30).map((h) => (
                  <button key={h.id} onClick={() => setSelected(h)}
                    style={{ display:"flex", alignItems:"center", gap:"8px", padding:"7px 10px", borderRadius:"7px",
                      background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                      color:"rgba(255,255,255,0.7)", fontSize:"11px", cursor:"pointer", textAlign:"left" }}>
                    <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:regionColor(h), flexShrink:0 }}/>
                    <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
