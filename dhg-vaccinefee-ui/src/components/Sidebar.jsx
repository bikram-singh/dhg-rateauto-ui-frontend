import {
  LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2,
  CreditCard, MessageSquare, TrendingUp, Search, GitCompare,
  Pill, Trophy, Globe, Settings, Users, ClipboardList,
  CalendarCheck, LineChart, FileBarChart, Stethoscope, Sparkles
} from "lucide-react";
import { useState } from "react";

const navConfig = [
  {
    // Dashboard — standalone, no group label
    standalone: true,
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    group: "Hospitals",
    icon: Building,
    color: "#4FC3F7",
    children: [
      { icon: Building2,    label: "Departments" },
      { icon: Stethoscope,  label: "Hospital Profiles" },
      { icon: Trophy,       label: "Rankings" },
      { icon: GitCompare,   label: "Compare" },
    ],
  },
  {
    group: "Vaccines",
    icon: Pill,
    color: "#66BB6A",
    children: [
      { icon: Search,       label: "Vaccine Search" },
      { icon: Pill,         label: "Vaccine Details" },
      { icon: CreditCard,   label: "Vaccine Card" },
      { icon: CalendarCheck,label: "Appointments" },
    ],
  },
  {
    group: "Pricing",
    icon: DollarSign,
    color: "#FFA726",
    children: [
      { icon: DollarSign,   label: "Pricing" },
      { icon: TrendingUp,   label: "Price History" },
      { icon: LineChart,    label: "Price Prediction" },
    ],
  },
  {
    group: "Analytics",
    icon: BarChart2,
    color: "#AB47BC",
    children: [
      { icon: Globe,        label: "City Analytics" },
      { icon: BarChart2,    label: "Advanced Reports" },
      { icon: FileBarChart, label: "Reports" },
    ],
  },
  {
    group: "Admin",
    icon: Settings,
    color: "#EF5350",
    children: [
      { icon: Settings,     label: "Admin Panel" },
      { icon: Users,        label: "User Management" },
      { icon: ClipboardList,label: "Audit Log" },
    ],
  },
];

const bottomItems = [
  { icon: Phone,         label: "Contact", tooltip: "+91-9466679107" },
  { icon: MessageSquare, label: "Support",  tooltip: "support@dummyhealthgroup.com" },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [hovered, setHovered] = useState(null);

  // Auto-expand group that contains active page
  const activeGroup = navConfig.find(
    (n) => !n.standalone && n.children?.some((c) => c.label === activePage)
  )?.group || null;

  const [expanded, setExpanded] = useState(() => activeGroup);

  const toggleGroup = (group) => {
    setExpanded((prev) => prev === group ? null : group);
  };

  const handleBottomClick = (label) => {
    if (label === "Contact") window.open("tel:+919466679107");
    else if (label === "Support") window.open("mailto:support@dummyhealthgroup.com");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navConfig.map((item) => {
          // Standalone item (Dashboard)
          if (item.standalone) {
            const Icon = item.icon;
            const isActive = activePage === item.label;
            return (
              <button key={item.label}
                className={`sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
                onClick={() => setActivePage(item.label)}>
                <Icon size={17}/>
                <span>{item.label}</span>
              </button>
            );
          }

          // Group with children
          const isOpen      = expanded === item.group;
          const GroupIcon   = item.icon;
          const hasActive   = item.children.some((c) => c.label === activePage);

          return (
            <div key={item.group}>
              {/* Group header button — styled like a mini card */}
              <button
                onClick={() => toggleGroup(item.group)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: "10px", padding: "8px 12px", border: "none",
                  borderRadius: "9px", cursor: "pointer", marginBottom: "2px",
                  background: hasActive
                    ? `${item.color}18`
                    : isOpen ? "rgba(255,255,255,0.07)" : "transparent",
                  borderLeft: hasActive ? `3px solid ${item.color}` : "3px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { if (!hasActive) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={(e) => { if (!hasActive) e.currentTarget.style.background = isOpen ? "rgba(255,255,255,0.07)" : "transparent"; }}
              >
                {/* Icon box — same style as Dashboard icon */}
                <div style={{
                  width: "28px", height: "28px", borderRadius: "7px", flexShrink: 0,
                  background: hasActive || isOpen ? `${item.color}25` : "rgba(255,255,255,0.08)",
                  border: `1px solid ${hasActive || isOpen ? item.color + "50" : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  <GroupIcon size={15} style={{ color: hasActive || isOpen ? item.color : "rgba(255,255,255,0.5)" }}/>
                </div>

                <span style={{
                  fontSize: "13px", fontWeight: "600", flex: 1, textAlign: "left",
                  color: hasActive ? item.color : isOpen ? "#fff" : "rgba(255,255,255,0.7)",
                }}>
                  {item.group}
                </span>

                {/* Chevron */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke={hasActive ? item.color : "rgba(255,255,255,0.3)"}
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>

              {/* Children — collapsible */}
              {isOpen && (
                <div style={{ marginLeft: "14px", marginBottom: "4px",
                  borderLeft: `1px solid rgba(255,255,255,0.08)`, paddingLeft: "8px" }}>
                  {item.children.map(({ icon: ChildIcon, label }) => {
                    const isActive = activePage === label;
                    return (
                      <button key={label}
                        onClick={() => setActivePage(label)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center",
                          gap: "8px", padding: "6px 10px", border: "none",
                          borderRadius: "7px", cursor: "pointer", marginBottom: "1px",
                          background: isActive ? `${item.color}20` : "transparent",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                      >
                        <ChildIcon size={14} style={{ color: isActive ? item.color : "rgba(255,255,255,0.45)", flexShrink: 0 }}/>
                        <span style={{
                          fontSize: "12px", fontWeight: isActive ? "600" : "400",
                          color: isActive ? item.color : "rgba(255,255,255,0.65)",
                        }}>
                          {label}
                        </span>
                        {isActive && (
                          <div style={{ marginLeft: "auto", width: "5px", height: "5px",
                            borderRadius: "50%", background: item.color, flexShrink: 0 }}/>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* AI Advisor — special highlighted */}
      <button
        className={`sidebar-item ${activePage === "AI Advisor" ? "sidebar-item--active" : ""}`}
        onClick={() => setActivePage("AI Advisor")}
        style={{
          background: activePage === "AI Advisor"
            ? "linear-gradient(90deg,rgba(79,195,247,0.2),rgba(21,101,192,0.2))"
            : "linear-gradient(90deg,rgba(79,195,247,0.06),rgba(21,101,192,0.06))",
          border: "1px solid rgba(79,195,247,0.3)",
          borderRadius: "10px", margin: "8px 0",
        }}>
        <div style={{ width:"28px", height:"28px", borderRadius:"7px", flexShrink:0,
          background:"rgba(79,195,247,0.2)", border:"1px solid rgba(79,195,247,0.4)",
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Sparkles size={14} style={{ color:"#4FC3F7" }}/>
        </div>
        <span style={{ color:"#4FC3F7", fontWeight:"600", fontSize:"13px" }}>AI Advisor</span>
        <span style={{ marginLeft:"auto", fontSize:"9px", padding:"2px 6px",
          borderRadius:"10px", background:"rgba(79,195,247,0.2)",
          color:"#4FC3F7", border:"1px solid rgba(79,195,247,0.3)" }}>AI</span>
      </button>

      {/* Bottom icons */}
      <div className="sidebar-bottom">
        {bottomItems.map(({ icon: Icon, label, tooltip }) => (
          <div key={label} style={{ position:"relative" }}>
            <button
              className="sidebar-item sidebar-item--bottom"
              title={tooltip}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleBottomClick(label)}>
              <Icon size={18}/>
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