import { useState, useMemo } from "react";
import { theme } from "../theme";
import { Download } from "lucide-react";

const RANK_CRITERIA = ["Overall Score","Lowest Avg Price","Most Vaccines","Highest Availability","Most Insured"];

function scoreHospital(h, records) {
  const prices    = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
  const avgPrice  = prices.length ? prices.reduce((a,b)=>a+b,0)/prices.length : 9999;
  const available = records.filter((p) => p.status==="Available").length;
  const insured   = records.filter((p) => p.insurance_covered !== "No").length;
  const total     = records.length;

  // Scoring (higher = better)
  const priceScore  = Math.max(0, 100 - (avgPrice / 150));           // Lower price = higher score
  const availScore  = total > 0 ? (available / total) * 100 : 0;    // % available
  const insureScore = total > 0 ? (insured / total) * 100 : 0;      // % insured
  const coverScore  = Math.min(100, total * 1.5);                    // Vaccine coverage

  const overall = Math.round((priceScore * 0.3) + (availScore * 0.3) + (insureScore * 0.2) + (coverScore * 0.2));

  return { avgPrice: Math.round(avgPrice), available, insured, total, priceScore: Math.round(priceScore),
    availScore: Math.round(availScore), insureScore: Math.round(insureScore), coverScore: Math.round(coverScore), overall };
}

export default function HospitalRankingPage({ pricing = [], vaccines = [], hospitals = [], departments = [], darkMode = true }) {
  const t = theme(darkMode);
  const [criteria, setCriteria] = useState("Overall Score");
  const [filterCity, setFilterCity] = useState("All");
  const [showTop, setShowTop]   = useState(20);

  const cities = useMemo(() => ["All", ...new Set(hospitals.map((h) => h.location?.split(",")[0].trim()).filter(Boolean)).values()].sort(),
    [hospitals]);

  const ranked = useMemo(() => {
    const filtered = filterCity === "All" ? hospitals : hospitals.filter((h) => h.location?.startsWith(filterCity));

    return filtered.map((h) => {
      const records = pricing.filter((p) => p.hospital_id === h.id);
      const stats   = scoreHospital(h, records);
      return { ...h, ...stats, city: h.location?.split(",")[0].trim() || "" };
    })
    .sort((a,b) => {
      if (criteria === "Overall Score")       return b.overall - a.overall;
      if (criteria === "Lowest Avg Price")    return (a.avgPrice||9999) - (b.avgPrice||9999);
      if (criteria === "Most Vaccines")       return b.total - a.total;
      if (criteria === "Highest Availability")return b.availScore - a.availScore;
      if (criteria === "Most Insured")        return b.insureScore - a.insureScore;
      return 0;
    })
    .slice(0, showTop);
  }, [hospitals, pricing, criteria, filterCity, showTop]);

  const exportCSV = () => {
    const rows = [
      ["Rank","Hospital","City","Overall Score","Avg Price","Total Vaccines","Available %","Insured %"],
      ...ranked.map((h, i) => [i+1, `"${h.name}"`, h.city, h.overall, h.avgPrice===9999?"-":h.avgPrice,
        h.total, `${h.availScore}%`, `${h.insureScore}%`])
    ];
    const blob = new Blob([rows.map((r)=>r.join(",")).join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="hospital-rankings.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const medalColor = (i) => i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":null;

  const ScoreBar = ({ value, max=100, color }) => (
    <div style={{ flex:1, height:"6px", background: t.input, borderRadius:"3px", overflow:"hidden" }}>
      <div style={{ width:`${Math.min(100,(value/max)*100)}%`, height:"100%", background:color, borderRadius:"3px", transition:"width 0.3s" }}/>
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Hospital Rankings</h2>
          <p style={{ color: t.textSec, fontSize:"13px" }}>Ranked by price, availability, coverage and insurance</p>
        </div>
        <button onClick={exportCSV} style={{ display:"flex", alignItems:"center", gap:"6px",
          background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)",
          color:"#4FC3F7", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
          <Download size={15}/> Export Rankings
        </button>
      </div>

      {/* Top 3 podium */}
      {ranked.length >= 3 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"24px" }}>
          {[ranked[1], ranked[0], ranked[2]].map((h, podiumIdx) => {
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
            const mc   = medalColor(rank-1);
            const heights = ["160px","180px","150px"];
            return (
              <div key={h.id} style={{ background:`${mc}18`, border:`1px solid ${mc}50`,
                borderRadius:"14px", padding:"20px", textAlign:"center",
                borderTop:`3px solid ${mc}`, height:heights[podiumIdx], display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap:"6px" }}>
                <div style={{ fontSize:"28px" }}>{rank===1?"🥇":rank===2?"🥈":"🥉"}</div>
                <div style={{ color: t.text, fontWeight:"700", fontSize:"13px", lineHeight:1.3 }}>{h.name?.substring(0,28)}</div>
                <div style={{ color: t.textSec, fontSize:"11px" }}>{h.city}</div>
                <div style={{ fontSize:"22px", fontWeight:"800", color:mc }}>{h.overall}</div>
                <div style={{ fontSize:"10px", color: t.textMuted }}>Overall Score</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {RANK_CRITERIA.map((c) => (
            <button key={c} onClick={() => setCriteria(c)}
              style={{ padding:"7px 14px", borderRadius:"20px", fontSize:"12px", fontWeight:"500", cursor:"pointer",
                background: criteria===c ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)",
                border: criteria===c ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.12)",
                color: criteria===c ? "#4FC3F7" : "rgba(255,255,255,0.6)" }}>
              {c}
            </button>
          ))}
        </div>
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}
          style={{ background: t.input, border:"1px solid rgba(255,255,255,0.2)", color: t.text,
            borderRadius:"8px", padding:"7px 12px", fontSize:"12px", fontFamily:"inherit", marginLeft:"auto" }}>
          {cities.map((c) => <option key={c} value={c} style={{ background:"#0D1B4B" }}>{c}</option>)}
        </select>
      </div>

      {/* Rankings table */}
      <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background: t.cardAlt, borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["Rank","Hospital","City","Overall","Avg Price","Vaccines","Availability","Insurance"].map((h) => (
                  <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                    color: t.textSec, textTransform:"uppercase", letterSpacing:"0.4px", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranked.map((h, i) => {
                const mc = medalColor(i);
                return (
                  <tr key={h.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", transition:"background 0.1s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"12px 14px" }}>
                      {mc ? (
                        <span style={{ fontSize:"18px" }}>{i===0?"🥇":i===1?"🥈":"🥉"}</span>
                      ) : (
                        <span style={{ color: t.textSec, fontWeight:"600", fontSize:"13px" }}>#{i+1}</span>
                      )}
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ color:"rgba(255,255,255,0.9)", fontWeight:"500" }}>{h.name}</div>
                    </td>
                    <td style={{ padding:"12px 14px", color: t.textSec, fontSize:"11px" }}>{h.city}</td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ fontSize:"15px", fontWeight:"700",
                          color: h.overall>=70?"#4ADE80":h.overall>=50?"#FCD34D":"#F87171" }}>{h.overall}</span>
                        <ScoreBar value={h.overall} color={h.overall>=70?"#4ADE80":h.overall>=50?"#FCD34D":"#F87171"}/>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px", color:"#4FC3F7", fontWeight:"600" }}>
                      {h.avgPrice === 9999 ? "—" : h.avgPrice === 0 ? <span style={{ color:"#4ADE80" }}>FREE</span> : `₹${h.avgPrice}`}
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ color: t.text }}>{h.total}</span>
                        <ScoreBar value={h.coverScore} color="#4FC3F7"/>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ color: h.availScore>=90?"#4ADE80":h.availScore>=70?"#FCD34D":"#F87171" }}>{h.availScore}%</span>
                        <ScoreBar value={h.availScore} color={h.availScore>=90?"#4ADE80":h.availScore>=70?"#FCD34D":"#F87171"}/>
                      </div>
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ color:"#AB47BC" }}>{h.insureScore}%</span>
                        <ScoreBar value={h.insureScore} color="#AB47BC"/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {ranked.length >= showTop && (
          <div style={{ padding:"12px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => setShowTop(showTop + 20)}
              style={{ padding:"8px 24px", borderRadius:"8px", background:"rgba(79,195,247,0.1)",
                border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7", fontSize:"13px", cursor:"pointer" }}>
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
