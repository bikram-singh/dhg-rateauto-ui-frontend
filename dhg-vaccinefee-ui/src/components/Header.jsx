import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 80 80" width="60" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4FC3F7"/>
                <stop offset="100%" stopColor="#1565C0"/>
              </linearGradient>
            </defs>
            <path d="M40 4 L72 18 L72 44 C72 60 56 72 40 76 C24 72 8 60 8 44 L8 18 Z"
              fill="url(#shieldGrad)" opacity="0.15" stroke="url(#shieldGrad)" strokeWidth="3"/>
            <path d="M40 10 L68 22 L68 44 C68 58 54 68 40 72 C26 68 12 58 12 44 L12 22 Z"
              fill="white" opacity="0.12"/>
            <text x="40" y="36" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4FC3F7" fontFamily="sans-serif" letterSpacing="1">CARING FOR</text>
            <text x="40" y="45" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4FC3F7" fontFamily="sans-serif" letterSpacing="1">EVERY LIFE</text>
            <text x="40" y="62" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1565C0" fontFamily="sans-serif" letterSpacing="2">DHG</text>
            <rect x="34" y="15" width="12" height="4" rx="1" fill="white"/>
            <rect x="38" y="11" width="4" height="12" rx="1" fill="white"/>
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
