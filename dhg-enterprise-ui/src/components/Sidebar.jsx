import { Home, Hospital, DollarSign } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-60 bg-blue-700 text-white p-4 space-y-4">
      <h2 className="text-lg font-bold">Menu</h2>
      <div className="space-y-2">
        <p className="flex items-center gap-2"><Home size={16}/> Dashboard</p>
        <p className="flex items-center gap-2"><Hospital size={16}/> Hospitals</p>
        <p className="flex items-center gap-2"><DollarSign size={16}/> Pricing</p>
      </div>
    </div>
  );
}