import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from "recharts";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const data = [
  { hospital: "City Hospital",          covid: 120, flu: 80, hepatitis: 200, measles: 260, tetanus: 150 },
  { hospital: "Green Valley Medical",   covid: 200, flu: 160, hepatitis: 130, measles: 90,  tetanus: 110 },
  { hospital: "Heartland Medical Hub",  covid: 280, flu: 190, hepatitis: 240, measles: 170, tetanus: 200 },
  { hospital: "Central Health Medical", covid: 160, flu: 110, hepatitis: 180, measles: 220, tetanus: 140 },
  { hospital: "Metro Care Clinic",      covid: 220, flu: 140, hepatitis: 160, measles: 100, tetanus: 310 },
];

const VACCINES = [
  { key: "covid",     label: "COVID-19 Vaccine",  color: "#4FC3F7" },
  { key: "flu",       label: "Flu Vaccine",        color: "#1565C0" },
  { key: "hepatitis", label: "Hepatitis B Vaccine",color: "#26A69A" },
  { key: "measles",   label: "Measles Vaccine",    color: "#FFA726" },
  { key: "tetanus",   label: "Tetanus Vaccine",    color: "#EF5350" },
];

const trendData = data.map((d, i) => ({
  ...d,
  trend: 180 + i * 35,
}));

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

export default function PriceChart() {
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

      <div className="chart-trend-badge">+3.5%</div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={trendData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
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
          {VACCINES.map(({ key, color }) => (
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
        {VACCINES.map(({ key, label, color }) => (
          <span key={key} className="chart-legend-item">
            <span className="chart-legend-dot" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
