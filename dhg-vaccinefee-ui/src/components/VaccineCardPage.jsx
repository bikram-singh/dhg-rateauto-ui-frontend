import { useState, useMemo, useRef } from "react";
import { theme } from "../theme";
import { Printer, Download, User, Calendar, MapPin, Shield } from "lucide-react";

const VACCINE_SCHEDULE = [
  { vaccine:"BCG Vaccine", age:"Birth", dose:"1", notes:"Given at birth" },
  { vaccine:"Hepatitis B Vaccine", age:"Birth, 6w, 6m", dose:"3", notes:"3-dose series" },
  { vaccine:"Oral Polio Vaccine (OPV)", age:"6w, 10w, 14w", dose:"3", notes:"Plus boosters" },
  { vaccine:"Polio Vaccine (IPV)", age:"6w, 14w", dose:"2", notes:"Inactivated" },
  { vaccine:"DTaP Vaccine", age:"6w, 10w, 14w, 18m", dose:"4", notes:"DPT schedule" },
  { vaccine:"Hib Vaccine", age:"6w, 10w, 14w", dose:"3", notes:"Haemophilus influenza" },
  { vaccine:"Pneumococcal Conjugate (PCV13)", age:"6w, 10w, 14w, 12m", dose:"4", notes:"PCV schedule" },
  { vaccine:"Rotavirus Vaccine (Rotarix)", age:"6w, 10w", dose:"2", notes:"Oral vaccine" },
  { vaccine:"MMR Vaccine", age:"9m, 15m", dose:"2", notes:"Measles-Mumps-Rubella" },
  { vaccine:"Varicella (Chickenpox) Vaccine", age:"12-15m, 4-6y", dose:"2", notes:"Chickenpox" },
  { vaccine:"Hepatitis A Vaccine", age:"12m, 18m", dose:"2", notes:"2-dose series" },
  { vaccine:"Typhoid Conjugate Vaccine", age:"9-12m+", dose:"1", notes:"Annual booster" },
  { vaccine:"Flu Vaccine", age:"6m+ annually", dose:"1/year", notes:"Annual influenza" },
  { vaccine:"HPV Vaccine (Gardasil 9)", age:"9-14y", dose:"2-3", notes:"Girls & boys" },
  { vaccine:"Tdap Vaccine", age:"10-12y, adults", dose:"1+boost", notes:"Booster every 10y" },
  { vaccine:"COVID-19 Vaccine", age:"12y+", dose:"2+boost", notes:"Primary + boosters" },
  { vaccine:"Shingles Vaccine (Shingrix)", age:"50y+", dose:"2", notes:"2 months apart" },
  { vaccine:"Pneumococcal Polysaccharide (PPSV23)", age:"65y+", dose:"1-2", notes:"Seniors" },
];

export default function VaccineCardPage({ vaccines = [], hospitals = [], pricing = [], darkMode = true }) {
  const t = theme(darkMode);
  const [name, setName]         = useState("");
  const [dob, setDob]           = useState("");
  const [gender, setGender]     = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [city, setCity]         = useState("");
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [dates, setDates]       = useState({});
  const cardRef                 = useRef(null);

  const cityList = useMemo(() =>
    [...new Set(hospitals.map((h) => h.location?.split(",")[0].trim()).filter(Boolean))].sort(),
    [hospitals]
  );

  const toggleVaccine = (v) => {
    setSelectedVaccines((prev) =>
      prev.includes(v.vaccine) ? prev.filter((x) => x !== v.vaccine) : [...prev, v.vaccine]
    );
  };

  const handlePrint = () => {
    const content = cardRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>DHG Vaccination Card — ${name || "Patient"}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: sans-serif; background: #fff; padding: 20px; }
        .card { max-width: 800px; margin: 0 auto; border: 3px solid #1565C0; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1565C0, #0D47A1); color: white; padding: 20px 24px; display: flex; align-items: center; gap: 16px; }
        .logo { font-size: 32px; }
        .title { font-size: 22px; font-weight: 700; }
        .subtitle { font-size: 13px; opacity: 0.8; margin-top: 2px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; padding: 16px 24px; background: #F0F4FF; border-bottom: 2px solid #1565C0; }
        .info-box { background: white; border-radius: 8px; padding: 10px 14px; border-left: 3px solid #1565C0; }
        .info-label { font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-value { font-size: 14px; font-weight: 700; color: #0D47A1; margin-top: 2px; }
        .section-title { font-size: 14px; font-weight: 700; color: #0D47A1; padding: 12px 24px; background: #EEF4FF; border-bottom: 1px solid #DBEAFE; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1565C0; color: white; padding: 8px 14px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        td { padding: 8px 14px; border-bottom: 1px solid #EEF2F7; font-size: 12px; color: #1E293B; }
        tr:nth-child(even) td { background: #F8FAFF; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; background: #DCFCE7; color: #16A34A; }
        .footer { padding: 14px 24px; background: #0D47A1; color: rgba(255,255,255,0.7); font-size: 11px; text-align: center; }
        @media print { body { padding: 0; } .card { border-radius: 0; } }
      </style></head>
      <body>${content}</body></html>
    `);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Vaccine Card Generator</h2>
          <p style={{ color: t.textSec, fontSize:"13px" }}>Create a printable personal vaccination record</p>
        </div>
        <button onClick={handlePrint} style={{ display:"flex", alignItems:"center", gap:"6px",
          background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)",
          color:"#4ADE80", borderRadius:"8px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>
          <Printer size={15}/> Print Card
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
        {/* Form */}
        <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", padding:"20px" }}>
          <div style={{ color: t.text, fontWeight:"600", fontSize:"14px", marginBottom:"16px" }}>Patient Information</div>

          {[
            { label:"Full Name", value:name, set:setName, type:"text", placeholder:"Enter full name" },
            { label:"Date of Birth", value:dob, set:setDob, type:"date", placeholder:"" },
            { label:"City", value:city, set:setCity, type:"text", placeholder:"Enter city" },
          ].map(({ label, value, set, type, placeholder }) => (
            <div key={label} style={{ marginBottom:"12px" }}>
              <label style={{ display:"block", fontSize:"11px", color: t.textSec,
                textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"5px" }}>{label}</label>
              <input type={type} value={value} onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                style={{ width:"100%", padding:"9px 12px", background: t.input,
                  border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text,
                  fontSize:"13px", outline:"none", fontFamily:"inherit" }}/>
            </div>
          ))}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
            <div>
              <label style={{ display:"block", fontSize:"11px", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"5px" }}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}
                style={{ width:"100%", padding:"9px 12px", background: t.input,
                  border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"13px", fontFamily:"inherit" }}>
                {["Male","Female","Other"].map((g) => <option key={g} value={g} style={{ background:"#0D1B4B" }}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:"11px", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"5px" }}>Blood Group</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}
                style={{ width:"100%", padding:"9px 12px", background: t.input,
                  border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text, fontSize:"13px", fontFamily:"inherit" }}>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((g) => <option key={g} value={g} style={{ background:"#0D1B4B" }}>{g}</option>)}
              </select>
            </div>
          </div>

          <div style={{ color: t.text, fontWeight:"600", fontSize:"13px", marginBottom:"10px" }}>Select Vaccines Received:</div>
          <div style={{ maxHeight:"280px", overflowY:"auto", display:"flex", flexDirection:"column", gap:"4px" }}>
            {VACCINE_SCHEDULE.map((v) => (
              <div key={v.vaccine} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 12px",
                borderRadius:"8px", background: selectedVaccines.includes(v.vaccine) ? "rgba(79,195,247,0.1)" : "rgba(255,255,255,0.04)",
                border: selectedVaccines.includes(v.vaccine) ? "1px solid rgba(79,195,247,0.3)" : "1px solid rgba(255,255,255,0.07)",
                cursor:"pointer" }} onClick={() => toggleVaccine(v)}>
                <input type="checkbox" checked={selectedVaccines.includes(v.vaccine)} readOnly
                  style={{ accentColor:"#4FC3F7", width:"14px", height:"14px" }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"12px", color: t.text, fontWeight:"500" }}>{v.vaccine}</div>
                  <div style={{ fontSize:"10px", color: t.textMuted }}>{v.age} • {v.dose} dose(s)</div>
                </div>
                {selectedVaccines.includes(v.vaccine) && (
                  <input type="date" value={dates[v.vaccine] || ""} onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setDates({ ...dates, [v.vaccine]: e.target.value })}
                    style={{ padding:"3px 6px", background: t.input, border:"1px solid rgba(255,255,255,0.2)",
                      borderRadius:"5px", color: t.text, fontSize:"10px", fontFamily:"inherit" }}/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <div>
          <div style={{ fontSize:"11px", color: t.textMuted, marginBottom:"8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
            Preview — Click Print to save
          </div>
          <div ref={cardRef}>
            <div className="card" style={{ border:"3px solid #1565C0", borderRadius:"12px", overflow:"hidden", background: t.text }}>
              {/* Card header */}
              <div className="header" style={{ background:"linear-gradient(135deg,#1565C0,#0D47A1)", padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px" }}>
                <div style={{ fontSize:"40px" }}>🏥</div>
                <div>
                  <div className="title" style={{ fontSize:"20px", fontWeight:"700", color: t.text }}>DHG Vaccination Record</div>
                  <div className="subtitle" style={{ fontSize:"12px", color: t.text, marginTop:"2px" }}>Dummy Health Group • Caring for Every Life</div>
                </div>
              </div>

              {/* Patient info */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", padding:"14px 20px", background:"#F0F4FF", borderBottom:"2px solid #DBEAFE" }}>
                {[
                  { label:"Name", value:name || "—", icon:"👤" },
                  { label:"Date of Birth", value:dob || "—", icon:"📅" },
                  { label:"Gender", value:gender, icon:"⚧" },
                  { label:"Blood Group", value:bloodGroup, icon:"🩸" },
                  { label:"City", value:city || "—", icon:"📍" },
                  { label:"Card Generated", value:new Date().toLocaleDateString("en-IN"), icon:"📋" },
                ].map((s) => (
                  <div key={s.label} style={{ background:"white", borderRadius:"8px", padding:"10px 12px", borderLeft:"3px solid #1565C0" }}>
                    <div style={{ fontSize:"10px", color:"#64748B", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.4px" }}>{s.icon} {s.label}</div>
                    <div style={{ fontSize:"13px", fontWeight:"700", color:"#0D47A1", marginTop:"2px" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Vaccines table */}
              <div style={{ padding:"0" }}>
                <div style={{ fontSize:"13px", fontWeight:"700", color:"#0D47A1", padding:"10px 20px", background:"#EEF4FF", borderBottom:"1px solid #DBEAFE" }}>
                  💉 Vaccination History ({selectedVaccines.length} vaccines)
                </div>
                {selectedVaccines.length === 0 ? (
                  <div style={{ padding:"20px", textAlign:"center", color:"#94A3B8", fontSize:"13px" }}>
                    Select vaccines from the form to add them here
                  </div>
                ) : (
                  <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
                    <thead>
                      <tr style={{ background:"#1565C0" }}>
                        {["#","Vaccine","Age Group","Doses","Date Given","Status"].map((h) => (
                          <th key={h} style={{ padding:"8px 12px", textAlign:"left", color:"white", fontSize:"10px", fontWeight:"600", textTransform:"uppercase" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVaccines.map((vName, i) => {
                        const schedule = VACCINE_SCHEDULE.find((s) => s.vaccine === vName);
                        return (
                          <tr key={vName} style={{ borderBottom:"1px solid #EEF2F7", background: i%2===0?"#fff":"#F8FAFF" }}>
                            <td style={{ padding:"8px 12px", color:"#64748B" }}>{i+1}</td>
                            <td style={{ padding:"8px 12px", color:"#1E293B", fontWeight:"500" }}>{vName}</td>
                            <td style={{ padding:"8px 12px", color:"#64748B" }}>{schedule?.age || "—"}</td>
                            <td style={{ padding:"8px 12px", color:"#1E293B" }}>{schedule?.dose || "—"}</td>
                            <td style={{ padding:"8px 12px", color:"#1E293B" }}>{dates[vName] || "—"}</td>
                            <td style={{ padding:"8px 12px" }}>
                              <span style={{ display:"inline-block", padding:"2px 8px", borderRadius:"12px", fontSize:"10px", fontWeight:"600", background:"#DCFCE7", color:"#16A34A" }}>✓ Done</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div style={{ padding:"12px 20px", background:"#0D47A1", color: t.text, fontSize:"11px", textAlign:"center" }}>
                This is an auto-generated vaccination record. Please verify with your healthcare provider. • DHG © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
