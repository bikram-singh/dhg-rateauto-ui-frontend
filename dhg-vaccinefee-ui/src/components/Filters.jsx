import { ChevronDown, Search, Building2, Activity, Building, MapPin } from "lucide-react";
import { useState } from "react";

export default function Filters() {
  const [priceRange, setPriceRange] = useState([100, 3000]);
  const [priceEnabled, setPriceEnabled] = useState(true);

  return (
    <div className="filters">
      <div className="filter-select-group">
        <FilterSelect icon={<Building2 size={15}/>} label="All Departments" />
        <FilterSelect icon={<Activity size={15}/>} label="All Vaccines" />
        <FilterSelect icon={<Building size={15}/>} label="All Facilities" />
        <FilterSelect icon={<MapPin size={15}/>} label="All Locations" />
      </div>

      <div className="filter-price">
        <span className="filter-price-label">
          ₹{priceRange[0]} – ₹{priceRange[1].toLocaleString()}
        </span>
        <input
          type="range"
          min="100"
          max="5000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="filter-price-slider"
        />
        <button
          className={`filter-toggle ${priceEnabled ? "filter-toggle--on" : ""}`}
          onClick={() => setPriceEnabled(!priceEnabled)}
          aria-label="Toggle price filter"
        >
          <span className="filter-toggle-knob" />
        </button>
      </div>

      <button className="filter-search-btn">
        <Search size={15} />
        Search
      </button>
    </div>
  );
}

function FilterSelect({ icon, label }) {
  return (
    <div className="filter-select">
      <span className="filter-select-icon">{icon}</span>
      <select defaultValue="">
        <option value="" disabled>{label}</option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      <ChevronDown size={14} className="filter-select-chevron" />
    </div>
  );
}
