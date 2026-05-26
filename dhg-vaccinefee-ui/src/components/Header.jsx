import { Search, Bell, Moon, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div>
          <h1 className="header-title">Dummy Health Group</h1>
          <p className="header-subtitle">Caring for Every Life</p>
        </div>
      </div>

      <div className="header-search">
        <Search size={18} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search vaccines, departments, hospitals..."
          className="header-search-input"
        />
      </div>

      <div className="header-actions">
        <button className="header-icon-btn">
          <Bell size={18} />
        </button>

        <button className="header-icon-btn">
          <Moon size={18} />
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
