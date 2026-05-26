import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="header">

      {/* ── BRAND ── */}
      <div className="header-brand">
        <div className="header-logo-wrap">
          <svg viewBox="0 0 90 90" width="68" height="68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shGrad" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4FC3F7"/>
                <stop offset="100%" stopColor="#0D47A1"/>
              </linearGradient>
            </defs>
            {/* White card base */}
            <rect x="4" y="4" width="82" height="82" rx="16" fill="white"/>
            {/* Shield body */}
            <path d="M45 10 L76 23 L76 50 C76 66 62 77 45 82 C28 77 14 66 14 50 L14 23 Z"
              fill="url(#shGrad)" opacity="0.13"/>
            <path d="M45 15 L72 26 L72 50 C72 64 60 73 45 78 C30 73 18 64 18 50 L18 26 Z"
              fill="url(#shGrad)" opacity="0.10" stroke="url(#shGrad)" strokeWidth="1.5"/>
            {/* Plus cross */}
            <rect x="39" y="22" width="12" height="4" rx="2" fill="#1565C0"/>
            <rect x="42.5" y="18.5" width="5" height="11" rx="2" fill="#1565C0"/>
            {/* Text lines */}
            <text x="45" y="46" textAnchor="middle" fontSize="8" fontWeight="700"
              fill="#1976D2" fontFamily="sans-serif" letterSpacing="0.6">CARING FOR</text>
            <text x="45" y="56" textAnchor="middle" fontSize="8" fontWeight="700"
              fill="#1976D2" fontFamily="sans-serif" letterSpacing="0.6">EVERY LIFE</text>
            {/* DHG bold label */}
            <text x="45" y="72" textAnchor="middle" fontSize="13" fontWeight="800"
              fill="#0D47A1" fontFamily="sans-serif" letterSpacing="3">DHG</text>
          </svg>
        </div>

        <div className="header-brand-text">
          <h1 className="header-title">Dummy Health Group</h1>
          <p className="header-subtitle">Caring for Every Life</p>
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search vaccines, departments, hospitals..."
          className="header-search-input"
        />
      </div>

      {/* ── ACTIONS ── */}
      <div className="header-actions">
        <button className="header-icon-btn" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className="header-icon-btn" aria-label="Toggle theme">
          <Moon size={20} />
        </button>
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
