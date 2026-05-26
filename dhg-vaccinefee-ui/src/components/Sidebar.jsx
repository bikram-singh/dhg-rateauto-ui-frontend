import {
  LayoutDashboard,
  Building2,
  Building,
  DollarSign
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Building2, label: "Departments" },
  { icon: Building, label: "Hospitals" },
  { icon: DollarSign, label: "Pricing" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label }, index) => (
          <button
            key={label}
            className={`sidebar-item ${index === 0 ? "sidebar-item--active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
