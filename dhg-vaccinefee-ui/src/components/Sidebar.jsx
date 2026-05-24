import { LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2, CreditCard, MessageSquare } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Building2, label: "Departments" },
  { icon: Building, label: "Hospitals" },
  { icon: DollarSign, label: "Pricing" },
];

const bottomItems = [
  { icon: Phone, label: "Contact" },
  { icon: BarChart2, label: "Reports" },
  { icon: CreditCard, label: "Billing" },
  { icon: MessageSquare, label: "Support" },
];

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className={`sidebar-item ${active === label ? "sidebar-item--active" : ""}`}
            onClick={() => setActive(label)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        {bottomItems.map(({ icon: Icon, label }) => (
          <button key={label} className="sidebar-item sidebar-item--bottom" title={label}>
            <Icon size={18} />
          </button>
        ))}
      </div>
    </aside>
  );
}
