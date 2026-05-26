export default function StatsCards() {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-label">Total Vaccines</span>
        <span className="stat-value">128</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Hospitals Covered</span>
        <span className="stat-value">64</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Average Price</span>
        <span className="stat-value">₹2400</span>
      </div>
    </div>
  );
}
