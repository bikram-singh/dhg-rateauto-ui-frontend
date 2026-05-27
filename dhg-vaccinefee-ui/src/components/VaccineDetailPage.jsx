import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, Shield, AlertTriangle, Clock, Users, Activity } from "lucide-react";

const VACCINE_DETAILS = {
  1:  { diseases:["COVID-19"], uses:"Prevents COVID-19 infection, hospitalization and severe disease", sideEffects:["Sore arm","Fatigue","Headache","Chills","Fever","Nausea"], schedule:"2 doses, 3 weeks apart + booster", whoShouldTake:"Everyone 5+ years", whoShouldAvoid:"Severe allergic reaction to previous dose", doses:2, durationWeeks:3 },
  2:  { diseases:["Influenza"], uses:"Prevents seasonal flu and complications", sideEffects:["Sore arm","Low-grade fever","Muscle aches"], schedule:"1 dose annually, every October-November", whoShouldTake:"Everyone 6 months+, especially elderly and pregnant", whoShouldAvoid:"Egg allergy (consult doctor)", doses:1, durationWeeks:0 },
  3:  { diseases:["Hepatitis B"], uses:"Prevents hepatitis B liver infection and liver cancer", sideEffects:["Sore arm","Mild fever","Fatigue"], schedule:"3 doses: 0, 1, 6 months", whoShouldTake:"All infants, unvaccinated adults, healthcare workers", whoShouldAvoid:"Previous severe reaction to vaccine", doses:3, durationWeeks:24 },
  4:  { diseases:["Measles"], uses:"Prevents measles — a highly contagious viral disease", sideEffects:["Rash","Fever","Sore arm"], schedule:"1-2 doses, first at 9-12 months", whoShouldTake:"All children, unvaccinated adults", whoShouldAvoid:"Pregnancy, severe immunodeficiency", doses:2, durationWeeks:52 },
  8:  { diseases:["Measles","Mumps","Rubella"], uses:"Prevents three viral diseases with one vaccine", sideEffects:["Mild rash","Fever","Joint pain","Sore arm"], schedule:"2 doses: 12-15 months, 4-6 years", whoShouldTake:"All children, women of childbearing age", whoShouldAvoid:"Pregnancy, immunocompromised", doses:2, durationWeeks:208 },
  12: { diseases:["HPV","Cervical Cancer"], uses:"Prevents human papillomavirus — reduces cervical cancer risk by 90%", sideEffects:["Sore arm","Dizziness","Fainting","Headache"], schedule:"2-3 doses depending on age", whoShouldTake:"Ages 9-45, ideally before sexual activity", whoShouldAvoid:"Pregnancy", doses:3, durationWeeks:26 },
  14: { diseases:["Pneumococcal disease","Pneumonia"], uses:"Prevents pneumococcal pneumonia, meningitis and bloodstream infections", sideEffects:["Sore arm","Mild fever","Redness"], schedule:"4 doses for infants: 2, 4, 6, 12-15 months", whoShouldTake:"All infants, adults 65+, immunocompromised", whoShouldAvoid:"Previous severe allergic reaction", doses:4, durationWeeks:52 },
  23: { diseases:["Tuberculosis"], uses:"Prevents severe TB in children especially TB meningitis", sideEffects:["Small lump at injection site","Scar formation"], schedule:"Single dose at birth or early infancy", whoShouldTake:"Newborns in TB-endemic countries", whoShouldAvoid:"HIV positive infants, immunocompromised", doses:1, durationWeeks:0 },
  24: { diseases:["Typhoid"], uses:"Prevents typhoid fever caused by Salmonella Typhi", sideEffects:["Soreness at injection","Fever","Headache"], schedule:"Single dose, booster every 3 years for high risk", whoShouldTake:"Children in endemic areas, travelers to South Asia/Africa", whoShouldAvoid:"Age under 6 months", doses:1, durationWeeks:0 },
  29: { diseases:["Japanese Encephalitis"], uses:"Prevents JE — a mosquito-borne brain infection", sideEffects:["Sore arm","Headache","Myalgia"], schedule:"2 doses: day 0 and day 28", whoShouldTake:"Travelers to rural Asia, residents in endemic areas", whoShouldAvoid:"Pregnant women (unless high risk)", doses:2, durationWeeks:4 },
  30: { diseases:["Rabies"], uses:"Prevents rabies — fatal viral encephalitis from animal bites", sideEffects:["Sore arm","Headache","Nausea","Dizziness"], schedule:"Pre-exposure: 3 doses; Post-exposure: 4-5 doses", whoShouldTake:"Animal handlers, veterinarians, travelers to endemic areas", whoShouldAvoid:"None (rabies is fatal — treat regardless)", doses:3, durationWeeks:4 },
  37: { diseases:["Shingles (Herpes Zoster)"], uses:"Prevents shingles and post-herpetic neuralgia in older adults", sideEffects:["Sore arm","Redness","Shivering","Fever","Fatigue"], schedule:"2 doses, 2-6 months apart", whoShouldTake:"Adults 50+ years", whoShouldAvoid:"Immunocompromised, allergy to vaccine components", doses:2, durationWeeks:24 },
  34: { diseases:["RSV (Respiratory Syncytial Virus)"], uses:"Prevents RSV lower respiratory tract disease in older adults", sideEffects:["Injection site pain","Fatigue","Headache","Myalgia"], schedule:"Single dose", whoShouldTake:"Adults 60+, pregnant women for infant protection", whoShouldAvoid:"Previous severe allergic reaction", doses:1, durationWeeks:0 },
  42: { diseases:["COVID-19"], uses:"Prevents COVID-19 — AstraZeneca viral vector vaccine (Covishield)", sideEffects:["Sore arm","Fever","Fatigue","Headache","Rare VITT"], schedule:"2 doses, 4-12 weeks apart", whoShouldTake:"Adults 18+", whoShouldAvoid:"History of VITT, capillary leak syndrome", doses:2, durationWeeks:8 },
  44: { diseases:["COVID-19"], uses:"Prevents COVID-19 — whole virion inactivated Covaxin (India)", sideEffects:["Sore arm","Fever","Body ache","Headache"], schedule:"2 doses, 4 weeks apart", whoShouldTake:"Adults 18+, children 12-18", whoShouldAvoid:"Acute febrile illness, immunosuppression", doses:2, durationWeeks:4 },
};

const DEFAULT_DETAIL = {
  diseases:["Various"], uses:"Prevents the specified disease through immunological response", 
  sideEffects:["Sore arm","Mild fever","Fatigue"],
  schedule:"As prescribed by healthcare provider",
  whoShouldTake:"As recommended by doctor based on age and risk factors",
  whoShouldAvoid:"Prior allergic reaction to any vaccine component",
  doses:1, durationWeeks:0,
};

const AGE_BADGE_COLOR = { "Newborn":"#4FC3F7","Infant":"#66BB6A","Children":"#FFA726","Adult":"#42A5F5","Senior":"#EF5350","All":"#26A69A" };

export default function VaccineDetailPage({ pricing = [], vaccines = [], hospitals = [], departments = [] }) {
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const [expandedSection, setExpanded] = useState("overview");

  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  const enriched = useMemo(() => vaccines.map((v) => {
    const records = pricing.filter((p) => p.vaccine_id === v.id);
    const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
    const detail  = VACCINE_DETAILS[v.id] || DEFAULT_DETAIL;
    return {
      ...v, detail,
      minPrice:  prices.length ? Math.min(...prices) : 0,
      avgPrice:  prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : 0,
      hospitals: records.length,
      available: records.filter((p) => p.status==="Available").length,
      insured:   records.filter((p) => p.insurance_covered !== "No").length,
    };
  }), [vaccines, pricing]);

  const filtered = useMemo(() => enriched.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.manufacturer||"").toLowerCase().includes(search.toLowerCase()) ||
    (v.detail.diseases||[]).some((d) => d.toLowerCase().includes(search.toLowerCase()))
  ), [enriched, search]);

  const hospitalPrices = useMemo(() => {
    if (!selected) return [];
    return pricing
      .filter((p) => p.vaccine_id === selected.id)
      .map((p) => ({ hospital: hospitalMap[p.hospital_id], price: parseFloat(p.price), status: p.status, insurance: p.insurance_covered }))
      .filter((p) => p.hospital)
      .sort((a,b) => a.price - b.price);
  }, [selected, pricing, hospitalMap]);

  const Section = ({ id, title, icon, children }) => (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", overflow:"hidden", marginBottom:"10px" }}>
      <button onClick={() => setExpanded(expandedSection === id ? null : id)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"12px 16px", background:"none", border:"none", cursor:"pointer", color:"#fff" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", fontSize:"13px", fontWeight:"600" }}>
          {icon}{title}
        </div>
        {expandedSection === id ? <ChevronUp size={14} style={{ color:"rgba(255,255,255,0.4)" }}/> : <ChevronDown size={14} style={{ color:"rgba(255,255,255,0.4)" }}/>}
      </button>
      {expandedSection === id && (
        <div style={{ padding:"0 16px 14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display:"flex", gap:"16px", minHeight:"calc(100vh - 160px)" }}>
      {/* Left — vaccine list */}
      <div style={{ width:"320px", flexShrink:0, display:"flex", flexDirection:"column", gap:"12px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"18px", fontWeight:"700" }}>Vaccine Library</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px" }}>{filtered.length} vaccines</p>
        </div>
        <div style={{ position:"relative" }}>
          <Search size={13} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vaccines, diseases..."
            style={{ width:"100%", padding:"8px 12px 8px 30px", background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff", fontSize:"12px", outline:"none" }}/>
        </div>
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:"6px" }}>
          {filtered.map((v) => (
            <button key={v.id} onClick={() => { setSelected(v); setExpanded("overview"); }}
              style={{ textAlign:"left", padding:"11px 14px", borderRadius:"10px", cursor:"pointer",
                background: selected?.id === v.id ? "rgba(79,195,247,0.12)" : "rgba(255,255,255,0.05)",
                border: selected?.id === v.id ? "1px solid rgba(79,195,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
                transition:"all 0.12s" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px" }}>
                <span style={{ color:"#fff", fontWeight:"600", fontSize:"12px", lineHeight:1.3 }}>{v.name}</span>
                <span style={{ fontSize:"12px", fontWeight:"700", color:"#4FC3F7", flexShrink:0 }}>
                  {v.minPrice === 0 ? "FREE" : `₹${v.minPrice}`}
                </span>
              </div>
              <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.45)", marginTop:"3px" }}>{v.manufacturer}</div>
              <div style={{ display:"flex", gap:"6px", marginTop:"6px", flexWrap:"wrap" }}>
                {(v.detail.diseases||[]).slice(0,2).map((d) => (
                  <span key={d} style={{ fontSize:"10px", padding:"1px 7px", borderRadius:"20px",
                    background:"rgba(79,195,247,0.1)", color:"#4FC3F7", border:"1px solid rgba(79,195,247,0.2)" }}>{d}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right — detail panel */}
      {selected ? (
        <div style={{ flex:1, overflowY:"auto" }}>
          {/* Hero */}
          <div style={{ background:"linear-gradient(135deg,rgba(79,195,247,0.15),rgba(21,101,192,0.15))",
            border:"1px solid rgba(79,195,247,0.2)", borderRadius:"14px", padding:"22px", marginBottom:"16px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
              <div>
                <h2 style={{ color:"#fff", fontSize:"18px", fontWeight:"700", marginBottom:"4px" }}>{selected.name}</h2>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", marginBottom:"12px" }}>{selected.manufacturer}</div>
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  {(selected.detail.diseases||[]).map((d) => (
                    <span key={d} style={{ fontSize:"12px", padding:"3px 12px", borderRadius:"20px",
                      background:"rgba(79,195,247,0.15)", color:"#4FC3F7", border:"1px solid rgba(79,195,247,0.3)", fontWeight:"600" }}>{d}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {[
                  { label:"Min Price", value: selected.minPrice === 0 ? "FREE" : `₹${selected.minPrice}`, color:"#4ADE80" },
                  { label:"Avg Price", value:`₹${selected.avgPrice}`, color:"#4FC3F7" },
                  { label:"Hospitals", value:selected.available, color:"#FFA726" },
                  { label:"Insured", value:selected.insured, color:"#AB47BC" },
                ].map((s) => (
                  <div key={s.label} style={{ background:"rgba(255,255,255,0.08)", borderRadius:"8px", padding:"10px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:"18px", fontWeight:"700", color:s.color }}>{s.value}</div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.5)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule info bar */}
          <div style={{ display:"flex", gap:"10px", marginBottom:"14px", flexWrap:"wrap" }}>
            {[
              { icon:<Clock size={13}/>, label:"Doses", value:selected.detail.doses },
              { icon:<Activity size={13}/>, label:"Schedule", value:selected.detail.durationWeeks > 0 ? `${selected.detail.durationWeeks} weeks` : "Single visit" },
              { icon:<Users size={13}/>, label:"Who", value:selected.detail.whoShouldTake?.split(",")[0] },
            ].map((s) => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px",
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"8px", flex:1, minWidth:"140px" }}>
                <div style={{ color:"#4FC3F7" }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.4px" }}>{s.label}</div>
                  <div style={{ fontSize:"12px", color:"#fff", fontWeight:"500", marginTop:"1px" }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Expandable sections */}
          <Section id="overview" title="Overview & Uses" icon={<Shield size={14} style={{ color:"#4FC3F7" }}/>}>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"13px", lineHeight:1.7, marginTop:"10px" }}>
              {selected.detail.uses}
            </p>
          </Section>

          <Section id="schedule" title="Vaccination Schedule" icon={<Clock size={14} style={{ color:"#FFA726" }}/>}>
            <p style={{ color:"rgba(255,255,255,0.75)", fontSize:"13px", lineHeight:1.7, marginTop:"10px" }}>
              {selected.detail.schedule}
            </p>
            <div style={{ marginTop:"12px", display:"flex", gap:"6px" }}>
              {Array.from({ length: selected.detail.doses }).map((_, i) => (
                <div key={i} style={{ flex:1, background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
                  borderRadius:"8px", padding:"8px", textAlign:"center" }}>
                  <div style={{ color:"#4FC3F7", fontWeight:"700", fontSize:"16px" }}>Dose {i+1}</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px", marginTop:"2px" }}>
                    {i === 0 ? "Day 0" : i === 1 && selected.detail.durationWeeks > 0 ? `Week ${selected.detail.durationWeeks/2}` : `Week ${selected.detail.durationWeeks}`}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="sideEffects" title="Side Effects" icon={<AlertTriangle size={14} style={{ color:"#F59E0B" }}/>}>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginTop:"10px" }}>
              {(selected.detail.sideEffects||[]).map((s) => (
                <span key={s} style={{ fontSize:"12px", padding:"4px 12px", borderRadius:"20px",
                  background:"rgba(245,158,11,0.1)", color:"#FCD34D", border:"1px solid rgba(245,158,11,0.2)" }}>{s}</span>
              ))}
            </div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", marginTop:"10px", lineHeight:1.6 }}>
              Most side effects are mild and temporary. Consult a doctor if symptoms persist beyond 3 days.
            </p>
          </Section>

          <Section id="who" title="Who Should Take It" icon={<Users size={14} style={{ color:"#66BB6A" }}/>}>
            <div style={{ marginTop:"10px" }}>
              <div style={{ fontSize:"12px", color:"#4ADE80", fontWeight:"600", marginBottom:"6px" }}>✓ Recommended for:</div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", lineHeight:1.6 }}>{selected.detail.whoShouldTake}</p>
              <div style={{ fontSize:"12px", color:"#F87171", fontWeight:"600", marginTop:"12px", marginBottom:"6px" }}>✗ Should avoid or consult doctor:</div>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:"13px", lineHeight:1.6 }}>{selected.detail.whoShouldAvoid}</p>
            </div>
          </Section>

          {/* Hospital prices */}
          <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"12px", overflow:"hidden", marginBottom:"10px" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)",
              fontSize:"13px", fontWeight:"600", color:"#fff", display:"flex", alignItems:"center", gap:"8px" }}>
              <DollarSign size={14} style={{ color:"#4FC3F7" }}/> Available at {hospitalPrices.length} Hospitals
            </div>
            <div style={{ maxHeight:"240px", overflowY:"auto" }}>
              {hospitalPrices.slice(0,20).map((p, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.85)", fontSize:"12px", fontWeight:"500" }}>{p.hospital?.name}</div>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px" }}>{p.hospital?.location?.split(",")[0]}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ color: p.price===0?"#4ADE80":"#4FC3F7", fontWeight:"700", fontSize:"13px" }}>
                      {p.price===0?"FREE":`₹${p.price}`}
                    </div>
                    <span style={{ fontSize:"10px", padding:"1px 6px", borderRadius:"10px",
                      background: p.status==="Available"?"rgba(34,197,94,0.1)":"rgba(245,158,11,0.1)",
                      color: p.status==="Available"?"#4ADE80":"#FCD34D" }}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column",
          color:"rgba(255,255,255,0.3)", gap:"12px" }}>
          <div style={{ fontSize:"56px" }}>💉</div>
          <div style={{ fontSize:"16px", fontWeight:"500" }}>Select a vaccine to view full details</div>
          <div style={{ fontSize:"13px" }}>Uses, side effects, schedule, pricing across all hospitals</div>
        </div>
      )}
    </div>
  );
}
