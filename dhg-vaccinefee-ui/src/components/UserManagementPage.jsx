import { useState, useEffect } from "react";
import { Plus, Trash2, RefreshCw, User, Shield, Eye } from "lucide-react";
import { api } from "../services/api";

export default function UserManagementPage({ userRole }) {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState(null);
  const [form, setForm]         = useState({ username: "", password: "", full_name: "", role: "Viewer" });

  const isAdmin = userRole === "Admin";

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      showMsg(`❌ ${e.message}`, "error");
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    setSaving(true);
    try {
      await api.createUser(form);
      showMsg(`✅ User "${form.username}" created successfully`);
      setShowForm(false);
      setForm({ username: "", password: "", full_name: "", role: "Viewer" });
      loadUsers();
    } catch (e) {
      showMsg(`❌ ${e.message}`, "error");
    }
    setSaving(false);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    try {
      await api.deleteUser(user.id);
      showMsg(`✅ User "${user.username}" deleted`);
      loadUsers();
    } catch (e) {
      showMsg(`❌ ${e.message}`, "error");
    }
  };

  const roleColor = (role) => role === "Admin"
    ? { bg: "rgba(79,195,247,0.15)", color: "#4FC3F7", border: "rgba(79,195,247,0.3)" }
    : { bg: "rgba(34,197,94,0.12)", color: "#4ADE80", border: "rgba(34,197,94,0.25)" };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
        <div>
          <h2 style={{ color:"#fff", fontSize:"20px", fontWeight:"700" }}>User Management</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>
            Manage dashboard users and roles
          </p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={loadUsers} style={{ display:"flex", alignItems:"center", gap:"5px",
            padding:"8px 14px", borderRadius:"8px", fontSize:"13px", cursor:"pointer",
            background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.15)",
            color:"rgba(255,255,255,0.7)" }}>
            <RefreshCw size={14}/> Refresh
          </button>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} style={{ display:"flex", alignItems:"center", gap:"6px",
              padding:"8px 16px", borderRadius:"8px", fontSize:"13px", fontWeight:"600", cursor:"pointer",
              background:"rgba(34,197,94,0.15)", border:"1px solid rgba(34,197,94,0.3)", color:"#4ADE80" }}>
              <Plus size={15}/> Add User
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div style={{ padding:"12px 16px", borderRadius:"10px", marginBottom:"16px",
          fontSize:"13px", fontWeight:"500",
          background: message.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
          border:`1px solid ${message.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`,
          color: message.type === "error" ? "#F87171" : "#4ADE80" }}>
          {message.text}
        </div>
      )}

      {/* Create User Form */}
      {showForm && isAdmin && (
        <div style={{ background:"rgba(79,195,247,0.08)", border:"1px solid rgba(79,195,247,0.25)",
          borderRadius:"12px", padding:"20px", marginBottom:"20px" }}>
          <div style={{ color:"#fff", fontWeight:"600", fontSize:"14px", marginBottom:"16px" }}>
            Create New User
          </div>
          <form onSubmit={handleCreate}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:"12px", alignItems:"end" }}>
              {[
                { key:"full_name", label:"Full Name",    placeholder:"Bikram Singh",   type:"text" },
                { key:"username",  label:"Username",     placeholder:"bikram2",         type:"text" },
                { key:"password",  label:"Password",     placeholder:"Min 8 chars",     type:"password" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:"11px", color:"rgba(255,255,255,0.5)",
                    textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:"5px" }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={(e) => setForm({...form, [f.key]: e.target.value})}
                    required={f.key !== "full_name"}
                    style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.08)",
                      border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color:"#fff",
                      fontSize:"13px", fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
                </div>
              ))}
              <div>
                <label style={{ display:"block", fontSize:"11px", color:"rgba(255,255,255,0.5)",
                  textTransform:"uppercase", letterSpacing:"0.4px", marginBottom:"5px" }}>Role</label>
                <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}
                  style={{ width:"100%", padding:"9px 12px", background:"rgba(255,255,255,0.08)",
                    border:"1px solid rgba(255,255,255,0.2)", borderRadius:"8px", color:"#fff",
                    fontSize:"13px", fontFamily:"inherit" }}>
                  <option value="Viewer" style={{ background:"#0D1B4B" }}>Viewer</option>
                  <option value="Admin"  style={{ background:"#0D1B4B" }}>Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", marginTop:"14px" }}>
              <button type="submit" disabled={saving}
                style={{ padding:"9px 20px", borderRadius:"8px", fontSize:"13px", fontWeight:"600",
                  cursor:"pointer", background:"rgba(79,195,247,0.2)", border:"1px solid rgba(79,195,247,0.4)",
                  color:"#4FC3F7" }}>
                {saving ? "Creating..." : "Create User"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={{ padding:"9px 16px", borderRadius:"8px", fontSize:"13px", cursor:"pointer",
                  background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                  color:"rgba(255,255,255,0.6)" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users list */}
      {loading ? (
        <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.4)" }}>Loading users...</div>
      ) : (
        <div style={{ display:"grid", gap:"12px" }}>
          {users.map((user) => {
            const rc = roleColor(user.role);
            return (
              <div key={user.id} style={{ background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.1)", borderRadius:"12px",
                padding:"16px 20px", display:"flex", alignItems:"center", gap:"16px" }}>
                {/* Avatar */}
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", flexShrink:0,
                  background:"linear-gradient(135deg,#4FC3F7,#1565C0)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"16px", fontWeight:"700", color:"#fff" }}>
                  {user.full_name ? user.full_name.split(" ").map((n) => n[0]).join("").substring(0,2).toUpperCase() : user.username.substring(0,2).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
                    <span style={{ color:"#fff", fontWeight:"600", fontSize:"15px" }}>
                      {user.full_name || user.username}
                    </span>
                    <span style={{ fontSize:"11px", padding:"2px 10px", borderRadius:"20px",
                      background:rc.bg, color:rc.color, border:`1px solid ${rc.border}`,
                      fontWeight:"600", display:"flex", alignItems:"center", gap:"4px" }}>
                      {user.role === "Admin" ? <Shield size={10}/> : <Eye size={10}/>}
                      {user.role}
                    </span>
                    {!user.is_active && (
                      <span style={{ fontSize:"11px", padding:"2px 8px", borderRadius:"20px",
                        background:"rgba(239,68,68,0.15)", color:"#F87171",
                        border:"1px solid rgba(239,68,68,0.3)" }}>Disabled</span>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:"16px" }}>
                    <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:"4px" }}>
                      <User size={11}/> @{user.username}
                    </span>
                    <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.4)" }}>
                      ID: {user.id}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isAdmin && (
                  <button onClick={() => handleDelete(user)}
                    style={{ display:"flex", alignItems:"center", gap:"5px", padding:"7px 14px",
                      borderRadius:"8px", fontSize:"12px", cursor:"pointer",
                      background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                      color:"#F87171" }}>
                    <Trash2 size={13}/> Delete
                  </button>
                )}
              </div>
            );
          })}
          {users.length === 0 && (
            <div style={{ textAlign:"center", padding:"40px", color:"rgba(255,255,255,0.3)" }}>
              No users found
            </div>
          )}
        </div>
      )}

      {/* Role info */}
      <div style={{ marginTop:"20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
        {[
          { role:"Admin", icon:<Shield size={16}/>, color:"#4FC3F7", desc:"Full access — view, create, edit and delete all data including users" },
          { role:"Viewer", icon:<Eye size={16}/>, color:"#4ADE80", desc:"Read-only access — can view all data but cannot make any changes" },
        ].map((r) => (
          <div key={r.role} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:"10px", padding:"14px 16px", display:"flex", gap:"12px", alignItems:"flex-start" }}>
            <div style={{ color:r.color, marginTop:"1px" }}>{r.icon}</div>
            <div>
              <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px", marginBottom:"4px" }}>{r.role}</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", lineHeight:1.5 }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
