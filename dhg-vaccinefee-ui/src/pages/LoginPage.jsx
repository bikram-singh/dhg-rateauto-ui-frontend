import { useState } from "react";
import { Eye, EyeOff, Shield, Lock, User } from "lucide-react";

const USERS = [
  { username: "bikram", password: "Admin@123", role: "Admin", name: "Bikram Singh" },
  { username: "viewer", password: "View@123",  role: "Viewer", name: "Guest Viewer" },
];

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const user = USERS.find(
      (u) => u.username === username.toLowerCase() && u.password === password
    );

    if (user) {
      // Store in sessionStorage as simple JWT-like token
      const token = btoa(JSON.stringify({ ...user, exp: Date.now() + 8 * 60 * 60 * 1000 }));
      sessionStorage.setItem("dhg_token", token);
      onLogin(user);
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0D1B4B 0%, #1565C0 50%, #0a1640 100%)",
      fontFamily: "system-ui, sans-serif"
    }}>
      {/* Background pattern */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: `${200 + i * 80}px`, height: `${200 + i * 80}px`,
            borderRadius: "50%",
            border: "1px solid rgba(79,195,247,0.08)",
            top: `${10 + i * 8}%`, left: `${5 + i * 12}%`,
            animation: `float ${4 + i}s ease-in-out infinite alternate`
          }}/>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: "420px", padding: "20px", position: "relative", zIndex: 1 }}>
        {/* Logo card */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "80px", height: "80px", borderRadius: "20px",
            background: "white", boxShadow: "0 8px 32px rgba(21,101,192,0.3)",
            marginBottom: "16px"
          }}>
            <svg viewBox="0 0 80 90" width="56" height="63" fill="none">
              <defs>
                <linearGradient id="lSG" x1="0" y1="0" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00BCD4"/>
                  <stop offset="50%" stopColor="#29B6F6"/>
                  <stop offset="100%" stopColor="#1565C0"/>
                </linearGradient>
                <linearGradient id="lCG" x1="0" y1="0" x2="40" y2="55" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#4FC3F7"/>
                  <stop offset="100%" stopColor="#1565C0"/>
                </linearGradient>
              </defs>
              <circle cx="40" cy="7" r="7" fill="url(#lSG)" stroke="white" strokeWidth="2"/>
              <circle cx="40" cy="7" r="3.5" fill="white" opacity="0.9"/>
              <path d="M40 15 L72 27 L72 56 C72 73 58 83 40 88 C22 83 8 73 8 56 L8 27 Z" fill="url(#lSG)"/>
              <path d="M40 20 L68 30 L68 56 C68 71 55 79 40 84 C25 79 12 71 12 56 L12 30 Z" fill="white"/>
              <rect x="32" y="42" width="16" height="5.5" rx="2.5" fill="url(#lCG)"/>
              <rect x="37" y="36" width="6" height="17" rx="2.5" fill="url(#lCG)"/>
              <text x="40" y="75" textAnchor="middle" fontSize="9" fontWeight="800"
                fill="#1565C0" fontFamily="sans-serif" letterSpacing="2.5">DHG</text>
            </svg>
          </div>
          <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", margin: "0 0 4px" }}>
            Dummy Health Group
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>
            Vaccine Pricing Dashboard
          </p>
        </div>

        {/* Login card */}
        <div style={{
          background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: "20px",
          padding: "32px"
        }}>
          <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: "600",
            margin: "0 0 24px", textAlign: "center" }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600",
                color: "rgba(255,255,255,0.6)", textTransform: "uppercase",
                letterSpacing: "0.5px", marginBottom: "6px" }}>Username</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}/>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  style={{
                    width: "100%", padding: "12px 14px 12px 40px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px", color: "#fff", fontSize: "14px",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "600",
                color: "rgba(255,255,255,0.6)", textTransform: "uppercase",
                letterSpacing: "0.5px", marginBottom: "6px" }}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }}/>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{
                    width: "100%", padding: "12px 44px 12px 40px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "10px", color: "#fff", fontSize: "14px",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box"
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", background: "none", border: "none",
                    color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: "4px" }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                color: "#F87171", fontSize: "13px", textAlign: "center" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "13px",
                background: loading ? "rgba(79,195,247,0.3)" : "linear-gradient(135deg, #4FC3F7, #1565C0)",
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "15px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 4px 16px rgba(21,101,192,0.4)"
              }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: "24px", padding: "14px", background: "rgba(79,195,247,0.08)",
            border: "1px solid rgba(79,195,247,0.2)", borderRadius: "10px" }}>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)",
              textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>
              Demo Credentials
            </div>
            {USERS.map((u) => (
              <div key={u.username} style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                  <span style={{ color: "#4FC3F7", fontWeight: "600" }}>{u.role}:</span>
                  {" "}{u.username} / {u.password}
                </span>
                <button type="button"
                  onClick={() => { setUsername(u.username); setPassword(u.password); }}
                  style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "6px",
                    background: "rgba(79,195,247,0.15)", border: "1px solid rgba(79,195,247,0.3)",
                    color: "#4FC3F7", cursor: "pointer" }}>
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "16px" }}>
          © {new Date().getFullYear()} Dummy Health Group • All rights reserved
        </p>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to   { transform: translateY(-20px) rotate(5deg); }
        }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(79,195,247,0.5) !important;
          box-shadow: 0 0 0 3px rgba(79,195,247,0.1); }
      `}</style>
    </div>
  );
}
