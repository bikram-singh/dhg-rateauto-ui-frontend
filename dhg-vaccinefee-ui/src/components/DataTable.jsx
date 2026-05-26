export default function DataTable() {
  return (
    <div className="table-card">
      <table className="data-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Vaccine</th>
            <th>Hospital</th>
            <th>Location</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Cardiology</td>
            <td>Covid Shield</td>
            <td>Max Hospital</td>
            <td>Delhi</td>
            <td>₹1200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
