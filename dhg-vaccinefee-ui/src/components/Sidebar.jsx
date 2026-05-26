import { LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2, CreditCard, MessageSquare } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Building2,       label: "Departments" },
  { icon: Building,        label: "Hospitals" },
  { icon: DollarSign,      label: "Pricing" },
];

const bottomItems = [
  { icon: Phone,         label: "Contact",  tooltip: "+91-9466679107" },
  { icon: BarChart2,     label: "Reports",  tooltip: "Reports" },
  { icon: CreditCard,    label: "Billing",  tooltip: "Billing" },
  { icon: MessageSquare, label: "Support",  tooltip: "support@dummyhealthgroup.com" },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [hovered, setHovered] = useState(null);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className={`sidebar-item ${activePage === label ? "sidebar-item--active" : ""}`}
            onClick={() => setActivePage(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {bottomItems.map(({ icon: Icon, label, tooltip }) => (
          <div key={label} style={{ position: "relative" }}>
            <button
              className="sidebar-item sidebar-item--bottom"
              title={tooltip}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                if (label === "Contact") window.open("tel:+919466679107");
                if (label === "Support") window.open("mailto:support@dummyhealthgroup.com");
              }}
            >
              <Icon size={18} />
            </button>
            {hovered === label && (
              <div style={{
                position: "absolute", left: "52px", bottom: "0",
                background: "rgba(13,27,75,0.97)", border: "1px solid rgba(79,195,247,0.3)",
                borderRadius: "8px", padding: "8px 14px", whiteSpace: "nowrap",
                color: "#fff", fontSize: "12px", zIndex: 1000, pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}>
                <div style={{ fontWeight: 600, color: "#4FC3F7", marginBottom: "2px" }}>{label}</div>
                <div>{tooltip}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
