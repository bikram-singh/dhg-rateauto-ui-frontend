import { useMemo } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const VACCINE_COLORS = [
  "#4FC3F7", "#1565C0", "#26A69A", "#FFA726", "#EF5350",
  "#AB47BC", "#66BB6A", "#FF7043", "#42A5F5", "#EC407A",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: ₹{p.value}
        </p>
      ))}
    </div>
  );
};

export default function PriceChart({ pricing = [], vaccines = [], hospitals = [] }) {
  const vaccineMap  = useMemo(() => Object.fromEntries(vaccines.map((v) => [v.id, v.name])), [vaccines]);
  const hospitalMap = useMemo(() => Object.fromEntries(hospitals.map((h) => [h.id, h.name])), [hospitals]);

  // Build chart data: group by hospital, with each vaccine as a key
  const { chartData, vaccineKeys } = useMemo(() => {
    if (!pricing.length) return { chartData: [], vaccineKeys: [] };

    const vaccineSet = new Set();
    const byHospital = {};

    pricing.forEach((p) => {
      const hospitalName = hospitalMap[p.hospital_id] || p.hospital?.name || `Hospital ${p.hospital_id}`;
      const vaccineName  = vaccineMap[p.vaccine_id]  || p.vaccine?.name  || `Vaccine ${p.vaccine_id}`;
      const safeKey      = vaccineName.replace(/[^a-zA-Z0-9]/g, "_");

      vaccineSet.add(safeKey);
      if (!byHospital[hospitalName]) byHospital[hospitalName] = { hospital: hospitalName };
      byHospital[hospitalName][safeKey] = parseFloat(p.price || 0);
    });

    const chartData = Object.values(byHospital);
    const vaccineKeys = [...vaccineSet].slice(0, 10); // max 10 vaccines

    // Add trend line
    chartData.forEach((d, i) => {
      const vals = vaccineKeys.map((k) => d[k] || 0).filter(Boolean);
      d.trend = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) + i * 20 : 0;
    });

    return { chartData, vaccineKeys };
  }, [pricing, vaccineMap, hospitalMap]);

  // Build legend from vaccine names
  const legendItems = useMemo(() =>
    vaccineKeys.map((key, i) => ({
      key,
      label: key.replace(/_/g, " "),
      color: VACCINE_COLORS[i % VACCINE_COLORS.length],
    })),
    [vaccineKeys]
  );

  if (!chartData.length) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Price Comparison by Vaccine</h2>
        </div>
        <div style={{ textAlign: "center", padding: "4rem", opacity: 0.5 }}>No pricing data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Price Comparison by Vaccine</h2>
        <div className="chart-controls">
          <div className="chart-filter-select">
            <span className="chart-dot" />
            All Vaccines
            <ChevronDown size={14} />
          </div>
          <button className="chart-nav-btn"><ChevronLeft size={16} /></button>
          <button className="chart-nav-btn"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div className="chart-trend-badge">Live Data</div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="hospital"
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          {legendItems.map(({ key, color }) => (
            <Bar key={key} dataKey={key} fill={color} radius={[3, 3, 0, 0]} maxBarSize={16} />
          ))}
          <Line
            type="monotone"
            dataKey="trend"
            stroke="#4FC3F7"
            strokeWidth={2}
            dot={{ fill: "#4FC3F7", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="chart-legend">
        {legendItems.map(({ key, label, color }) => (
          <span key={key} className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
