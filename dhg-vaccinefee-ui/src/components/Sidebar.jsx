import {
  LayoutDashboard, Building2, Building, DollarSign, Phone, BarChart2,
  CreditCard, MessageSquare, TrendingUp, Search, GitCompare,
  Pill, Trophy, Globe, Settings, Users, ClipboardList,
  CalendarCheck, LineChart, FileBarChart, Stethoscope, Sparkles
} from "lucide-react";
import { useState } from "react";

const navConfig = [
  {
    standalone: true,
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "#4FC3F7",
  },
  {
    group: "Hospitals",
    icon: Building,
    color: "#29B6F6",
    children: [
      { icon: Building2,     label: "Departments" },
      { icon: Stethoscope,   label: "Hospital Profiles" },
      { icon: Trophy,        label: "Rankings" },
      { icon: GitCompare,    label: "Compare" },
    ],
  },
  {
    group: "Vaccines",
    icon: Pill,
    color: "#66BB6A",
    children: [
      { icon: Search,        label: "Vaccine Search" },
      { icon: Pill,          label: "Vaccine Details" },
      { icon: CreditCard,    label: "Vaccine Card" },
      { icon: CalendarCheck, label: "Appointments" },
    ],
  },
  {
    group: "Pricing",
    icon: DollarSign,
    color: "#FFA726",
    children: [
      { icon: DollarSign,    label: "Pricing" },
      { icon: TrendingUp,    label: "Price History" },
      { icon: LineChart,     label: "Price Prediction" },
    ],
  },
  {
    group: "Analytics",
    icon: BarChart2,
    color: "#AB47BC",
    children: [
      { icon: Globe,         label: "City Analytics" },
      { icon: BarChart2,     label: "Advanced Reports" },
      { icon: FileBarChart,  label: "Reports" },
    ],
  },
  {
    group: "Admin",
    icon: Settings,
    color: "#EF5350",
    children: [
      { icon: Settings,      label: "Admin Panel" },
      { icon: Users,         label: "User Management" },
      { icon: ClipboardList, label: "Audit Log" },
    ],
  },
];

const bottomItems = [
  { icon: Phone,         label: "Contact", tooltip: "+91-9466679107" },
  { icon: MessageSquare, label: "Support",  tooltip: "support@dummyhealthgroup.com" },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [hovered, setHovered] = useState(null);

  const handleBottomClick = (label) => {
    if (label === "Contact") window.open("tel:+919466679107");
    else if (label === "Support") window.open("mailto:support@dummyhealthgroup.com");
  };

  const isGroupActive = (item) =>
    item.children?.some((c) => c.label === activePage);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navConfig.map((item) => {

          /* ── Standalone item (Dashboard) ── */
          if (item.standalone) {
            const Icon     = item.icon;
            const isActive = activePage === item.label;
            return (
              <button key={item.label}
                onClick={() => setActivePage(item.label)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: "10px", padding: "7px 10px", border: "none",
                  borderRadius: "10px", cursor: "pointer", marginBottom: "6px",
                  background: isActive
                    ? `linear-gradient(90deg, ${item.color}28, ${item.color}10)`
                    : "transparent",
                  borderLeft: isActive ? `3px solid ${item.color}` : "3px solid transparent",
                }}>
                {/* Icon box — same style for all headers */}
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                  background: isActive ? `${item.color}25` : "rgba(255,255,255,0.08)",
                  border: `1px solid ${isActive ? item.color + "60" : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={15} style={{ color: isActive ? item.color : "rgba(255,255,255,0.55)" }}/>
                </div>
                <span style={{
                  fontSize: "13px", fontWeight: "600",
                  color: isActive ? item.color : "rgba(255,255,255,0.8)",
                }}>
                  {item.label}
                </span>
              </button>
            );
          }

          /* ── Group with always-visible children ── */
          const GroupIcon    = item.icon;
          const groupActive  = isGroupActive(item);

          return (
            <div key={item.group} style={{ marginBottom: "4px" }}>

              {/* Group header — highlighted like Dashboard */}
              <button
                onClick={() => setActivePage(item.children[0].label)}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: "10px", padding: "7px 10px", border: "none",
                  borderRadius: "10px", cursor: "pointer", marginBottom: "2px",
                  background: groupActive
                    ? `linear-gradient(90deg, ${item.color}28, ${item.color}10)`
                    : "rgba(255,255,255,0.04)",
                  borderLeft: groupActive ? `3px solid ${item.color}` : "3px solid transparent",
                }}>
                {/* Icon box — matching Dashboard style */}
                <div style={{
                  width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
                  background: groupActive ? `${item.color}25` : "rgba(255,255,255,0.08)",
                  border: `1px solid ${groupActive ? item.color + "60" : "rgba(255,255,255,0.12)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <GroupIcon size={15} style={{ color: groupActive ? item.color : "rgba(255,255,255,0.55)" }}/>
                </div>
                <span style={{
                  fontSize: "13px", fontWeight: "700",
                  color: groupActive ? item.color : "rgba(255,255,255,0.85)",
                  letterSpacing: "0.1px",
                }}>
                  {item.group}
                </span>
              </button>

              {/* Sub-items — always visible, indented */}
              <div style={{
                marginLeft: "18px",
                paddingLeft: "10px",
                borderLeft: `1px solid rgba(255,255,255,0.07)`,
              }}>
                {item.children.map(({ icon: ChildIcon, label }) => {
                  const isActive = activePage === label;
                  return (
                    <button key={label}
                      onClick={() => setActivePage(label)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center",
                        gap: "8px", padding: "6px 8px", border: "none",
                        borderRadius: "7px", cursor: "pointer", marginBottom: "1px",
                        background: isActive ? `${item.color}18` : "transparent",
                        borderLeft: isActive ? `2px solid ${item.color}` : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <ChildIcon size={13} style={{
                        color: isActive ? item.color : "rgba(255,255,255,0.4)",
                        flexShrink: 0,
                      }}/>
                      <span style={{
                        fontSize: "12px",
                        fontWeight: isActive ? "600" : "400",
                        color: isActive ? item.color : "rgba(255,255,255,0.6)",
                      }}>
                        {label}
                      </span>
                      {isActive && (
                        <div style={{
                          marginLeft: "auto", width: "5px", height: "5px",
                          borderRadius: "50%", background: item.color, flexShrink: 0,
                        }}/>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* AI Advisor — always visible special item */}
      <button
        onClick={() => setActivePage("AI Advisor")}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          gap: "10px", padding: "7px 10px", border: "none",
          borderRadius: "10px", cursor: "pointer", margin: "6px 0",
          background: activePage === "AI Advisor"
            ? "linear-gradient(90deg,rgba(79,195,247,0.25),rgba(21,101,192,0.15))"
            : "linear-gradient(90deg,rgba(79,195,247,0.08),rgba(21,101,192,0.04))",
          borderLeft: activePage === "AI Advisor"
            ? "3px solid #4FC3F7" : "3px solid rgba(79,195,247,0.3)",
          boxShadow: activePage === "AI Advisor" ? "0 2px 8px rgba(79,195,247,0.15)" : "none",
        }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
          background: "rgba(79,195,247,0.2)", border: "1px solid rgba(79,195,247,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={15} style={{ color: "#4FC3F7" }}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#4FC3F7", lineHeight: 1.2 }}>
            AI Advisor
          </span>
          <span style={{ fontSize: "9px", fontWeight: "500", color: "#4ADE80", letterSpacing: "0.2px", lineHeight: 1 }}>
            Voice & Chat Enabled
          </span>
        </div>
        <span style={{
          marginLeft: "auto", fontSize: "9px", padding: "2px 7px",
          borderRadius: "10px", background: "rgba(79,195,247,0.2)",
          color: "#4FC3F7", border: "1px solid rgba(79,195,247,0.35)",
          fontWeight: "700", letterSpacing: "0.5px",
        }}>AI</span>
      </button>

      {/* Bottom icons */}
      <div className="sidebar-bottom">
        {bottomItems.map(({ icon: Icon, label, tooltip }) => (
          <div key={label} style={{ position: "relative" }}>
            <button
              className="sidebar-item sidebar-item--bottom"
              title={tooltip}
              onMouseEnter={() => setHovered(label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleBottomClick(label)}>
              <Icon size={18}/>
            </button>
            {hovered === label && (
              <div style={{
                position: "absolute", left: "52px", bottom: "0",
                background: "rgba(13,27,75,0.97)",
                border: "1px solid rgba(79,195,247,0.3)",
                borderRadius: "8px", padding: "8px 14px", whiteSpace: "nowrap",
                color: "#fff", fontSize: "12px", zIndex: 1000, pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
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