import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const FEATURES = [
  "Free to get started — no credit card",
  "Admin or member role selection",
  "Instant access to team projects",
  "Built-in task progress tracking",
];

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await API.post("/auth/signup", { name: name.trim(), email: email.trim(), password, role });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">⚡</div>
          TaskFlow
        </div>
        <div className="auth-hero">
          <h1>Join your team,<br />start building.</h1>
          <p>Create your account and start collaborating with your team on projects that matter.</p>
        </div>
        <div className="auth-features">
          {FEATURES.map((f, i) => (
            <div key={i} className="auth-feature">
              <div className="auth-feature-dot" />{f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-subtitle">
            Already have an account? <Link to="/">Sign in</Link>
          </p>

          {error && (
            <div style={{ padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"var(--radius-sm)", color:"#f87171", fontSize:"13px", marginBottom:"20px" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignup()} autoComplete="new-password" />
          </div>

          <div className="form-group">
            <label className="form-label">Select your role</label>
            <div className="role-select-group">
              {[
                { value: "admin",  icon: "👑", label: "Admin",  desc: "Create & manage" },
                { value: "member", icon: "👤", label: "Member", desc: "View & track"    },
              ].map((r) => (
                <div
                  key={r.value}
                  className={`role-option ${role === r.value ? "active" : ""}`}
                  onClick={() => setRole(r.value)}
                >
                  <div className="role-option-icon">{r.icon}</div>
                  <div className="role-option-label">{r.label}</div>
                  <div className="role-option-desc">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={handleSignup} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating account…" : "Create account →"}
          </button>

          <p style={{ textAlign:"center", marginTop:"24px", fontSize:"12px", color:"var(--text-muted)" }}>
            By signing up you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
