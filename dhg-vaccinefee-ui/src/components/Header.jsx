import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header({ searchQuery = "", setSearchQuery }) {
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

      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search vaccines, departments, hospitals..."
          className="header-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{ position:"absolute", right:"14px", top:"50%", transform:"translateY(-50%)",
              background:"none", border:"none", cursor:"pointer", color:"#94A3B8", fontSize:"16px" }}
          >✕</button>
        )}
      </div>

      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Notifications"><Bell size={20} /></button>
        <button className="header-icon-btn" aria-label="Toggle theme"><Moon size={20} /></button>
        <div className="header-user">
          <div className="header-avatar">JD</div>
          <div className="header-user-info">
            <span className="header-user-role">Admin</span>
            <span className="header-user-name">John Doe</span>
          </div>
          <ChevronDown size={16} className="header-chevron" />
        </div>
      </div>
    </header>
  );
}
