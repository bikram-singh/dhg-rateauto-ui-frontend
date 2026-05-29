import { Search, Bell, Sun, Moon, X, LogOut, Share2, Building, Pill, Building2 } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

export default function Header({
  searchQuery = "", setSearchQuery, darkMode, toggleDarkMode,
  pricing = [], vaccines = [], hospitals = [], departments = [],
  user, onLogout, onNavigate
}) {
  const [showAlerts,  setShowAlerts]  = useState(false);
  const [dismissed,   setDismissed]   = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [focused,     setFocused]     = useState(false);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── All navigable pages ──
  const ALL_PAGES = [
    { label: "Dashboard",        icon: "🏠", desc: "Main dashboard with live KPIs and charts" },
    { label: "Departments",      icon: "🏢", desc: "Medical department categories" },
    { label: "Hospitals",        icon: "🏥", desc: "All hospitals directory" },
    { label: "Hospital Profiles",icon: "🔍", desc: "Detailed hospital profiles with charts" },
    { label: "Rankings",         icon: "🏆", desc: "Hospital rankings by score" },
    { label: "Compare",          icon: "⚖️", desc: "Compare hospitals side by side" },
    { label: "Vaccine Search",   icon: "🔎", desc: "Search vaccines by age, category, price" },
    { label: "Vaccine Details",  icon: "💉", desc: "Clinical info, side effects, schedule" },
    { label: "Vaccine Card",     icon: "🪪", desc: "Print your vaccination record card" },
    { label: "Appointments",     icon: "📅", desc: "Book vaccination appointments" },
    { label: "Pricing",          icon: "💰", desc: "Vaccine pricing across all hospitals" },
    { label: "Price History",    icon: "📈", desc: "Historical price trends" },
    { label: "Price Prediction", icon: "🤖", desc: "3-month ML price forecast" },
    { label: "City Analytics",   icon: "🌍", desc: "Compare cities — Delhi, Mumbai, Bengaluru" },
    { label: "Advanced Reports", icon: "📊", desc: "PDF export and email reports" },
    { label: "Reports",          icon: "📋", desc: "Summary reports and analytics" },
    { label: "Admin Panel",      icon: "⚙️", desc: "Add, edit, delete records" },
    { label: "User Management",  icon: "👥", desc: "Add and manage dashboard users" },
    { label: "Audit Log",        icon: "📝", desc: "Track all user actions" },
    { label: "AI Advisor",       icon: "✨", desc: "Voice and chat vaccine advisor" },
  ];

  // ── Live search results ──
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return { pages: [], vaccines: [], hospitals: [], departments: [] };

    // Pages
    const matchPages = ALL_PAGES.filter((p) =>
      p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    ).slice(0, 4);

    // Vaccines
    const matchVaccines = vaccines
      .filter((v) =>
        v.name.toLowerCase().includes(q) ||
        (v.manufacturer || "").toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((v) => {
        const records = pricing.filter((p) => p.vaccine_id === v.id);
        const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
        const minP    = prices.length ? Math.min(...prices) : null;
        return { ...v, minPrice: minP, hospitalCount: records.length, type: "vaccine" };
      });

    // Hospitals
    const matchHospitals = hospitals
      .filter((h) =>
        h.name.toLowerCase().includes(q) ||
        (h.location || "").toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((h) => {
        const records = pricing.filter((p) => p.hospital_id === h.id);
        const prices  = records.map((p) => parseFloat(p.price)).filter((p) => p > 0);
        const avgP    = prices.length ? Math.round(prices.reduce((a,b)=>a+b,0)/prices.length) : null;
        return { ...h, avgPrice: avgP, vaccineCount: [...new Set(records.map((p) => p.vaccine_id))].length, type: "hospital" };
      });

    // Departments
    const matchDepts = departments
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((d) => ({ ...d, type: "department" }));

    return { pages: matchPages, vaccines: matchVaccines, hospitals: matchHospitals, departments: matchDepts };
  }, [searchQuery, vaccines, hospitals, departments, pricing]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalResults =
    searchResults.pages.length +
    searchResults.vaccines.length +
    searchResults.hospitals.length +
    searchResults.departments.length;

  const hasResults = searchQuery.length >= 2;

  const handleSelect = (item) => {
    setShowResults(false);
    setSearchQuery("");
    if (!onNavigate) return;
    if (item.type === "page")       onNavigate(item.label);
    else if (item.type === "vaccine")    onNavigate("Vaccine Search");
    else if (item.type === "hospital")   onNavigate("Hospital Profiles");
    else if (item.type === "department") onNavigate("Departments");
  };

  // Low stock alerts
  const lowStockItems = useMemo(() =>
    pricing.filter((p) => p.stock_quantity != null && p.stock_quantity <= 10).slice(0, 10),
    [pricing]
  );
  const activeAlerts = lowStockItems.filter((p) => !dismissed.includes(p.id));
  const hasAlerts    = activeAlerts.length > 0;

  return (
    <header className="header">
      {/* ── Brand Logo ── */}
      <div className="header-brand">
        <div style={{
          display: "flex", alignItems: "center",
          background: "white", borderRadius: "12px",
          border: "2px solid #E0E7EF", padding: "6px 16px 6px 8px",
          boxShadow: "0 2px 8px rgba(21,101,192,0.12)"
        }}>
          <svg viewBox="0 0 80 90" width="54" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="hSG" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00BCD4"/>
                <stop offset="50%" stopColor="#29B6F6"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
              <linearGradient id="hCG" x1="0" y1="0" x2="40" y2="55" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4FC3F7"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
            </defs>
            <circle cx="40" cy="7" r="7" fill="url(#hSG)" stroke="white" strokeWidth="2"/>
            <circle cx="40" cy="7" r="3.5" fill="white" opacity="0.9"/>
            <path d="M40 15 L72 27 L72 56 C72 73 58 83 40 88 C22 83 8 73 8 56 L8 27 Z" fill="url(#hSG)"/>
            <path d="M40 20 L68 30 L68 56 C68 71 55 79 40 84 C25 79 12 71 12 56 L12 30 Z" fill="white"/>
            <rect x="32" y="42" width="16" height="5.5" rx="2.5" fill="url(#hCG)"/>
            <rect x="37" y="36" width="6" height="17" rx="2.5" fill="url(#hCG)"/>
            <text x="40" y="75" textAnchor="middle" fontSize="9" fontWeight="800"
              fill="#1565C0" fontFamily="sans-serif" letterSpacing="2.5">DHG</text>
          </svg>
          <div style={{ paddingLeft: "4px" }}>
            <div style={{ fontSize: "17px", fontWeight: "700", color: "#0D1B4B", lineHeight: 1.2, letterSpacing: "-0.3px" }}>
              Dummy Health Group
            </div>
            <div style={{ fontSize: "11px", color: "#1565C0", fontWeight: "500" }}>
              Caring for Every Life
            </div>
          </div>
        </div>
      </div>

      {/* ── Search with live dropdown ── */}
      <div ref={searchRef} className="header-search" style={{ position: "relative" }}>
        <Search size={16} className="header-search-icon"/>
        <input
          type="text"
          placeholder="Search vaccines, hospitals, departments..."
          className="header-search-input"
          value={searchQuery}
          onChange={(e) => { setSearchQuery && setSearchQuery(e.target.value); setShowResults(true); }}
          onFocus={() => { setFocused(true); setShowResults(true); }}
          style={{ borderColor: focused ? "rgba(79,195,247,0.5)" : undefined }}
          autoComplete="off"
        />
        {searchQuery && (
          <button onClick={() => { setSearchQuery(""); setShowResults(false); }}
            style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", color:"#94A3B8", fontSize:"16px" }}>
            <X size={14}/>
          </button>
        )}

        {/* ── Dropdown results ── */}
        {showResults && hasResults && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#0D1B4B", border: "1px solid rgba(79,195,247,0.3)",
            borderRadius: "12px", zIndex: 2000, overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            maxHeight: "420px", overflowY: "auto",
          }}>
            {totalResults === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                No results for "{searchQuery}"
              </div>
            ) : (
              <>
                {/* Pages */}
                {searchResults.pages.length > 0 && (
                  <div>
                    <div style={{ padding: "8px 14px 4px", fontSize: "10px", fontWeight: "700",
                      color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      🗂️ Pages ({searchResults.pages.length})
                    </div>
                    {searchResults.pages.map((p) => (
                      <div key={p.label} onClick={() => handleSelect({ ...p, type: "page" })}
                        style={{ padding: "10px 14px", cursor: "pointer", display: "flex",
                          alignItems: "center", gap: "10px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,195,247,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "15px" }}>
                          {p.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{p.label}</div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.desc}
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                          background: "rgba(79,195,247,0.15)", color: "#4FC3F7",
                          border: "1px solid rgba(79,195,247,0.3)", flexShrink: 0 }}>
                          Page →
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vaccines */}
                {searchResults.vaccines.length > 0 && (
                  <div>
                    <div style={{ padding: "8px 14px 4px", fontSize: "10px", fontWeight: "700",
                      color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      💉 Vaccines ({searchResults.vaccines.length})
                    </div>
                    {searchResults.vaccines.map((v) => (
                      <div key={v.id} onClick={() => handleSelect(v)}
                        style={{ padding: "10px 14px", cursor: "pointer", display: "flex",
                          alignItems: "center", gap: "10px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,195,247,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: "rgba(102,187,106,0.15)", border: "1px solid rgba(102,187,106,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Pill size={14} style={{ color: "#66BB6A" }}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: "500",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {v.name}
                          </div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
                            {v.manufacturer} • {v.hospitalCount} hospitals
                            {v.minPrice != null && ` • from ₹${v.minPrice}`}
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                          background: "rgba(102,187,106,0.15)", color: "#66BB6A",
                          border: "1px solid rgba(102,187,106,0.3)", flexShrink: 0 }}>
                          Vaccine
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hospitals */}
                {searchResults.hospitals.length > 0 && (
                  <div>
                    <div style={{ padding: "8px 14px 4px", fontSize: "10px", fontWeight: "700",
                      color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      🏥 Hospitals ({searchResults.hospitals.length})
                    </div>
                    {searchResults.hospitals.map((h) => (
                      <div key={h.id} onClick={() => handleSelect(h)}
                        style={{ padding: "10px 14px", cursor: "pointer", display: "flex",
                          alignItems: "center", gap: "10px",
                          borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,195,247,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: "rgba(41,182,246,0.15)", border: "1px solid rgba(41,182,246,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building size={14} style={{ color: "#29B6F6" }}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: "500",
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {h.name}
                          </div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>
                            {h.location} • {h.vaccineCount} vaccines
                            {h.avgPrice != null && ` • avg ₹${h.avgPrice}`}
                          </div>
                        </div>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                          background: "rgba(41,182,246,0.15)", color: "#29B6F6",
                          border: "1px solid rgba(41,182,246,0.3)", flexShrink: 0 }}>
                          Hospital
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Departments */}
                {searchResults.departments.length > 0 && (
                  <div>
                    <div style={{ padding: "8px 14px 4px", fontSize: "10px", fontWeight: "700",
                      color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.8px",
                      borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      🏢 Departments ({searchResults.departments.length})
                    </div>
                    {searchResults.departments.map((d) => (
                      <div key={d.id} onClick={() => handleSelect(d)}
                        style={{ padding: "10px 14px", cursor: "pointer", display: "flex",
                          alignItems: "center", gap: "10px" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(79,195,247,0.1)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                          background: "rgba(171,71,188,0.15)", border: "1px solid rgba(171,71,188,0.3)",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building2 size={14} style={{ color: "#AB47BC" }}/>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>{d.name}</div>
                          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px" }}>Department</div>
                        </div>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "20px",
                          background: "rgba(171,71,188,0.15)", color: "#AB47BC",
                          border: "1px solid rgba(171,71,188,0.3)", flexShrink: 0 }}>
                          Dept
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding: "8px 14px", borderTop: "1px solid rgba(255,255,255,0.06)",
                  fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                  {totalResults} result{totalResults !== 1 ? "s" : ""} for "{searchQuery}" • Press Enter to search all
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="header-actions">
        {/* Bell alerts */}
        <div style={{ position: "relative" }}>
          <button className="header-icon-btn" aria-label="Notifications"
            onClick={() => { setShowAlerts(!showAlerts); setShowResults(false); }}
            style={{ position: "relative" }}>
            <Bell size={20}/>
            {hasAlerts && (
              <span style={{ position: "absolute", top: "6px", right: "6px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#EF4444", border: "2px solid white",
                animation: "bellPulse 1.5s ease-in-out infinite" }}/>
            )}
          </button>

          {showAlerts && (
            <div style={{ position: "absolute", top: "48px", right: "0",
              width: "320px", background: "#0D1B4B",
              border: "1px solid rgba(79,195,247,0.3)", borderRadius: "12px",
              zIndex: 1000, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>🔔 Low Stock Alerts</span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                  background: hasAlerts ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
                  color: hasAlerts ? "#F87171" : "#4ADE80" }}>
                  {activeAlerts.length} alerts
                </span>
              </div>
              <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                {activeAlerts.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center",
                    color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                    ✅ All stocks are healthy
                  </div>
                ) : activeAlerts.map((p) => (
                  <div key={p.id} style={{ padding: "10px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ color: "#fff", fontSize: "12px", fontWeight: "500" }}>
                        {p.vaccine?.name || `Vaccine #${p.vaccine_id}`}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                        {p.hospital?.name || `Hospital #${p.hospital_id}`}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "600",
                        color: p.stock_quantity === 0 ? "#F87171" : "#FCD34D" }}>
                        {p.stock_quantity === 0 ? "⚠️ Out of Stock" : `⚠️ Only ${p.stock_quantity} left`}
                      </span>
                    </div>
                    <button onClick={() => setDismissed([...dismissed, p.id])}
                      style={{ background: "none", border: "none",
                        color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px" }}>
                      <X size={14}/>
                    </button>
                  </div>
                ))}
              </div>
              {activeAlerts.length > 0 && (
                <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  <button onClick={() => setDismissed(activeAlerts.map((p) => p.id))}
                    style={{ width: "100%", padding: "7px", borderRadius: "8px", fontSize: "12px",
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
                    Dismiss All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="header-icon-btn" onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>

        <button className="header-icon-btn" title="Share current page"
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}>
          <Share2 size={18}/>
        </button>

        <div className="header-user">
          <div className="header-avatar">
            {user?.name ? user.name.split(" ").map((n) => n[0]).join("").substring(0,2).toUpperCase() : "BS"}
          </div>
          <div className="header-user-info">
            <span className="header-user-role">{user?.role || "Admin"}</span>
            <span className="header-user-name">{user?.name || "Bikram Singh"}</span>
          </div>
          <button onClick={onLogout} title="Logout"
            style={{ background:"none", border:"none", color:"#4FC3F7",
              cursor:"pointer", padding:"4px", marginLeft:"4px",
              display:"flex", alignItems:"center" }}>
            <LogOut size={16}/>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bellPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
    </header>
  );
}