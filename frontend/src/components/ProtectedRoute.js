// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/" replace />;
//   return children;
// }

// export default ProtectedRoute;
// import { Navigate } from "react-router-dom";
// import { isAuthenticated } from "../services/auth";

// function ProtectedRoute({ children }) {
//     if (!isAuthenticated()) {
//         return <Navigate to="/" replace />;
//     }
//     return children;
// }

// export default ProtectedRoute;
// import { Navigate } from "react-router-dom";
// import { useEffect } from "react";

// function ProtectedRoute({ children }) {
//     const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    
//     useEffect(() => {
//         console.log('🛡️ ProtectedRoute check:', {
//             hasToken: !!token,
//             path: window.location.pathname
//         });
//     }, [token]);
    
//     if (!token) {
//         console.log('❌ No token, redirecting to login');
//         // DON'T redirect immediately - wait 5 seconds so we can see errors
//         setTimeout(() => {
//             window.location.href = '/';
//         }, 5000);
//         return <div>No access token found. Check console...</div>;
//     }
//   return children;
// }

// export default ProtectedRoute;
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");  // FIXED: was "token"
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default ProtectedRoute;