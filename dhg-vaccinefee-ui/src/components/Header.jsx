import { Search, Bell, Sun, Moon, ChevronDown, X, LogOut, Share2 } from "lucide-react";
import { useState, useMemo } from "react";

export default function Header({ searchQuery = "", setSearchQuery, darkMode, toggleDarkMode, pricing = [], user, onLogout }) {
  const [showAlerts, setShowAlerts]   = useState(false);
  const [dismissed, setDismissed]     = useState([]);

  // Find low stock items
  const lowStockItems = useMemo(() => {
    return pricing
      .filter((p) => p.stock_quantity !== null && p.stock_quantity !== undefined && p.stock_quantity <= 10)
      .slice(0, 10);
  }, [pricing]);

  const activeAlerts = lowStockItems.filter((p) => !dismissed.includes(p.id));
  const hasAlerts    = activeAlerts.length > 0;

  return (
    <header className="header">
      <div className="header-brand">
        {/* Brand logo box — white background with blue logo inside, matching sketch */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0",
          background: "white", borderRadius: "12px",
          border: "2px solid #E0E7EF", padding: "6px 16px 6px 8px",
          boxShadow: "0 2px 8px rgba(21,101,192,0.12)"
        }}>
          {/* Shield logo */}
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
            {/* Top circle */}
            <circle cx="40" cy="7" r="7" fill="url(#hSG)" stroke="white" strokeWidth="2"/>
            <circle cx="40" cy="7" r="3.5" fill="white" opacity="0.9"/>
            {/* Shield outer */}
            <path d="M40 15 L72 27 L72 56 C72 73 58 83 40 88 C22 83 8 73 8 56 L8 27 Z" fill="url(#hSG)"/>
            {/* Shield white inner */}
            <path d="M40 20 L68 30 L68 56 C68 71 55 79 40 84 C25 79 12 71 12 56 L12 30 Z" fill="white"/>
            {/* Plus cross */}
            <rect x="32" y="42" width="16" height="5.5" rx="2.5" fill="url(#hCG)"/>
            <rect x="37" y="36" width="6" height="17" rx="2.5" fill="url(#hCG)"/>
            {/* DHG text */}
            <text x="40" y="75" textAnchor="middle" fontSize="9" fontWeight="800"
              fill="#1565C0" fontFamily="sans-serif" letterSpacing="2.5">DHG</text>
          </svg>

          {/* Brand text beside logo */}
          <div style={{ paddingLeft: "4px" }}>
            <div style={{
              fontSize: "17px", fontWeight: "700", color: "#0D1B4B",
              lineHeight: 1.2, letterSpacing: "-0.3px"
            }}>Dummy Health Group</div>
            <div style={{
              fontSize: "11px", color: "#1565C0", fontWeight: "500", letterSpacing: "0.2px"
            }}>Caring for Every Life</div>
          </div>
        </div>
      </div>

      <div className="header-search" style={{ position: "relative" }}>
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search vaccines, departments, hospitals..."
          className="header-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={{
            position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: "16px"
          }}>✕</button>
        )}
      </div>

      <div className="header-actions">
        {/* Bell with low stock alerts */}
        <div style={{ position: "relative" }}>
          <button
            className="header-icon-btn"
            aria-label="Notifications"
            onClick={() => setShowAlerts(!showAlerts)}
            style={{ position: "relative" }}
          >
            <Bell size={20} />
            {hasAlerts && (
              <span style={{
                position: "absolute", top: "6px", right: "6px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#EF4444", border: "2px solid white",
                animation: "bellPulse 1.5s ease-in-out infinite"
              }}/>
            )}
          </button>

          {/* Alerts dropdown */}
          {showAlerts && (
            <div style={{
              position: "absolute", top: "48px", right: "0",
              width: "320px", background: "#0D1B4B",
              border: "1px solid rgba(79,195,247,0.3)",
              borderRadius: "12px", zIndex: 1000,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
            }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>
                  🔔 Low Stock Alerts
                </span>
                <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                  background: hasAlerts ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)",
                  color: hasAlerts ? "#F87171" : "#4ADE80" }}>
                  {activeAlerts.length} alerts
                </span>
              </div>
              <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                {activeAlerts.length === 0 ? (
                  <div style={{ padding: "24px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                    ✅ All stocks are healthy
                  </div>
                ) : activeAlerts.map((p, i) => (
                  <div key={p.id} style={{
                    padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <div>
                      <div style={{ color: "#fff", fontSize: "12px", fontWeight: "500" }}>
                        {p.vaccine?.name || `Vaccine #${p.vaccine_id}`}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                        {p.hospital?.name || `Hospital #${p.hospital_id}`}
                      </div>
                      <div style={{ fontSize: "11px", marginTop: "2px" }}>
                        <span style={{ color: p.stock_quantity === 0 ? "#F87171" : "#FCD34D", fontWeight: "600" }}>
                          {p.stock_quantity === 0 ? "⚠️ Out of Stock" : `⚠️ Only ${p.stock_quantity} left`}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setDismissed([...dismissed, p.id])}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)",
                        cursor: "pointer", padding: "4px" }}>
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

        <button className="header-icon-btn" aria-label="Toggle theme" onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Share deep link button */}
        <button className="header-icon-btn" title="Share current page"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied! Share: " + window.location.href);
          }}>
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
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)",
              cursor:"pointer", padding:"4px", marginLeft:"4px", display:"flex", alignItems:"center" }}>
            <LogOut size={16}/>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bellPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
    </header>
  );
}
