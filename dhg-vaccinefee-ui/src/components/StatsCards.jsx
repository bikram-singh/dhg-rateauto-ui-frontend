import { Activity, Building, TrendingUp } from "lucide-react";
import { useState, useMemo } from "react";

export default function StatsCards({ vaccines = [], hospitals = [], pricing = [] }) {
  const [trendEnabled, setTrendEnabled] = useState(true);

  const avgPrice = useMemo(() => {
    if (!pricing.length) return 0;
    const total = pricing.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);
    return Math.round(total / pricing.length);
  }, [pricing]);

  const [sliderVal, setSliderVal] = useState(avgPrice || 250);

  return (
    <div className="stats-row">
      <StatCard
        label="Total Vaccines"
        value={vaccines.length || "—"}
        icon={<Activity size={20} />}
        color="blue"
      />
      <StatCard
        label="Hospitals Covered"
        value={hospitals.length || "—"}
        icon={<Building size={20} />}
        color="teal"
      />
      <StatCard
        label="Avg Price"
        value={`₹${avgPrice || sliderVal}`}
        icon={<TrendingUp size={20} />}
        color="indigo"
        extra={
          <div className="stat-slider-wrap">
            <input
              type="range"
              min={100}
              max={5000}
              value={avgPrice || sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="stat-slider"
              readOnly={!!avgPrice}
            />
          </div>
        }
      />
      <div className="stat-card stat-card--trend">
        <span className="stat-label">Price Trend</span>
        <button
          className={`stat-toggle ${trendEnabled ? "stat-toggle--on" : ""}`}
          onClick={() => setTrendEnabled(!trendEnabled)}
          aria-label="Toggle price trend"
        >
          <span className="stat-toggle-knob" />
        </button>
        <button className="stat-search-btn">
          <span>🔍</span> Search
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, extra }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {extra}
    </div>
  );
}
