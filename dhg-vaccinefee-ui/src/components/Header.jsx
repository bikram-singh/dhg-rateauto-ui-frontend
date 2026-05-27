import { Search, Bell, Sun, Moon, ChevronDown, X } from "lucide-react";
import { useState, useMemo } from "react";

export default function Header({ searchQuery = "", setSearchQuery, darkMode, toggleDarkMode, pricing = [] }) {
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
        <div className="header-logo-wrap">
          <svg viewBox="0 0 120 140" width="64" height="74" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="120" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00BCD4"/>
                <stop offset="50%" stopColor="#29B6F6"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
              <linearGradient id="crossGrad" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4FC3F7"/>
                <stop offset="100%" stopColor="#1E88E5"/>
              </linearGradient>
              <linearGradient id="circleGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00BCD4"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
            </defs>
            <circle cx="60" cy="10" r="10" fill="url(#circleGrad)" stroke="white" strokeWidth="2.5"/>
            <circle cx="60" cy="10" r="5" fill="white" opacity="0.9"/>
            <path d="M60 22 L108 40 L108 85 C108 110 86 126 60 134 C34 126 12 110 12 85 L12 40 Z" fill="url(#shieldGrad)"/>
            <path d="M60 28 L102 44 L102 85 C102 107 82 121 60 129 C38 121 18 107 18 85 L18 44 Z" fill="white"/>
            <path id="topArc" d="M 28 58 A 34 34 0 0 1 92 58" fill="none"/>
            <text fontSize="7.5" fontWeight="600" fill="#29B6F6" fontFamily="sans-serif" letterSpacing="1.5">
              <textPath href="#topArc" startOffset="8%">CARING FOR EVERY LIFE</textPath>
            </text>
            <rect x="48" y="62" width="24" height="8" rx="4" fill="url(#crossGrad)"/>
            <rect x="56" y="54" width="8" height="24" rx="4" fill="url(#crossGrad)"/>
            <text x="60" y="100" textAnchor="middle" fontSize="14" fontWeight="700" fill="#29B6F6" fontFamily="sans-serif" letterSpacing="4">DHG</text>
            <path id="botArc" d="M 22 105 A 42 42 0 0 0 98 105" fill="none"/>
            <text fontSize="7" fontWeight="500" fill="#29B6F6" fontFamily="sans-serif" letterSpacing="0.5">
              <textPath href="#botArc" startOffset="5%">Dummy Health Group</textPath>
            </text>
          </svg>
        </div>
        <div className="header-brand-text">
          <h1 className="header-title">Dummy Health Group</h1>
          <p className="header-subtitle">Caring for Every Life</p>
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

        <div className="header-user">
          <div className="header-avatar">JD</div>
          <div className="header-user-info">
            <span className="header-user-role">Admin</span>
            <span className="header-user-name">Bikram Singh</span>
          </div>
          <ChevronDown size={16} className="header-chevron" />
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
