import { ChevronDown, Search, Building2, Activity, Building, MapPin } from "lucide-react";
import { useState } from "react";

export default function Filters({ departments = [], vaccines = [], hospitals = [], onSearch }) {
  const [selectedDept, setSelectedDept]         = useState("");
  const [selectedVaccine, setSelectedVaccine]   = useState("");
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange]             = useState([100, 5000]);
  const [priceEnabled, setPriceEnabled]         = useState(true);

  // Extract unique city names (first part before comma)
  const locations = [...new Set(
    hospitals
      .map((h) => h.location ? (() => {
      const city = h.location.split(",")[0].trim();
      if (city === "New Delhi") return "Delhi";
      return city;
    })() : null)
      .filter(Boolean)
  )].sort();

  const handleSearch = () => {
    onSearch({
      department:  selectedDept,
      vaccine:     selectedVaccine,
      facility:    selectedFacility,
      location:    selectedLocation,
      priceMin:    priceEnabled ? priceRange[0] : null,
      priceMax:    priceEnabled ? priceRange[1] : null,
    });
  };

  const handleReset = () => {
    setSelectedDept("");
    setSelectedVaccine("");
    setSelectedFacility("");
    setSelectedLocation("");
    setPriceRange([100, 5000]);
    onSearch({
      department: "", vaccine: "", facility: "", location: "", priceMin: null, priceMax: null
    });
  };

  const hasFilters = selectedDept || selectedVaccine || selectedFacility || selectedLocation;

  return (
    <div className="filters">
      <div className="filter-select-group">

        <div className="filter-select">
          <span className="filter-select-icon"><Building2 size={15}/></span>
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
          <ChevronDown size={14} className="filter-select-chevron" />
        </div>

        <div className="filter-select">
          <span className="filter-select-icon"><Activity size={15}/></span>
          <select value={selectedVaccine} onChange={(e) => setSelectedVaccine(e.target.value)}>
            <option value="">All Vaccines</option>
            {vaccines.map((v) => <option key={v.id} value={v.name}>{v.name}</option>)}
          </select>
          <ChevronDown size={14} className="filter-select-chevron" />
        </div>

        <div className="filter-select">
          <span className="filter-select-icon"><Building size={15}/></span>
          <select value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)}>
            <option value="">All Facilities</option>
            {hospitals.map((h) => <option key={h.id} value={h.name}>{h.name}</option>)}
          </select>
          <ChevronDown size={14} className="filter-select-chevron" />
        </div>

        <div className="filter-select">
          <span className="filter-select-icon"><MapPin size={15}/></span>
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <ChevronDown size={14} className="filter-select-chevron" />
        </div>

      </div>

      <div className="filter-price">
        <span className="filter-price-label">
          ₹{priceRange[0]} – ₹{priceRange[1].toLocaleString()}
        </span>
        <input
          type="range"
          min="0"
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

      <button className="filter-search-btn" onClick={handleSearch}>
        <Search size={15} />
        Search
      </button>

      {hasFilters && (
        <button onClick={handleReset} style={{
          marginLeft: "8px",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "rgba(255,255,255,0.7)",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "12px"
        }}>
          Reset
        </button>
      )}
    </div>
  );
}
