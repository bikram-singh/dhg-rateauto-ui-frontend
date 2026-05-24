import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "COVID", price: 120 },
  { name: "Flu", price: 30 },
  { name: "Hepatitis", price: 45 }
];

export default function PriceChart() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-2 font-bold">Price Comparison</h2>
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="price" />
      </BarChart>
    </div>
  );
}