// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import API from "../services/api";
// import { loginUser } from "../services/auth";

// const FEATURES = [
//   "Role-based access for admins & members",
//   "Real-time project & task tracking",
//   "Visual Kanban board workflow",
//   "Team progress dashboards",
// ];

// function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         try {
//             await loginUser(email, password); // Use auth service
//             // navigate("/dashboard");
//             window.location.href = "/dashboard";
//         } catch (err) {
//             setError(err.message || "Login failed");
//         } finally {
//             setLoading(false);
//         }
//   };

//   // const handleLogin = async () => {
//   //   if (!email.trim() || !password) { 
//   //     setError("Please fill in all fields"); 
//   //     return; 
//   //   }
    
//   //   setLoading(true);
//   //   setError("");
    
//   //   try {
//   //     console.log("Attempting to connect to:", API.defaults.baseURL);
//   //     console.log("Login attempt for:", email);
      
//   //     const res = await API.post("/login", { 
//   //       email: email.trim(), 
//   //       password 
//   //     });
      
//   //     console.log("Login successful:", res.data);
      
//   //     const token = res.data.token || res.data.access_token;
      
//   //     if (!token) {
//   //       throw new Error("No token received from server");
//   //     }
      
//   //     localStorage.setItem("token", token);
//   //     localStorage.setItem("role", res.data.role || "member");
//   //     localStorage.setItem("user_id", String(res.data.user_id || res.data.id));
//   //     localStorage.setItem("user_name", res.data.name || email.split("@")[0]);
      
//   //     navigate("/dashboard");
      
//   //   } catch (err) {
//   //     console.error("Login error details:", err);
      
//   //     // Better error messages
//   //     if (err.code === "ECONNABORTED") {
//   //       setError("Connection timed out. Make sure the backend server is running on port 5000");
//   //     } else if (err.message === "Network Error") {
//   //       setError("Cannot connect to server. Please check if backend is running at http://localhost:5000");
//   //     } else if (err.response) {
//   //       setError(err.response.data?.message || err.response.data?.error || "Invalid credentials");
//   //     } else {
//   //       setError("Network error. Please check your connection and backend server.");
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
// // In Login.js - Update your handleLogin function
//   const handleLogin = async () => {
//     if (!email.trim() || !password) {
//         setError("Please fill in all fields");
//         return;
//     }
    
//     setLoading(true);
//     setError("");
    
//     try {
//         // const res = await API.post("/login", { 
//         //     email: email.trim(), 
//         //     password 
//         // });
//         // const res = await API.post("/api/auth/login", { email: email.trim(), password });
//         const res = await API.post("/login", { email: email.trim(), password });        
//         console.log("Login response FULL:", res.data);
        
//         // Check different possible token field names
//         const accesstoken = res.data.token || res.data.access_token;
//         const refreshToken = res.data.refresh_token;
//         if (!accesstoken) {
//             // console.error("No token in response:", res.data);
//             throw new Error("No token received from server");
//         }
        
//         // Save the token
//         localStorage.setItem("access_token", accesstoken);
//         if (refreshToken) {
//             localStorage.setItem("refresh_token", refreshToken);
//         }


//         localStorage.setItem("role", res.data.role || "member");
//         localStorage.setItem("user_id", String(res.data.user_id || res.data.id || 1));
//         localStorage.setItem("user_name", res.data.name || email.split("@")[0]);
//         // console.log("Token saved:", token.substring(0, 20) + "...");
//         // console.log("All localStorage:", localStorage);
        
//         // Verify token was saved
//         const savedToken = localStorage.getItem("token");
//         console.log("Verified token in localStorage:", savedToken ? "Yes" : "No");
        
//         // Redirect to dashboard
//         console.log("✅ Login successful!");
//         console.log("access_token:", localStorage.getItem("access_token"));
//         console.log("refresh_token:", localStorage.getItem("refresh_token"));
//         console.log("user_role:", localStorage.getItem("user_role"));

//         await new Promise(resolve => setTimeout(resolve, 100));

// // Try direct navigation
//         console.log("🔄 Navigating to dashboard...");
//         window.location.href = "/dashboard";
//         // navigate('/dashboard');
        
//     } catch (err) {
//         console.error("Login error:", err);
//         setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//         setLoading(false);
//     }
// };
//   return (
//     <div className="auth-root">
//       <div className="auth-left">
//         <div className="auth-brand">
//           <div className="auth-brand-icon">⚡</div>
//           TaskFlow
//         </div>
//         <div className="auth-hero">
//           <h1>Manage tasks,<br />ship faster.</h1>
//           <p>The collaborative workspace where your team tracks projects, assigns tasks, and hits every deadline.</p>
//         </div>
//         <div className="auth-features">
//           {FEATURES.map((f, i) => (
//             <div key={i} className="auth-feature">
//               <div className="auth-feature-dot" />{f}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="auth-right">
//         <div className="auth-form-container">
//           <h2 className="auth-form-title">Welcome back</h2>
//           <p className="auth-form-subtitle">
//             Don&apos;t have an account? <Link to="/signup">Sign up free</Link>
//           </p>

//           {error && (
//             <div style={{ padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"var(--radius-sm)", color:"#f87171", fontSize:"13px", marginBottom:"20px" }}>
//               {error}
//             </div>
//           )}

//           <div className="form-group">
//             <label className="form-label">Email address</label>
//             <input
//               className="form-input" type="email" placeholder="you@company.com"
//               value={email} onChange={(e) => setEmail(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//               autoComplete="email"
//             />
//           </div>

//           <div className="form-group" style={{ marginBottom: "28px" }}>
//             <label className="form-label">Password</label>
//             <input
//               className="form-input" type="password" placeholder="Enter your password"
//               value={password} onChange={(e) => setPassword(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//               autoComplete="current-password"
//             />
//           </div>

//           <button
//             className="btn-primary" onClick={handleLogin}
//             disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}
//           >
//             {loading ? "Signing in…" : "Sign in →"}
//           </button>

//           {/* Debug button - remove in production */}
//           <button
//             onClick={() => {
//               fetch('http://localhost:5000/health')
//                 .then(res => res.json())
//                 .then(data => console.log('Backend health check:', data))
//                 .catch(err => console.error('Backend not reachable:', err));
//             }}
//             style={{ marginTop: "20px", fontSize: "12px", background: "none", border: "1px solid #ccc", padding: "5px", borderRadius: "4px", cursor: "pointer" }}
//           >
//             Check Backend Status
//           </button>

//           <p style={{ textAlign:"center", marginTop:"24px", fontSize:"12px", color:"var(--text-muted)" }}>
//             By continuing you agree to our Terms of Service
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const FEATURES = [
  "Role-based access for admins & members",
  "Real-time project & task tracking",
  "Visual Kanban board workflow",
  "Team progress dashboards",
];

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await API.post("/auth/login", { 
        email: email.trim(), 
        password 
      });
      
      console.log("✅ Login response:", res.data);
      
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      
      if (!accessToken) {
        throw new Error("No token received from server");
      }
      
      // Store with CORRECT key names
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }
      
      localStorage.setItem("user_role", res.data.role || "member");
      localStorage.setItem("user_id", String(res.data.user_id || ""));
      localStorage.setItem("user_name", res.data.name || email.split("@")[0]);
      
      console.log("✅ Tokens stored!");
      navigate("/dashboard");
      
    } catch (err) {
      console.error("❌ Login error:", err);
      
      if (err.code === "ECONNABORTED") {
        setError("Connection timed out. Is the backend running?");
      } else if (err.message === "Network Error") {
        setError("Cannot connect to server. Check if backend is running at http://localhost:5000");
      } else if (err.response) {
        setError(err.response.data?.message || "Invalid credentials");
      } else {
        setError("Login failed. Please try again.");
      }
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
          <h1>Manage tasks,<br />ship faster.</h1>
          <p>The collaborative workspace where your team tracks projects, assigns tasks, and hits every deadline.</p>
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
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-subtitle">
            Don&apos;t have an account? <Link to="/signup">Sign up free</Link>
          </p>

          {error && (
            <div style={{ padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"var(--radius-sm)", color:"#f87171", fontSize:"13px", marginBottom:"20px" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input" type="email" placeholder="you@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="email"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "28px" }}>
            <label className="form-label">Password</label>
            <input
              className="form-input" type="password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn-primary" onClick={handleLogin}
            disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <p style={{ textAlign:"center", marginTop:"24px", fontSize:"12px", color:"var(--text-muted)" }}>
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;