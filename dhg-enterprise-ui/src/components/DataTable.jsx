const vaccines = [
  { name: "COVID-19", price: 120 },
  { name: "Flu", price: 30 }
];

export default function DataTable() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b">
            <th>Vaccine</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((v, i) => (
            <tr key={i} className="border-b">
              <td>{v.name}</td>
              <td>₹{v.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}