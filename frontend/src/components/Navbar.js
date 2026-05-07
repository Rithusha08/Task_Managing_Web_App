// import { Link, useLocation } from "react-router-dom";

// const navLinks = [
//   { to: "/dashboard", icon: "◈", label: "Dashboard" },
//   { to: "/projects",  icon: "⬡", label: "Projects"  },
//   { to: "/tasks",     icon: "⊞", label: "Tasks"     },
// ];

// function Navbar() {
//   const location = useLocation();
//   const role = localStorage.getItem("role")?.trim() || "member";
//   const name = localStorage.getItem("user_name") || "User";

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/";
//   };

//   return (
//     <div className="sidebar">
//       {/* Brand */}
//       <div className="sidebar-brand">
//         <div className="sidebar-brand-icon">⚡</div>
//         TaskFlow
//       </div>

//       <div className="sidebar-section-label">Navigation</div>

//       {/* Nav links */}
//       <nav className="sidebar-nav">
//         {navLinks.map((link) => (
//           <Link
//             key={link.to}
//             to={link.to}
//             className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
//           >
//             <span className="sidebar-link-icon">{link.icon}</span>
//             {link.label}
//           </Link>
//         ))}
//       </nav>

//       {/* User info + logout */}
//       <div className="sidebar-bottom">
//         <div className="sidebar-user">
//           <div className="sidebar-avatar">{name.charAt(0).toUpperCase()}</div>
//           <div className="sidebar-user-info">
//             <div className="sidebar-user-name">{name}</div>
//             <div className="sidebar-user-role">
//               <span className={`role-badge ${role === "admin" ? "role-badge-admin" : "role-badge-member"}`}>
//                 {role}
//               </span>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={handleLogout}
//           style={{
//             width: "100%", marginTop: "8px", padding: "9px 12px",
//             background: "transparent", border: "1px solid var(--border)",
//             borderRadius: "var(--radius-sm)", color: "var(--text-secondary)",
//             fontSize: "13px", cursor: "pointer", transition: "var(--transition)", textAlign: "left",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.background = "rgba(239,68,68,0.08)";
//             e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
//             e.currentTarget.style.color = "#f87171";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.background = "transparent";
//             e.currentTarget.style.borderColor = "var(--border)";
//             e.currentTarget.style.color = "var(--text-secondary)";
//           }}
//         >
//           ⎋ Sign out
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { to: "/dashboard", icon: "◈", label: "Dashboard" },
  { to: "/projects",  icon: "⬡", label: "Projects"  },
  { to: "/tasks",     icon: "⊞", label: "Tasks"     },
];

function Navbar() {
  const location = useLocation();
  const role = localStorage.getItem("user_role")?.trim() || "member";  // FIXED: was "role"
  const name = localStorage.getItem("user_name") || "User";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚡</div>
        TaskFlow
      </div>

      <div className="sidebar-section-label">Navigation</div>

      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
          >
            <span className="sidebar-link-icon">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{name}</div>
            <div className="sidebar-user-role">
              <span className={`role-badge ${role === "admin" ? "role-badge-admin" : "role-badge-member"}`}>
                {role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: "100%", marginTop: "8px", padding: "9px 12px",
            background: "transparent", border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)", color: "var(--text-secondary)",
            fontSize: "13px", cursor: "pointer", transition: "var(--transition)", textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          ⎋ Sign out
        </button>
      </div>
    </div>
  );
}

export default Navbar;