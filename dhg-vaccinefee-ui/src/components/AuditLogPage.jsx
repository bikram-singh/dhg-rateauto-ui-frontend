import { useState, useEffect, useMemo } from "react";
import { theme } from "../theme";
import { Download, RefreshCw } from "lucide-react";

const ACTION_COLORS = {
  CREATE: { bg:"rgba(34,197,94,0.12)", color:"#4ADE80", border:"rgba(34,197,94,0.25)" },
  UPDATE: { bg:"rgba(79,195,247,0.12)", color:"#4FC3F7", border:"rgba(79,195,247,0.25)" },
  DELETE: { bg:"rgba(239,68,68,0.12)", color:"#F87171", border:"rgba(239,68,68,0.25)" },
  LOGIN:  { bg:"rgba(245,158,11,0.12)", color:"#FCD34D", border:"rgba(245,158,11,0.25)" },
  LOGOUT: { bg:"rgba(148,163,184,0.12)", color:"rgba(255,255,255,0.5)", border:"rgba(148,163,184,0.2)" },
  VIEW:   { bg:"rgba(139,92,246,0.12)", color:"#A78BFA", border:"rgba(139,92,246,0.25)" },
};

// Generate realistic audit log from localStorage
const getStoredLogs = () => {
  try {
    return JSON.parse(localStorage.getItem("dhg_audit_log") || "[]");
  } catch { return []; }
};

const storeLogs = (logs) => {
  localStorage.setItem("dhg_audit_log", JSON.stringify(logs.slice(0, 500)));
};

export const logAction = (action, resource, details, user = "bikram") => {
  const logs = getStoredLogs();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    user,
    action,
    resource,
    details,
    ip: "192.168.1.x",
  };
  storeLogs([entry, ...logs]);
};

export default function AuditLogPage({ currentUser, darkMode = true }) {
  const t = theme(darkMode);
  const [logs, setLogs]           = useState([]);
  const [filterAction, setFilter] = useState("All");
  const [filterUser, setFilterUser] = useState("All");
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const pageSize = 20;

  const loadLogs = () => {
    const stored = getStoredLogs();
    // Add some realistic demo logs if empty
    if (stored.length === 0) {
      const demoLogs = [
        { id:1, timestamp: new Date(Date.now()-1000*60*2).toISOString(),   user:"bikram", action:"LOGIN",  resource:"Dashboard",   details:"Login successful", ip:"103.21.58.x" },
        { id:2, timestamp: new Date(Date.now()-1000*60*5).toISOString(),   user:"bikram", action:"VIEW",   resource:"Pricing",     details:"Viewed 5,439 pricing records", ip:"103.21.58.x" },
        { id:3, timestamp: new Date(Date.now()-1000*60*8).toISOString(),   user:"bikram", action:"VIEW",   resource:"AI Advisor",  details:"Asked: vaccine recommendations for 65+", ip:"103.21.58.x" },
        { id:4, timestamp: new Date(Date.now()-1000*60*15).toISOString(),  user:"viewer", action:"LOGIN",  resource:"Dashboard",   details:"Login successful", ip:"202.54.1.x" },
        { id:5, timestamp: new Date(Date.now()-1000*60*20).toISOString(),  user:"bikram", action:"CREATE", resource:"User",        details:"Created user: viewer (Viewer role)", ip:"103.21.58.x" },
        { id:6, timestamp: new Date(Date.now()-1000*60*35).toISOString(),  user:"bikram", action:"VIEW",   resource:"Admin Panel", details:"Viewed vaccine records", ip:"103.21.58.x" },
        { id:7, timestamp: new Date(Date.now()-1000*60*60).toISOString(),  user:"bikram", action:"CREATE", resource:"User",        details:"Created user: bikram (Admin role)", ip:"103.21.58.x" },
        { id:8, timestamp: new Date(Date.now()-1000*60*90).toISOString(),  user:"bikram", action:"VIEW",   resource:"Reports",     details:"Exported PDF report", ip:"103.21.58.x" },
        { id:9, timestamp: new Date(Date.now()-1000*60*120).toISOString(), user:"bikram", action:"VIEW",   resource:"Hospital Map","details":"Filtered by: New Delhi", ip:"103.21.58.x" },
        { id:10,timestamp: new Date(Date.now()-1000*60*180).toISOString(), user:"bikram", action:"LOGIN",  resource:"Dashboard",   details:"Login successful", ip:"103.21.58.x" },
      ];
      storeLogs(demoLogs);
      setLogs(demoLogs);
    } else {
      setLogs(stored);
    }
  };

  useEffect(() => {
    loadLogs();
    // Log this page view
    logAction("VIEW", "Audit Log", "Viewed audit log", currentUser?.username || "bikram");
  }, []);

  const actions  = ["All", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "VIEW"];
  const users    = ["All", ...new Set(logs.map((l) => l.user))];

  const filtered = useMemo(() => logs.filter((l) => {
    if (filterAction !== "All" && l.action !== filterAction) return false;
    if (filterUser !== "All" && l.user !== filterUser) return false;
    if (search && !`${l.user} ${l.action} ${l.resource} ${l.details}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [logs, filterAction, filterUser, search]);

  const paginated   = filtered.slice((page-1)*pageSize, page*pageSize);
  const totalPages  = Math.max(1, Math.ceil(filtered.length/pageSize));

  const exportCSV = () => {
    const rows = [
      ["Timestamp","User","Action","Resource","Details","IP"],
      ...filtered.map((l) => [l.timestamp, l.user, l.action, l.resource, `"${l.details}"`, l.ip])
    ];
    const blob = new Blob([rows.map((r)=>r.join(",")).join("\n")], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download="dhg-audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return d.toLocaleDateString("en-IN");
  };

  // Summary counts
  const counts = useMemo(() => {
    const c = {};
    logs.forEach((l) => { c[l.action] = (c[l.action]||0) + 1; });
    return c;
  }, [logs]);

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color: t.text, fontSize:"20px", fontWeight:"700" }}>Audit Log</h2>
          <p style={{ color: t.textSec, fontSize:"13px" }}>
            Track all user actions and system events
          </p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={loadLogs} style={{ display:"flex", alignItems:"center", gap:"5px",
            padding:"8px 14px", borderRadius:"8px", fontSize:"13px", cursor:"pointer",
            background: t.card, border:"1px solid rgba(255,255,255,0.15)",
            color: t.text }}>
            <RefreshCw size={14}/> Refresh
          </button>
          <button onClick={exportCSV} style={{ display:"flex", alignItems:"center", gap:"6px",
            padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
            background:"rgba(79,195,247,0.15)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7" }}>
            <Download size={15}/> Export CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"10px", marginBottom:"20px" }}>
        {Object.entries(ACTION_COLORS).map(([action, style]) => (
          <div key={action} style={{ background:style.bg, border:`1px solid ${style.border}`,
            borderRadius:"10px", padding:"12px 14px", textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:"700", color:style.color }}>{counts[action]||0}</div>
            <div style={{ fontSize:"11px", color: t.textSec, marginTop:"2px" }}>{action}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"16px", flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1, minWidth:"180px" }}>
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search logs..."
            style={{ width:"100%", padding:"8px 12px", background: t.input,
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color: t.text,
              fontSize:"13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
        </div>
        <select value={filterAction} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          style={{ padding:"8px 12px", background: t.input,
            border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color: t.text,
            fontSize:"13px", fontFamily:"inherit" }}>
          {actions.map((a) => <option key={a} value={a} style={{ background:"#0D1B4B" }}>{a}</option>)}
        </select>
        <select value={filterUser} onChange={(e) => { setFilterUser(e.target.value); setPage(1); }}
          style={{ padding:"8px 12px", background: t.input,
            border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color: t.text,
            fontSize:"13px", fontFamily:"inherit" }}>
          {users.map((u) => <option key={u} value={u} style={{ background:"#0D1B4B" }}>{u}</option>)}
        </select>
        <span style={{ fontSize:"12px", color: t.textMuted }}>{filtered.length} entries</span>
      </div>

      {/* Log table */}
      <div style={{ background: t.card, border:"1px solid rgba(255,255,255,0.1)",
        borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background: t.cardAlt, borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                {["Time","User","Action","Resource","Details","IP"].map((h) => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px",
                    fontWeight:"600", color: t.textSec, textTransform:"uppercase", letterSpacing:"0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:"30px", textAlign:"center", color: t.textMuted }}>No logs found</td></tr>
              ) : paginated.map((log) => {
                const ac = ACTION_COLORS[log.action] || ACTION_COLORS.VIEW;
                return (
                  <tr key={log.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"10px 14px", color: t.textSec, whiteSpace:"nowrap", fontSize:"11px" }}>
                      {formatTime(log.timestamp)}
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:"5px",
                        color: t.text, fontWeight:"500" }}>
                        <span style={{ width:"24px", height:"24px", borderRadius:"6px",
                          background:"linear-gradient(135deg,#4FC3F7,#1565C0)",
                          display:"inline-flex", alignItems:"center", justifyContent:"center",
                          fontSize:"10px", fontWeight:"700", color: t.text, flexShrink:0 }}>
                          {log.user.substring(0,2).toUpperCase()}
                        </span>
                        {log.user}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px" }}>
                      <span style={{ fontSize:"11px", fontWeight:"600", padding:"3px 10px",
                        borderRadius:"20px", background:ac.bg, color:ac.color, border:`1px solid ${ac.border}` }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding:"10px 14px", color: t.text, fontWeight:"500" }}>
                      {log.resource}
                    </td>
                    <td style={{ padding:"10px 14px", color: t.textSec, maxWidth:"280px",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {log.details}
                    </td>
                    <td style={{ padding:"10px 14px", color: t.textMuted, fontSize:"11px", fontFamily:"monospace" }}>
                      {log.ip}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 16px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize:"12px", color: t.textMuted }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display:"flex", gap:"4px" }}>
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{ padding:"5px 12px", borderRadius:"6px", fontSize:"12px", cursor:"pointer",
                background: t.card, border:"1px solid rgba(255,255,255,0.15)",
                color: page===1?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)" }}>Previous</button>
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{ padding:"5px 12px", borderRadius:"6px", fontSize:"12px", cursor:"pointer",
                background: t.card, border:"1px solid rgba(255,255,255,0.15)",
                color: page===totalPages?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.7)" }}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
