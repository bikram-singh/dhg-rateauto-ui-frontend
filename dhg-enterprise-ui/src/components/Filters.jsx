export default function Filters() {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex gap-4">
      <select className="p-2 border rounded">
        <option>All Departments</option>
      </select>
      <select className="p-2 border rounded">
        <option>All Vaccines</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
}