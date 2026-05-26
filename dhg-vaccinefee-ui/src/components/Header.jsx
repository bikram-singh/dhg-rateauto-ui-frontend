import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">
          <svg viewBox="0 0 90 90" width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#64B5F6"/>
                <stop offset="50%" stopColor="#1565C0"/>
                <stop offset="100%" stopColor="#0D47A1"/>
              </linearGradient>
              <linearGradient id="crossGrad" x1="0" y1="0" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF"/>
                <stop offset="100%" stopColor="#E3F2FD"/>
              </linearGradient>
            </defs>
            {/* Outer shield */}
            <path d="M45 5 L78 20 L78 48 C78 66 63 78 45 83 C27 78 12 66 12 48 L12 20 Z"
              fill="url(#shieldGrad)" />
            {/* Inner shield highlight */}
            <path d="M45 12 L72 25 L72 48 C72 63 59 73 45 78 C31 73 18 63 18 48 L18 25 Z"
              fill="white" opacity="0.15"/>
            {/* Cross symbol */}
            <rect x="38" y="24" width="14" height="42" rx="3" fill="url(#crossGrad)" opacity="0.95"/>
            <rect x="22" y="38" width="46" height="14" rx="3" fill="url(#crossGrad)" opacity="0.95"/>
            {/* DHG text */}
            <text x="45" y="72" textAnchor="middle" fontSize="10" fontWeight="800"
              fill="white" fontFamily="sans-serif" letterSpacing="2" opacity="0.9">DHG</text>
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
