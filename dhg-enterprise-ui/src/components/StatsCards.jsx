import { Syringe, Hospital, TrendingUp, ToggleRight } from "lucide-react";
import { useState } from "react";

export default function StatsCards() {
  const [trendEnabled, setTrendEnabled] = useState(true);

  return (
    <div className="stats-row">
      <StatCard
        label="Total Vaccines"
        value="24"
        icon={<Syringe size={20} />}
        color="blue"
      />
      <StatCard
        label="Hospitals Covered"
        value="12"
        icon={<Hospital size={20} />}
        color="teal"
      />
      <StatCard
        label="Avg Price"
        value="₹250"
        icon={<TrendingUp size={20} />}
        color="indigo"
        extra={
          <div className="stat-slider-wrap">
            <input type="range" min={100} max={500} defaultValue={250} className="stat-slider" />
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
