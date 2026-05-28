import {
  LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2,
  CreditCard, MessageSquare, TrendingUp, Search, GitCompare,
  Pill, Trophy, Globe, Activity, Settings, Users, ClipboardList,
  CalendarCheck, LineChart, FileBarChart, Stethoscope
} from "lucide-react";
import { useState } from "react";

// ── Grouped nav structure ──
const navGroups = [
  {
    group: "MAIN",
    items: [
      { icon: LayoutDashboard, label: "Dashboard" },
    ]
  },
  {
    group: "HOSPITALS",
    items: [
      { icon: Building2,       label: "Departments" },
      { icon: Building,        label: "Hospitals" },
      { icon: Stethoscope,     label: "Hospital Profiles" },
      { icon: Trophy,          label: "Rankings" },
      { icon: GitCompare,      label: "Compare" },
    ]
  },
  {
    group: "VACCINES",
    items: [
      { icon: Pill,            label: "Vaccine Details" },
      { icon: Search,          label: "Vaccine Search" },
      { icon: CreditCard,      label: "Vaccine Card" },
      { icon: CalendarCheck,   label: "Appointments" },
    ]
  },
  {
    group: "PRICING",
    items: [
      { icon: DollarSign,      label: "Pricing" },
      { icon: TrendingUp,      label: "Price History" },
      { icon: LineChart,       label: "Price Prediction" },
    ]
  },
  {
    group: "ANALYTICS",
    items: [
      { icon: Globe,           label: "City Analytics" },
      { icon: BarChart2,       label: "Advanced Reports" },
      { icon: FileBarChart,    label: "Reports" },
    ]
  },
  {
    group: "ADMIN",
    items: [
      { icon: Settings,        label: "Admin Panel" },
      { icon: Users,           label: "User Management" },
      { icon: ClipboardList,   label: "Audit Log" },
    ]
  },
];

const bottomItems = [
  { icon: Phone,         label: "Contact", tooltip: "+91-9466679107" },
  { icon: BarChart2,     label: "Billing",  tooltip: "Billing" },
  { icon: MessageSquare, label: "Support",  tooltip: "support@dummyhealthgroup.com" },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [hovered, setHovered] = useState(null);

  const handleBottomClick = (label) => {
    if (label === "Contact") window.open("tel:+919466679107");
    else if (label === "Support") window.open("mailto:support@dummyhealthgroup.com");
    else setActivePage(label);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navGroups.map(({ group, items }) => (
          <div key={group}>
            {/* Group label */}
            <div style={{
              fontSize: "9px", fontWeight: "700", letterSpacing: "1px",
              color: "rgba(255,255,255,0.25)", padding: "10px 12px 4px",
              textTransform: "uppercase"
            }}>
              {group}
            </div>
            {items.map(({ icon: Icon, label }) => (
              <button key={label}
                className={`sidebar-item ${activePage === label ? "sidebar-item--active" : ""}`}
                onClick={() => setActivePage(label)}>
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* AI Advisor — special highlighted item */}
      <button
        className={`sidebar-item ${activePage === "AI Advisor" ? "sidebar-item--active" : ""}`}
        onClick={() => setActivePage("AI Advisor")}
        style={{
          background: activePage === "AI Advisor"
            ? "linear-gradient(90deg,rgba(79,195,247,0.25),rgba(21,101,192,0.25))"
            : "linear-gradient(90deg,rgba(79,195,247,0.08),rgba(21,101,192,0.08))",
          border: "1px solid rgba(79,195,247,0.35)",
          borderRadius: "10px",
          margin: "8px 0",
          color: "#4FC3F7",
          fontWeight: "600",
        }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><circle cx="19" cy="5" r="3" fill="#4FC3F7"/>
        </svg>
        <span style={{ color: "#4FC3F7" }}>AI Advisor</span>
        <span style={{ marginLeft:"auto", fontSize:"9px", padding:"2px 6px",
          borderRadius:"10px", background:"rgba(79,195,247,0.2)",
          color:"#4FC3F7", border:"1px solid rgba(79,195,247,0.3)" }}>AI</span>
      </button>

      {/* Bottom icons */}
      <div className="sidebar-bottom">
        {bottomItems.map(({ icon: Icon, label, tooltip }) => (
          <div key={label} style={{ position: "relative" }}>
            <button
              className={`sidebar-item sidebar-item--bottom ${activePage === label ? "sidebar-item--active" : ""}`}
              title={tooltip}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleBottomClick(label)}>
              <Icon size={18} />
            </button>
            {hovered === label && (
              <div style={{
                position:"absolute", left:"52px", bottom:"0",
                background:"rgba(13,27,75,0.97)", border:"1px solid rgba(79,195,247,0.3)",
                borderRadius:"8px", padding:"8px 14px", whiteSpace:"nowrap",
                color:"#fff", fontSize:"12px", zIndex:1000, pointerEvents:"none",
                boxShadow:"0 4px 12px rgba(0,0,0,0.3)"
              }}>
                <div style={{ fontWeight:600, color:"#4FC3F7", marginBottom:"2px" }}>{label}</div>
                <div>{tooltip}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
