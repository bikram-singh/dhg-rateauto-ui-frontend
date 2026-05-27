import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Printer } from "lucide-react";

const SCHEDULE = [
  { vaccine:"BCG Vaccine", monthOffset:0, color:"#4FC3F7", category:"Newborn" },
  { vaccine:"Hepatitis B Vaccine (1st)", monthOffset:0, color:"#4FC3F7", category:"Newborn" },
  { vaccine:"OPV (1st)", monthOffset:0, color:"#4FC3F7", category:"Newborn" },
  { vaccine:"DTaP (1st)", monthOffset:1.5, color:"#FFA726", category:"Infant" },
  { vaccine:"IPV (1st)", monthOffset:1.5, color:"#FFA726", category:"Infant" },
  { vaccine:"Hib (1st)", monthOffset:1.5, color:"#FFA726", category:"Infant" },
  { vaccine:"PCV13 (1st)", monthOffset:1.5, color:"#FFA726", category:"Infant" },
  { vaccine:"Rotavirus (1st)", monthOffset:1.5, color:"#FFA726", category:"Infant" },
  { vaccine:"DTaP (2nd)", monthOffset:2.5, color:"#66BB6A", category:"Infant" },
  { vaccine:"Hib (2nd)", monthOffset:2.5, color:"#66BB6A", category:"Infant" },
  { vaccine:"OPV (2nd)", monthOffset:2.5, color:"#66BB6A", category:"Infant" },
  { vaccine:"PCV13 (2nd)", monthOffset:2.5, color:"#66BB6A", category:"Infant" },
  { vaccine:"Rotavirus (2nd)", monthOffset:2.5, color:"#66BB6A", category:"Infant" },
  { vaccine:"DTaP (3rd)", monthOffset:3.5, color:"#EF5350", category:"Infant" },
  { vaccine:"IPV (2nd)", monthOffset:3.5, color:"#EF5350", category:"Infant" },
  { vaccine:"Hib (3rd)", monthOffset:3.5, color:"#EF5350", category:"Infant" },
  { vaccine:"PCV13 (3rd)", monthOffset:3.5, color:"#EF5350", category:"Infant" },
  { vaccine:"Hepatitis B (2nd)", monthOffset:1.5, color:"#AB47BC", category:"Infant" },
  { vaccine:"Hepatitis B (3rd)", monthOffset:6, color:"#AB47BC", category:"Infant" },
  { vaccine:"MMR (1st)", monthOffset:9, color:"#FF7043", category:"Toddler" },
  { vaccine:"Typhoid Conjugate", monthOffset:9, color:"#FF7043", category:"Toddler" },
  { vaccine:"Hepatitis A (1st)", monthOffset:12, color:"#42A5F5", category:"Toddler" },
  { vaccine:"PCV13 Booster", monthOffset:12, color:"#42A5F5", category:"Toddler" },
  { vaccine:"MMR (2nd)", monthOffset:15, color:"#EC407A", category:"Toddler" },
  { vaccine:"Varicella (1st)", monthOffset:12, color:"#FFCA28", category:"Toddler" },
  { vaccine:"Hepatitis A (2nd)", monthOffset:18, color:"#26A69A", category:"Toddler" },
  { vaccine:"Flu Vaccine (Annual)", monthOffset:6, color:"#78909C", category:"All Ages" },
  { vaccine:"HPV Vaccine", monthOffset:108, color:"#F06292", category:"Adolescent" },
  { vaccine:"Tdap Booster", monthOffset:120, color:"#7E57C2", category:"Adolescent" },
  { vaccine:"COVID-19 Vaccine", monthOffset:144, color:"#29B6F6", category:"Adult" },
  { vaccine:"Shingrix (Shingles)", monthOffset:600, color:"#FF7043", category:"Senior" },
  { vaccine:"PPSV23 (Pneumococcal)", monthOffset:780, color:"#66BB6A", category:"Senior" },
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function VaccineCalendarPage({ vaccines = [], pricing = [] }) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [dob, setDob]     = useState("");
  const [view, setView]   = useState("calendar"); // calendar | schedule

  const dobDate = dob ? new Date(dob) : null;

  // Get scheduled vaccines based on DOB
  const scheduledVaccines = useMemo(() => {
    if (!dobDate) return [];
    return SCHEDULE.map((s) => {
      const dueDate = new Date(dobDate);
      dueDate.setMonth(dueDate.getMonth() + Math.round(s.monthOffset));
      return { ...s, dueDate, isPast: dueDate < today, isThisMonth: dueDate.getFullYear() === year && dueDate.getMonth() === month };
    });
  }, [dobDate, year, month]);

  // Calendar grid
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calDays    = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const thisMonthVaccines = scheduledVaccines.filter((v) => v.isThisMonth);

  const vaccineOnDay = (day) => {
    return scheduledVaccines.filter((v) => v.dueDate.getFullYear() === year && v.dueDate.getMonth() === month && v.dueDate.getDate() === day);
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y=>y-1); } else setMonth(m=>m-1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y=>y+1); } else setMonth(m=>m+1); };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Vaccine Calendar</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Monthly vaccination schedule planner</p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={() => setView(view==="calendar"?"schedule":"calendar")}
            style={{ padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
              background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
            {view==="calendar" ? "📋 Schedule View" : "📅 Calendar View"}
          </button>
          <button onClick={handlePrint}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 16px", borderRadius:"8px", fontSize:"13px",
              fontWeight:"600", cursor:"pointer", background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", color:"#4ADE80" }}>
            <Printer size={15}/> Print
          </button>
        </div>
      </div>

      {/* DOB input */}
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", padding:"16px 20px", marginBottom:"20px",
        display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
        <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", fontWeight:"500" }}>
          Enter Date of Birth to see personalized schedule:
        </div>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
          style={{ padding:"8px 14px", background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px",
            color:"#fff", fontSize:"13px", outline:"none" }}/>
        {dobDate && (
          <span style={{ fontSize:"12px", color:"#4FC3F7" }}>
            Age: {Math.floor((today - dobDate) / (365.25*24*60*60*1000))} years • {scheduledVaccines.length} vaccines scheduled
          </span>
        )}
      </div>

      {view === "calendar" ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:"16px" }}>
          {/* Calendar */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
            {/* Nav */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={prevMonth} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"8px",
                width:"32px", height:"32px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ChevronLeft size={18}/>
              </button>
              <span style={{ color:"#fff", fontWeight:"700", fontSize:"16px" }}>
                {MONTHS[month]} {year}
              </span>
              <button onClick={nextMonth} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:"8px",
                width:"32px", height:"32px", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ChevronRight size={18}/>
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              {DAYS.map((d) => (
                <div key={d} style={{ padding:"10px", textAlign:"center", fontSize:"11px",
                  color:"rgba(255,255,255,0.4)", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.5px" }}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
              {calDays.map((day, i) => {
                const isToday = day && year===today.getFullYear() && month===today.getMonth() && day===today.getDate();
                const dayVaccines = day ? vaccineOnDay(day) : [];
                return (
                  <div key={i} style={{ minHeight:"80px", padding:"8px", borderBottom:"1px solid rgba(255,255,255,0.05)",
                    borderRight:"1px solid rgba(255,255,255,0.05)",
                    background: isToday ? "rgba(79,195,247,0.1)" : "transparent" }}>
                    {day && (
                      <>
                        <div style={{ fontSize:"13px", fontWeight: isToday ? "700" : "400",
                          color: isToday ? "#4FC3F7" : "rgba(255,255,255,0.7)", marginBottom:"4px" }}>{day}</div>
                        {dayVaccines.map((v, vi) => (
                          <div key={vi} style={{ fontSize:"9px", padding:"2px 5px", borderRadius:"4px",
                            background:`${v.color}25`, color:v.color, border:`1px solid ${v.color}40`,
                            marginBottom:"2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {v.vaccine.split(" ")[0]}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* This month's vaccines */}
          <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontWeight:"600", fontSize:"14px" }}>
              {MONTHS[month]} Vaccines {dobDate ? `(${thisMonthVaccines.length})` : ""}
            </div>
            <div style={{ padding:"12px", overflowY:"auto", maxHeight:"500px" }}>
              {!dobDate ? (
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"13px", padding:"20px" }}>
                  Enter date of birth to see scheduled vaccines
                </div>
              ) : thisMonthVaccines.length === 0 ? (
                <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"13px", padding:"20px" }}>
                  ✅ No vaccines due this month
                </div>
              ) : thisMonthVaccines.map((v, i) => (
                <div key={i} style={{ padding:"10px 12px", borderRadius:"8px", marginBottom:"8px",
                  background:`${v.color}12`, border:`1px solid ${v.color}30` }}>
                  <div style={{ fontSize:"12px", fontWeight:"600", color:v.color }}>{v.vaccine}</div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)", marginTop:"2px" }}>
                    Due: {v.dueDate.toLocaleDateString("en-IN")} • {v.category}
                  </div>
                  <div style={{ fontSize:"10px", marginTop:"4px" }}>
                    <span style={{ padding:"1px 6px", borderRadius:"10px", fontSize:"10px",
                      background: v.isPast ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                      color: v.isPast ? "#4ADE80" : "#FCD34D" }}>
                      {v.isPast ? "✓ Past due" : "⏳ Upcoming"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Schedule view */
        <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
              <thead>
                <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                  {["Vaccine","Category","Age/Timing","Due Date","Status"].map((h) => (
                    <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600",
                      color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(dobDate ? scheduledVaccines : SCHEDULE.map((s) => ({ ...s, dueDate:null, isPast:false }))).map((v, i) => (
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                        <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:v.color, flexShrink:0 }}/>
                        <span style={{ color:"rgba(255,255,255,0.85)", fontWeight:"500" }}>{v.vaccine}</span>
                      </div>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px",
                        background:`${v.color}15`, color:v.color, border:`1px solid ${v.color}30` }}>{v.category}</span>
                    </td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.6)" }}>
                      {Math.round(v.monthOffset)} months
                    </td>
                    <td style={{ padding:"10px 14px", color:"rgba(255,255,255,0.7)" }}>
                      {v.dueDate ? v.dueDate.toLocaleDateString("en-IN") : "—"}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      {dobDate ? (
                        <span style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px",
                          background: v.isPast ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                          color: v.isPast ? "#4ADE80" : "#FCD34D" }}>
                          {v.isPast ? "✓ Done" : "⏳ Upcoming"}
                        </span>
                      ) : (
                        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>Enter DOB to track</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
