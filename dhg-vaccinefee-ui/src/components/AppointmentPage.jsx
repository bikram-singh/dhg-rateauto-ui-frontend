import { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Activity, CheckCircle, X, Printer } from "lucide-react";

const TIME_SLOTS = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM"];

const STATUS_STYLE = {
  Confirmed: { bg:"rgba(34,197,94,0.12)", color:"#4ADE80", border:"rgba(34,197,94,0.25)" },
  Pending:   { bg:"rgba(245,158,11,0.12)", color:"#FCD34D", border:"rgba(245,158,11,0.25)" },
  Cancelled: { bg:"rgba(239,68,68,0.12)", color:"#F87171", border:"rgba(239,68,68,0.25)" },
  Completed: { bg:"rgba(79,195,247,0.12)", color:"#4FC3F7", border:"rgba(79,195,247,0.25)" },
};

export default function AppointmentPage({ vaccines = [], hospitals = [], pricing = [] }) {
  const [tab, setTab]             = useState("book"); // book | my-appointments
  const [step, setStep]           = useState(1); // 1=vaccine, 2=hospital, 3=datetime, 4=details, 5=confirm
  const [selectedVaccine, setVax] = useState(null);
  const [selectedHospital, setHosp] = useState(null);
  const [selectedDate, setDate]   = useState("");
  const [selectedTime, setTime]   = useState("");
  const [form, setForm]           = useState({ name:"", age:"", phone:"", email:"", notes:"" });
  const [appointments, setAppointments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dhg_appointments") || "[]"); }
    catch { return []; }
  });
  const [booked, setBooked]       = useState(false);

  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h])), [hospitals]);

  // Get unique vaccines with pricing
  const availableVaccines = useMemo(() => {
    const ids = [...new Set(pricing.map((p) => p.vaccine_id))];
    return ids.map((id) => vaccineMap[id]).filter(Boolean).sort((a,b) => a.name.localeCompare(b.name));
  }, [pricing, vaccineMap]);

  // Get hospitals offering selected vaccine
  const availableHospitals = useMemo(() => {
    if (!selectedVaccine) return [];
    const hospIds = [...new Set(
      pricing.filter((p) => p.vaccine_id === selectedVaccine.id && p.status === "Available")
        .map((p) => p.hospital_id)
    )];
    return hospIds.map((id) => {
      const h = hospitalMap[id];
      const p = pricing.find((pr) => pr.vaccine_id === selectedVaccine.id && pr.hospital_id === id);
      return h ? { ...h, price: parseFloat(p?.price || 0) } : null;
    }).filter(Boolean).sort((a,b) => a.price - b.price);
  }, [selectedVaccine, pricing, hospitalMap]);

  // Confirm appointment
  const confirmAppointment = () => {
    const appt = {
      id: `APT-${Date.now()}`,
      vaccine: selectedVaccine?.name,
      hospital: selectedHospital?.name,
      location: selectedHospital?.location,
      price: selectedHospital?.price,
      date: selectedDate,
      time: selectedTime,
      patientName: form.name,
      patientAge: form.age,
      phone: form.phone,
      email: form.email,
      notes: form.notes,
      status: "Confirmed",
      bookedAt: new Date().toISOString(),
    };
    const updated = [appt, ...appointments];
    setAppointments(updated);
    localStorage.setItem("dhg_appointments", JSON.stringify(updated));
    setBooked(true);
  };

  const cancelAppointment = (id) => {
    const updated = appointments.map((a) => a.id === id ? { ...a, status:"Cancelled" } : a);
    setAppointments(updated);
    localStorage.setItem("dhg_appointments", JSON.stringify(updated));
  };

  const printAppointment = (appt) => {
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>DHG Appointment — ${appt.id}</title>
      <style>
        body{font-family:sans-serif;padding:30px;color:#1E293B}
        .header{background:#1565C0;color:white;padding:20px;border-radius:8px;margin-bottom:20px}
        .title{font-size:22px;font-weight:700}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
        .box{background:#F0F4FF;border-radius:8px;padding:12px;border-left:4px solid #1565C0}
        .label{font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.4px}
        .value{font-size:15px;font-weight:700;color:#0D47A1;margin-top:2px}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;background:#DCFCE7;color:#16A34A;font-weight:600;font-size:12px}
        .footer{margin-top:24px;padding-top:12px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center}
      </style></head>
      <body>
        <div class="header">
          <div class="title">🏥 DHG Vaccination Appointment</div>
          <div style="font-size:13px;opacity:0.8;margin-top:4px">Dummy Health Group • Caring for Every Life</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div><strong>Appointment ID:</strong> ${appt.id}</div>
          <span class="badge">✓ ${appt.status}</span>
        </div>
        <div class="grid">
          <div class="box"><div class="label">Patient Name</div><div class="value">${appt.patientName}</div></div>
          <div class="box"><div class="label">Age</div><div class="value">${appt.patientAge} years</div></div>
          <div class="box"><div class="label">Vaccine</div><div class="value">${appt.vaccine}</div></div>
          <div class="box"><div class="label">Price</div><div class="value">₹${appt.price}</div></div>
          <div class="box"><div class="label">Hospital</div><div class="value">${appt.hospital}</div></div>
          <div class="box"><div class="label">Location</div><div class="value">${appt.location}</div></div>
          <div class="box"><div class="label">Date</div><div class="value">${appt.date}</div></div>
          <div class="box"><div class="label">Time</div><div class="value">${appt.time}</div></div>
        </div>
        ${appt.notes ? `<div style="margin-top:12px;padding:12px;background:#FEF3C7;border-radius:8px"><strong>Notes:</strong> ${appt.notes}</div>` : ""}
        <div class="footer">Please arrive 15 minutes before your appointment. Bring a valid ID and this confirmation slip. • DHG © ${new Date().getFullYear()}</div>
      </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 400);
  };

  const reset = () => {
    setStep(1); setVax(null); setHosp(null);
    setDate(""); setTime(""); setBooked(false);
    setForm({ name:"", age:"", phone:"", email:"", notes:"" });
  };

  // Min date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const inputStyle = {
    width:"100%", padding:"10px 14px", background:"rgba(255,255,255,0.08)",
    border:"1px solid rgba(255,255,255,0.2)", borderRadius:"9px", color:"#fff",
    fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box"
  };

  const labelStyle = {
    display:"block", fontSize:"11px", color:"rgba(255,255,255,0.5)",
    textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:"5px", fontWeight:"600"
  };

  return (
    <div>
      <div style={{ marginBottom:"20px" }}>
        <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Appointment Booking</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Book vaccination appointments at any of our 108 hospitals</p>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
        {[["book","📅 Book Appointment"],["my-appointments","📋 My Appointments"]].map(([key, label]) => (
          <button key={key} onClick={() => { setTab(key); reset(); }}
            style={{ padding:"9px 20px", borderRadius:"9px", fontSize:"13px", fontWeight:"600",
              cursor:"pointer",
              background: tab===key ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)",
              border: tab===key ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.12)",
              color: tab===key ? "#4FC3F7" : "rgba(255,255,255,0.6)" }}>
            {label} {key==="my-appointments" && appointments.length > 0 && `(${appointments.length})`}
          </button>
        ))}
      </div>

      {tab === "book" && (
        <>
          {/* Success screen */}
          {booked ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:"64px", marginBottom:"16px" }}>🎉</div>
              <h3 style={{ color:"#4ADE80", fontSize:"22px", fontWeight:"700", marginBottom:"8px" }}>
                Appointment Confirmed!
              </h3>
              <p style={{ color:"rgba(255,255,255,0.6)", marginBottom:"24px" }}>
                Your vaccination appointment has been booked successfully.
              </p>
              <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)",
                borderRadius:"12px", padding:"20px", maxWidth:"400px", margin:"0 auto 24px",
                textAlign:"left" }}>
                {[
                  ["Vaccine",  selectedVaccine?.name],
                  ["Hospital", selectedHospital?.name],
                  ["Date",     selectedDate],
                  ["Time",     selectedTime],
                  ["Patient",  form.name],
                  ["Price",    `₹${selectedHospital?.price}`],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between",
                    padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>{k}</span>
                    <span style={{ color:"#fff", fontWeight:"500", fontSize:"13px" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
                <button onClick={() => printAppointment(appointments[0])}
                  style={{ display:"flex", alignItems:"center", gap:"6px", padding:"10px 20px",
                    borderRadius:"9px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
                    background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
                  <Printer size={15}/> Print Slip
                </button>
                <button onClick={reset}
                  style={{ padding:"10px 20px", borderRadius:"9px", fontSize:"13px", fontWeight:"600",
                    cursor:"pointer", background:"rgba(255,255,255,0.08)",
                    border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.7)" }}>
                  Book Another
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step indicator */}
              <div style={{ display:"flex", alignItems:"center", gap:"0", marginBottom:"24px" }}>
                {["Vaccine","Hospital","Date & Time","Details","Confirm"].map((s, i) => (
                  <div key={s} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                      <div style={{ width:"32px", height:"32px", borderRadius:"50%", display:"flex",
                        alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"700",
                        background: step > i+1 ? "#4ADE80" : step === i+1 ? "#4FC3F7" : "rgba(255,255,255,0.1)",
                        color: step >= i+1 ? "#fff" : "rgba(255,255,255,0.4)",
                        border: step === i+1 ? "2px solid #4FC3F7" : "none" }}>
                        {step > i+1 ? "✓" : i+1}
                      </div>
                      <div style={{ fontSize:"10px", marginTop:"4px", color: step >= i+1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)", textAlign:"center" }}>{s}</div>
                    </div>
                    {i < 4 && <div style={{ height:"2px", flex:1, background: step > i+1 ? "#4ADE80" : "rgba(255,255,255,0.1)", margin:"0 4px", marginTop:"-16px" }}/>}
                  </div>
                ))}
              </div>

              {/* Step 1: Select Vaccine */}
              {step === 1 && (
                <div>
                  <h3 style={{ color:"#fff", fontSize:"16px", fontWeight:"600", marginBottom:"14px" }}>
                    Step 1: Select a Vaccine
                  </h3>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"10px" }}>
                    {availableVaccines.slice(0,30).map((v) => {
                      const records = pricing.filter((p) => p.vaccine_id === v.id && p.status === "Available");
                      const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
                      const minP    = prices.length ? Math.min(...prices) : 0;
                      return (
                        <button key={v.id} type="button" onClick={() => { setVax(v); setStep(2); }}
                          style={{ textAlign:"left", padding:"14px", borderRadius:"10px", cursor:"pointer",
                            background: selectedVaccine?.id === v.id ? "rgba(79,195,247,0.15)" : "rgba(255,255,255,0.05)",
                            border: selectedVaccine?.id === v.id ? "1px solid rgba(79,195,247,0.4)" : "1px solid rgba(255,255,255,0.1)",
                            transition:"all 0.1s" }}>
                          <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px", marginBottom:"4px" }}>{v.name}</div>
                          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px", marginBottom:"6px" }}>{v.manufacturer}</div>
                          <div style={{ color:"#4FC3F7", fontWeight:"700", fontSize:"14px" }}>
                            from ₹{minP || "Free"}
                          </div>
                          <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px" }}>
                            {records.length} hospitals available
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Select Hospital */}
              {step === 2 && (
                <div>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ color:"rgba(255,255,255,0.5)", background:"none", border:"none",
                      cursor:"pointer", fontSize:"13px", marginBottom:"14px", padding:0 }}>
                    ← Back
                  </button>
                  <h3 style={{ color:"#fff", fontSize:"16px", fontWeight:"600", marginBottom:"6px" }}>
                    Step 2: Select Hospital
                  </h3>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px", marginBottom:"14px" }}>
                    Vaccine: <span style={{ color:"#4FC3F7" }}>{selectedVaccine?.name}</span>
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                    {availableHospitals.map((h) => (
                      <button key={h.id} type="button" onClick={() => { setHosp(h); setStep(3); }}
                        style={{ textAlign:"left", padding:"14px 18px", borderRadius:"10px", cursor:"pointer",
                          display:"flex", alignItems:"center", gap:"14px",
                          background: selectedHospital?.id === h.id ? "rgba(79,195,247,0.1)" : "rgba(255,255,255,0.05)",
                          border: selectedHospital?.id === h.id ? "1px solid rgba(79,195,247,0.4)" : "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px" }}>{h.name}</div>
                          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", display:"flex", alignItems:"center", gap:"4px", marginTop:"3px" }}>
                            <MapPin size={11}/> {h.location}
                          </div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ color:"#4FC3F7", fontWeight:"700", fontSize:"16px" }}>
                            {h.price === 0 ? "FREE" : `₹${h.price}`}
                          </div>
                          <div style={{ color:"#4ADE80", fontSize:"11px" }}>✓ Available</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div>
                  <button type="button" onClick={() => setStep(2)}
                    style={{ color:"rgba(255,255,255,0.5)", background:"none", border:"none",
                      cursor:"pointer", fontSize:"13px", marginBottom:"14px", padding:0 }}>
                    ← Back
                  </button>
                  <h3 style={{ color:"#fff", fontSize:"16px", fontWeight:"600", marginBottom:"14px" }}>
                    Step 3: Select Date & Time
                  </h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px" }}>
                    <div>
                      <label style={labelStyle}>Appointment Date</label>
                      <input type="date" value={selectedDate} min={minDateStr}
                        onChange={(e) => setDate(e.target.value)} style={inputStyle}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Preferred Time</label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
                        {TIME_SLOTS.map((t) => (
                          <button key={t} type="button" onClick={() => setTime(t)}
                            style={{ padding:"8px 6px", borderRadius:"7px", fontSize:"11px",
                              cursor:"pointer", fontWeight:"500",
                              background: selectedTime===t ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)",
                              border: selectedTime===t ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.1)",
                              color: selectedTime===t ? "#4FC3F7" : "rgba(255,255,255,0.6)" }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(4)} disabled={!selectedDate || !selectedTime}
                    style={{ marginTop:"20px", padding:"11px 28px", borderRadius:"9px", fontSize:"14px",
                      fontWeight:"600", cursor: !selectedDate||!selectedTime ? "not-allowed" : "pointer",
                      background: !selectedDate||!selectedTime ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#4FC3F7,#1565C0)",
                      border:"none", color:"#fff", opacity: !selectedDate||!selectedTime ? 0.5 : 1 }}>
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 4: Patient Details */}
              {step === 4 && (
                <div>
                  <button type="button" onClick={() => setStep(3)}
                    style={{ color:"rgba(255,255,255,0.5)", background:"none", border:"none",
                      cursor:"pointer", fontSize:"13px", marginBottom:"14px", padding:0 }}>
                    ← Back
                  </button>
                  <h3 style={{ color:"#fff", fontSize:"16px", fontWeight:"600", marginBottom:"14px" }}>
                    Step 4: Patient Details
                  </h3>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                    {[
                      { key:"name",  label:"Full Name",     type:"text",  placeholder:"Bikram Singh", required:true },
                      { key:"age",   label:"Age (years)",   type:"number",placeholder:"35",           required:true },
                      { key:"phone", label:"Phone Number",  type:"tel",   placeholder:"+91 98765 43210", required:true },
                      { key:"email", label:"Email Address", type:"email", placeholder:"bikram@email.com", required:false },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={labelStyle}>{f.label} {f.required && <span style={{ color:"#F87171" }}>*</span>}</label>
                        <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                          onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                          style={inputStyle}/>
                      </div>
                    ))}
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={labelStyle}>Special Notes (Optional)</label>
                      <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})}
                        placeholder="Any allergies, medical conditions, or special requirements..."
                        rows={3}
                        style={{ ...inputStyle, resize:"none" }}/>
                    </div>
                  </div>
                  <button type="button"
                    onClick={() => setStep(5)}
                    disabled={!form.name || !form.age || !form.phone}
                    style={{ marginTop:"20px", padding:"11px 28px", borderRadius:"9px", fontSize:"14px",
                      fontWeight:"600", cursor: !form.name||!form.age||!form.phone ? "not-allowed" : "pointer",
                      background: !form.name||!form.age||!form.phone ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg,#4FC3F7,#1565C0)",
                      border:"none", color:"#fff", opacity: !form.name||!form.age||!form.phone ? 0.5 : 1 }}>
                    Review Appointment →
                  </button>
                </div>
              )}

              {/* Step 5: Confirm */}
              {step === 5 && (
                <div>
                  <button type="button" onClick={() => setStep(4)}
                    style={{ color:"rgba(255,255,255,0.5)", background:"none", border:"none",
                      cursor:"pointer", fontSize:"13px", marginBottom:"14px", padding:0 }}>
                    ← Back
                  </button>
                  <h3 style={{ color:"#fff", fontSize:"16px", fontWeight:"600", marginBottom:"14px" }}>
                    Step 5: Confirm Appointment
                  </h3>
                  <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
                    borderRadius:"12px", padding:"20px", marginBottom:"20px" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
                      {[
                        ["💉 Vaccine",   selectedVaccine?.name],
                        ["🏥 Hospital",  selectedHospital?.name],
                        ["📍 Location",  selectedHospital?.location?.split(",")[0]],
                        ["💰 Price",     selectedHospital?.price === 0 ? "FREE" : `₹${selectedHospital?.price}`],
                        ["📅 Date",      selectedDate],
                        ["⏰ Time",      selectedTime],
                        ["👤 Patient",   form.name],
                        ["🎂 Age",       `${form.age} years`],
                        ["📞 Phone",     form.phone],
                        ["📧 Email",     form.email || "Not provided"],
                      ].map(([k,v]) => (
                        <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:"8px", padding:"10px 14px" }}>
                          <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.4)" }}>{k}</div>
                          <div style={{ fontSize:"13px", color:"#fff", fontWeight:"500", marginTop:"2px" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {form.notes && (
                      <div style={{ marginTop:"12px", padding:"10px 14px", background:"rgba(245,158,11,0.1)",
                        borderRadius:"8px", fontSize:"12px", color:"rgba(255,255,255,0.7)" }}>
                        📝 Notes: {form.notes}
                      </div>
                    )}
                  </div>
                  <div style={{ background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)",
                    borderRadius:"10px", padding:"12px 16px", marginBottom:"16px", fontSize:"12px", color:"rgba(255,255,255,0.6)" }}>
                    ✅ Please arrive 15 minutes before your appointment. Bring a valid photo ID.
                  </div>
                  <button type="button" onClick={confirmAppointment}
                    style={{ padding:"13px 32px", borderRadius:"10px", fontSize:"15px",
                      fontWeight:"700", cursor:"pointer",
                      background:"linear-gradient(135deg,#4ADE80,#16A34A)",
                      border:"none", color:"#fff",
                      boxShadow:"0 4px 16px rgba(34,197,94,0.3)" }}>
                    ✓ Confirm Appointment
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* My Appointments */}
      {tab === "my-appointments" && (
        <div>
          {appointments.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px", color:"rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize:"48px", marginBottom:"12px" }}>📅</div>
              <div style={{ fontSize:"16px", fontWeight:"500" }}>No appointments booked yet</div>
              <button type="button" onClick={() => setTab("book")}
                style={{ marginTop:"16px", padding:"10px 24px", borderRadius:"9px", fontSize:"13px",
                  fontWeight:"600", cursor:"pointer", background:"rgba(79,195,247,0.15)",
                  border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
                Book Your First Appointment
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {appointments.map((appt) => {
                const ss = STATUS_STYLE[appt.status] || STATUS_STYLE.Pending;
                return (
                  <div key={appt.id} style={{ background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px",
                    padding:"18px 20px" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between",
                      gap:"12px", flexWrap:"wrap" }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                          <span style={{ color:"#fff", fontWeight:"700", fontSize:"15px" }}>{appt.vaccine}</span>
                          <span style={{ fontSize:"11px", padding:"2px 10px", borderRadius:"20px",
                            background:ss.bg, color:ss.color, border:`1px solid ${ss.border}`, fontWeight:"600" }}>
                            {appt.status}
                          </span>
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:"6px" }}>
                          {[
                            ["🏥", appt.hospital],
                            ["📅", appt.date],
                            ["⏰", appt.time],
                            ["💰", appt.price === 0 ? "FREE" : `₹${appt.price}`],
                            ["👤", appt.patientName],
                            ["📞", appt.phone],
                          ].map(([icon, val]) => (
                            <span key={icon} style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)" }}>
                              {icon} {val}
                            </span>
                          ))}
                        </div>
                        <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.3)", marginTop:"8px" }}>
                          ID: {appt.id} • Booked: {new Date(appt.bookedAt).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                        <button type="button" onClick={() => printAppointment(appt)}
                          style={{ display:"flex", alignItems:"center", gap:"4px", padding:"7px 12px",
                            borderRadius:"7px", fontSize:"12px", cursor:"pointer",
                            background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
                          <Printer size={13}/> Print
                        </button>
                        {appt.status === "Confirmed" && (
                          <button type="button" onClick={() => cancelAppointment(appt.id)}
                            style={{ display:"flex", alignItems:"center", gap:"4px", padding:"7px 12px",
                              borderRadius:"7px", fontSize:"12px", cursor:"pointer",
                              background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#F87171" }}>
                            <X size={13}/> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
