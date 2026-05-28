import {
  LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2,
  CreditCard, MessageSquare, TrendingUp, Search, GitCompare, Map,
  Pill, Trophy, Bot, Calendar, CreditCard as CardIcon, Globe, Activity, Settings
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Building2,       label: "Departments" },
  { icon: Building,        label: "Hospitals" },
  { icon: DollarSign,      label: "Pricing" },
  { icon: TrendingUp,      label: "Price History" },
  { icon: Search,          label: "Vaccine Search" },
  { icon: GitCompare,      label: "Compare" },
  { icon: Map,             label: "Hospital Map" },
  { icon: Pill,            label: "Vaccine Details" },
  { icon: Trophy,          label: "Rankings" },
  { icon: Globe,           label: "City Analytics" },
  { icon: CardIcon,        label: "Vaccine Card" },
  { icon: Calendar,        label: "Vaccine Calendar" },
  { icon: Activity,          label: "Price Prediction" },
  { icon: BarChart2,         label: "Advanced Reports" },
  { icon: Settings,          label: "Admin Panel" },
];

const bottomItems = [
  { icon: Phone,         label: "Contact", tooltip: "+91-9466679107" },
  { icon: BarChart2,     label: "Reports", tooltip: "Reports" },
  { icon: CreditCard,    label: "Billing", tooltip: "Billing" },
  { icon: MessageSquare, label: "Support", tooltip: "support@dummyhealthgroup.com" },
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
        {navItems.map(({ icon: Icon, label }) => (
          <button key={label}
            className={`sidebar-item ${activePage === label ? "sidebar-item--active" : ""}`}
            onClick={() => setActivePage(label)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {/* AI Advisor — special highlighted item just above bottom icons */}
      <button
        className={`sidebar-item ${activePage === "AI Advisor" ? "sidebar-item--active" : ""}`}
        onClick={() => setActivePage("AI Advisor")}
        style={{
          background: activePage === "AI Advisor"
            ? "linear-gradient(90deg,rgba(79,195,247,0.25),rgba(21,101,192,0.25))"
            : "linear-gradient(90deg,rgba(79,195,247,0.08),rgba(21,101,192,0.08))",
          border: "1px solid rgba(79,195,247,0.35)",
          borderRadius: "10px",
          margin: "6px 0 8px",
          color: "#4FC3F7",
          fontWeight: "600",
        }}>
        <Bot size={18} style={{ color: "#4FC3F7" }}/>
        <span style={{ color: "#4FC3F7" }}>AI Advisor</span>
        <span style={{ marginLeft:"auto", fontSize:"9px", padding:"2px 6px",
          borderRadius:"10px", background:"rgba(79,195,247,0.2)",
          color:"#4FC3F7", border:"1px solid rgba(79,195,247,0.3)" }}>AI</span>
      </button>

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
              <div style={{ position:"absolute", left:"52px", bottom:"0",
                background:"rgba(13,27,75,0.97)", border:"1px solid rgba(79,195,247,0.3)",
                borderRadius:"8px", padding:"8px 14px", whiteSpace:"nowrap",
                color:"#fff", fontSize:"12px", zIndex:1000, pointerEvents:"none",
                boxShadow:"0 4px 12px rgba(0,0,0,0.3)" }}>
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
