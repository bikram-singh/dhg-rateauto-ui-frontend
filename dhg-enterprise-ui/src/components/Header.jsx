export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="DHG" className="w-12" />
        <div>
          <h1 className="text-xl font-bold">Dummy Health Group</h1>
          <p className="text-sm">Caring for Every Life</p>
        </div>
      </div>
      <input
        placeholder="Search vaccines..."
        className="px-4 py-2 rounded-lg text-black w-80"
      />
    </div>
  );
}