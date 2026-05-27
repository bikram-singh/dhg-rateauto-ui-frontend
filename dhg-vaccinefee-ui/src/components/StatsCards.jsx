import { RefreshCw } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";

export default function StatsCards({ vaccines = [], hospitals = [], pricing = [], onRefresh }) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [countdown, setCountdown]     = useState(30);
  const [refreshing, setRefreshing]   = useState(false);

  const avgPrice = useMemo(() => {
    if (!pricing.length) return 0;
    return Math.round(pricing.reduce((s, p) => s + parseFloat(p.price || 0), 0) / pricing.length);
  }, [pricing]);

  const available    = pricing.filter((p) => p.status === "Available").length;
  const lowStock     = pricing.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStock   = pricing.filter((p) => p.stock_quantity === 0).length;

  // Auto-refresh every 30 seconds
  useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((c) => {
      if (c <= 1) {
        handleRefresh();
        return 30;
      }
      return c - 1;
    });
  }, 1000);
  return () => clearInterval(interval);
}, [handleRefresh]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setLastRefresh(new Date());
    setCountdown(30);
    setTimeout(() => setRefreshing(false), 800);
  }, [onRefresh]);

  return (
    <div>
      {/* Live KPI bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <span style={{ fontSize: "12px", color: "rgba(79,195,247,0.8)" }}>
            🔄 Auto-refresh in {countdown}s
          </span>
          {lowStock > 0 && (
            <span style={{ fontSize: "12px", color: "#FCD34D", fontWeight: "600" }}>
              ⚠️ {lowStock} low stock
            </span>
          )}
          {outOfStock > 0 && (
            <span style={{ fontSize: "12px", color: "#F87171", fontWeight: "600" }}>
              🚫 {outOfStock} out of stock
            </span>
          )}
        </div>
        <button onClick={handleRefresh} style={{
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(79,195,247,0.1)", border: "1px solid rgba(79,195,247,0.3)",
          color: "#4FC3F7", borderRadius: "8px", padding: "5px 12px",
          fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
        }}>
          <RefreshCw size={13} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }}/>
          Refresh
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-card--blue">
          <span className="stat-label">Total Vaccines</span>
          <span className="stat-value">{vaccines.length || "—"}</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            across {hospitals.length} hospitals
          </span>
        </div>

        <div className="stat-card stat-card--teal">
          <span className="stat-label">Hospitals Covered</span>
          <span className="stat-value">{hospitals.length || "—"}</span>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
            India + USA + International
          </span>
        </div>

        <div className="stat-card stat-card--indigo">
          <span className="stat-label">Avg Price</span>
          <span className="stat-value">₹{avgPrice || "—"}</span>
          <div className="stat-slider-wrap">
            <input type="range" min={100} max={5000} value={avgPrice || 250}
              className="stat-slider" readOnly/>
          </div>
        </div>

        <div className="stat-card stat-card--trend">
          <span className="stat-label">Availability</span>
          <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#4ADE80" }}>{available}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Available</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#FCD34D" }}>{lowStock}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Low Stock</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#F87171" }}>{outOfStock}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>Out of Stock</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
