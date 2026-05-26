import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 80 80" width="72" height="72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4FC3F7"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
            </defs>
            {/* White base circle behind shield */}
            <circle cx="40" cy="40" r="36" fill="white" opacity="0.95"/>
            {/* Shield outline */}
            <path d="M40 6 L70 19 L70 43 C70 58 56 70 40 74 C24 70 10 58 10 43 L10 19 Z"
              fill="url(#shieldGrad)" opacity="0.18" stroke="url(#shieldGrad)" strokeWidth="2.5"/>
            {/* Inner shield fill */}
            <path d="M40 12 L66 23 L66 43 C66 56 54 66 40 70 C26 66 14 56 14 43 L14 23 Z"
              fill="url(#shieldGrad)" opacity="0.12"/>
            {/* Cross / plus icon */}
            <rect x="35" y="20" width="10" height="3.5" rx="1.5" fill="#1565C0"/>
            <rect x="38.25" y="16.5" width="3.5" height="10" rx="1.5" fill="#1565C0"/>
            {/* CARING FOR EVERY LIFE text */}
            <text x="40" y="40" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#4FC3F7" fontFamily="sans-serif" letterSpacing="0.5">CARING FOR</text>
            <text x="40" y="49" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#4FC3F7" fontFamily="sans-serif" letterSpacing="0.5">EVERY LIFE</text>
            {/* DHG label */}
            <text x="40" y="64" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1565C0" fontFamily="sans-serif" letterSpacing="2.5">DHG</text>
          </svg>
        </div>
        <div>
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
        />
      </div>

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
