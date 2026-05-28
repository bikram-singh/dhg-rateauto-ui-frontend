import { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Search } from "lucide-react";

const API_BASE = "/vaccinefee/api";

export default function AdminPanel({ vaccines = [], hospitals = [], pricing = [], departments = [], userRole }) {
  const [activeTab, setActiveTab]   = useState("vaccines");
  const [search, setSearch]         = useState("");
  const [editItem, setEditItem]     = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [formData, setFormData]     = useState({});
  const [saving, setSaving]         = useState(false);
  const [message, setMessage]       = useState(null);

  const isAdmin = userRole === "Admin";

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // CRUD helpers
  const apiCall = async (url, method, body) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editItem) {
        await apiCall(`/${activeTab}/${editItem.id}/`, "PUT", formData);
        showMsg(`✅ ${activeTab.slice(0,-1)} updated successfully`);
      } else {
        await apiCall(`/${activeTab}/`, "POST", formData);
        showMsg(`✅ ${activeTab.slice(0,-1)} created successfully`);
      }
      setShowForm(false); setEditItem(null); setFormData({});
    } catch (e) {
      showMsg(`❌ Error: ${e.message}`, "error");
    }
    setSaving(false);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await apiCall(`/${activeTab}/${item.id}/`, "DELETE");
      showMsg(`✅ Deleted successfully`);
    } catch (e) {
      showMsg(`❌ Error: ${e.message}`, "error");
    }
  };

  const startEdit = (item) => {
    setEditItem(item); setFormData({ ...item }); setShowForm(true);
  };

  const startCreate = () => {
    setEditItem(null);
    const defaults = {
      vaccines:    { name: "", manufacturer: "", description: "" },
      hospitals:   { name: "", location: "", address: "" },
      departments: { name: "", description: "" },
      pricing:     { vaccine_id: "", hospital_id: "", department_id: "", price: "", insurance_covered: "No", status: "Available" },
    };
    setFormData(defaults[activeTab] || {});
    setShowForm(true);
  };

  // Data for current tab
  const tabData = {
    vaccines:    vaccines,
    hospitals:   hospitals,
    departments: departments,
    pricing:     pricing.slice(0, 200),
  }[activeTab] || [];

  const filtered = tabData.filter((item) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  // Form fields per tab
  const formFields = {
    vaccines: [
      { key: "name",         label: "Vaccine Name",   type: "text" },
      { key: "manufacturer", label: "Manufacturer",    type: "text" },
      { key: "description",  label: "Description",     type: "text" },
    ],
    hospitals: [
      { key: "name",     label: "Hospital Name", type: "text" },
      { key: "location", label: "Location",      type: "text" },
      { key: "address",  label: "Address",       type: "text" },
    ],
    departments: [
      { key: "name",        label: "Department Name", type: "text" },
      { key: "description", label: "Description",     type: "text" },
    ],
    pricing: [
      { key: "vaccine_id",    label: "Vaccine ID",    type: "number" },
      { key: "hospital_id",   label: "Hospital ID",   type: "number" },
      { key: "department_id", label: "Department ID", type: "number" },
      { key: "price",         label: "Price (₹)",     type: "number" },
      { key: "insurance_covered", label: "Insurance", type: "select", options: ["No","Yes","Vco"] },
      { key: "status",        label: "Status",        type: "select", options: ["Available","Low Stock","Out of Stock"] },
    ],
  };

  const tabs = ["vaccines","hospitals","departments","pricing"];

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>Admin Panel</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>
            {isAdmin ? "Full access — Add, Edit, Delete records" : "View only — Contact admin for changes"}
          </p>
        </div>
        {!isAdmin && (
          <span style={{ padding:"6px 14px", borderRadius:"20px", fontSize:"12px",
            background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", color:"#FCD34D" }}>
            🔒 Viewer Mode
          </span>
        )}
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding:"12px 16px", borderRadius:"10px", marginBottom:"16px", fontSize:"13px", fontWeight:"500",
          background: message.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
          border: `1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
          color: message.type === "error" ? "#F87171" : "#4ADE80" }}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSearch(""); setShowForm(false); }}
            style={{ padding:"8px 18px", borderRadius:"8px", fontSize:"13px", fontWeight:"600",
              cursor:"pointer", textTransform:"capitalize",
              background: activeTab===tab ? "rgba(79,195,247,0.2)" : "rgba(255,255,255,0.06)",
              border: activeTab===tab ? "1px solid rgba(79,195,247,0.5)" : "1px solid rgba(255,255,255,0.12)",
              color: activeTab===tab ? "#4FC3F7" : "rgba(255,255,255,0.6)" }}>
            {tab} ({tabData.length})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display:"flex", gap:"10px", marginBottom:"14px", alignItems:"center" }}>
        <div style={{ position:"relative", flex:1 }}>
          <Search size={13} style={{ position:"absolute", left:"10px", top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.4)" }}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeTab}...`}
            style={{ width:"100%", padding:"8px 12px 8px 30px", background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:"8px", color:"#fff",
              fontSize:"13px", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
        </div>
        {isAdmin && (
          <button onClick={startCreate}
            style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 16px",
              borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
              background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", color:"#4ADE80" }}>
            <Plus size={15}/> Add New
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      {showForm && isAdmin && (
        <div style={{ background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.3)",
          borderRadius:"12px", padding:"20px", marginBottom:"16px" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
            <span style={{ color:"#fff", fontWeight:"600", fontSize:"14px" }}>
              {editItem ? `Edit ${activeTab.slice(0,-1)}` : `Add New ${activeTab.slice(0,-1)}`}
            </span>
            <button onClick={() => { setShowForm(false); setEditItem(null); }}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer" }}>
              <X size={18}/>
            </button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"12px", marginBottom:"16px" }}>
            {(formFields[activeTab] || []).map((field) => (
              <div key={field.key}>
                <label style={{ display:"block", fontSize:"11px", color:"rgba(255,255,255,0.5)",
                  textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:"4px" }}>{field.label}</label>
                {field.type === "select" ? (
                  <select value={formData[field.key] || ""} onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    style={{ width:"100%", padding:"8px 10px", background:"rgba(255,255,255,0.08)",
                      border:"1px solid rgba(255,255,255,0.2)", borderRadius:"7px", color:"#fff",
                      fontSize:"13px", fontFamily:"inherit" }}>
                    {field.options.map((o) => <option key={o} value={o} style={{ background:"#0D1B4B" }}>{o}</option>)}
                  </select>
                ) : (
                  <input type={field.type} value={formData[field.key] || ""} onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                    style={{ width:"100%", padding:"8px 10px", background:"rgba(255,255,255,0.08)",
                      border:"1px solid rgba(255,255,255,0.2)", borderRadius:"7px", color:"#fff",
                      fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
                )}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            <button onClick={handleSave} disabled={saving}
              style={{ display:"flex", alignItems:"center", gap:"6px", padding:"9px 20px",
                borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
                background:"rgba(79,195,247,0.2)", border:"1px solid rgba(79,195,247,0.4)", color:"#4FC3F7" }}>
              <Save size={14}/> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => { setShowForm(false); setEditItem(null); }}
              style={{ padding:"9px 16px", borderRadius:"8px", fontSize:"13px", cursor:"pointer",
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.6)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px", overflow:"hidden" }}>
        <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)",
          fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>
          Showing {filtered.length} of {tabData.length} records
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"12px" }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>ID</th>
                {(formFields[activeTab] || []).map((f) => (
                  <th key={f.key} style={{ padding:"10px 14px", textAlign:"left", fontSize:"10px", fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>{f.label}</th>
                ))}
                {isAdmin && <th style={{ padding:"10px 14px", textAlign:"center", fontSize:"10px", fontWeight:"600", color:"rgba(255,255,255,0.5)", textTransform:"uppercase" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,100).map((item) => (
                <tr key={item.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                  onMouseLeave={(e) => e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"9px 14px", color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{item.id}</td>
                  {(formFields[activeTab] || []).map((f) => (
                    <td key={f.key} style={{ padding:"9px 14px", color:"rgba(255,255,255,0.8)", maxWidth:"200px",
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {f.key === "price" ? `₹${item[f.key]}` : String(item[f.key] || "—").substring(0,40)}
                    </td>
                  ))}
                  {isAdmin && (
                    <td style={{ padding:"9px 14px", textAlign:"center" }}>
                      <div style={{ display:"flex", gap:"6px", justifyContent:"center" }}>
                        <button onClick={() => startEdit(item)}
                          style={{ padding:"4px 10px", borderRadius:"6px", fontSize:"11px", cursor:"pointer",
                            background:"rgba(79,195,247,0.1)", border:"1px solid rgba(79,195,247,0.3)", color:"#4FC3F7",
                            display:"flex", alignItems:"center", gap:"3px" }}>
                          <Edit2 size={11}/> Edit
                        </button>
                        <button onClick={() => handleDelete(item)}
                          style={{ padding:"4px 10px", borderRadius:"6px", fontSize:"11px", cursor:"pointer",
                            background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", color:"#F87171",
                            display:"flex", alignItems:"center", gap:"3px" }}>
                          <Trash2 size={11}/> Del
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
