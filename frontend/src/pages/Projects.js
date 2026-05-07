// import { useEffect, useState, useCallback } from "react";
// import Navbar from "../components/Navbar";
// import Toast from "../components/Toast";
// import API from "../services/api";  // Make sure this import is correct

// const PROJECT_ICONS  = ["⬡", "◈", "⬢", "◉", "⬟", "◆"];
// const PROJECT_COLORS = [
//   "linear-gradient(135deg,#3b82f6,#8b5cf6)",
//   "linear-gradient(135deg,#06b6d4,#3b82f6)",
//   "linear-gradient(135deg,#10b981,#06b6d4)",
//   "linear-gradient(135deg,#f59e0b,#ef4444)",
//   "linear-gradient(135deg,#8b5cf6,#ec4899)",
//   "linear-gradient(135deg,#ef4444,#f59e0b)",
// ];

// function Projects() {
//   const role   = localStorage.getItem("role")?.trim();
//   const [projects, setProjects] = useState([]);
//   const [name, setName]         = useState("");
//   const [description, setDesc]  = useState("");
//   const [loading, setLoading]   = useState(true);
//   const [adding, setAdding]     = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [toast, setToast]       = useState(null);

//   // Fixed fetchProjects - using correct API endpoint
//   const fetchProjects = useCallback(async () => {
//     try {
//       setLoading(true);
//       // Use the correct endpoint from your backend: /projects (not /api/projects/)
//       const response = await API.get("/projects");
//       console.log("Fetched projects:", response.data);
//       setProjects(response.data || []);
//     } catch (error) {
//       console.error('Error fetching projects:', error);
//       setToast({ 
//         message: error.response?.data?.error || "Failed to fetch projects", 
//         type: "error" 
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fixed createProject function
//   const createProject = async (projectData) => {
//     try {
//       // Use the correct endpoint: /projects (not /api/projects/)
//       const response = await API.post("/projects", projectData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating project:', error);
//       throw error;
//     }
//   };

//   useEffect(() => { 
//     fetchProjects(); 
//   }, [fetchProjects]);

//   // Fixed addProject function
//   const addProject = async () => {
//     if (!name.trim()) {
//       setToast({ message: "Project name is required", type: "error" });
//       return;
//     }
    
//     setAdding(true);
//     try {
//       // Use the correct endpoint: /projects
//       await API.post("/projects", { 
//         name: name.trim(), 
//         description: description.trim() 
//       });
      
//       setName("");
//       setDesc("");
//       setShowForm(false);
//       setToast({ message: "Project created successfully!", type: "success" });
//       await fetchProjects(); // Refresh the list
//     } catch (err) {
//       console.error("Error creating project:", err);
//       setToast({ 
//         message: err.response?.data?.error || err.response?.data?.message || "Failed to create project", 
//         type: "error" 
//       });
//     } finally {
//       setAdding(false);
//     }
//   };

//   // Fixed deleteProject function
//   const deleteProject = async (id) => {
//     if (!window.confirm("Delete this project and all its tasks?")) return;
    
//     try {
//       await API.delete(`/projects/${id}`);
//       setToast({ message: "Project deleted successfully", type: "success" });
//       await fetchProjects(); // Refresh the list
//     } catch (err) {
//       console.error("Error deleting project:", err);
//       setToast({ 
//         message: err.response?.data?.error || "Failed to delete project", 
//         type: "error" 
//       });
//     }
//   };

//   return (
//     <div className="app-layout">
//       <Navbar />

//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <main className="main-content">
//         <div className="page-header">
//           <div>
//             <h1 className="page-title">Projects</h1>
//             <p className="page-subtitle">
//               {projects.length} project{projects.length !== 1 ? "s" : ""} · {role === "admin" ? "Admin view" : "Member view"}
//             </p>
//           </div>
//           {role === "admin" && (
//             <button className="add-btn" onClick={() => setShowForm(!showForm)}>
//               {showForm ? "✕ Cancel" : "+ New Project"}
//             </button>
//           )}
//         </div>

//         {/* Admin create form */}
//         {role === "admin" && showForm && (
//           <div className="card" style={{ marginBottom:"24px", animation:"fadeInUp 0.3s ease" }}>
//             <div style={{ fontFamily:"var(--font-display)", fontSize:"15px", fontWeight:700, marginBottom:"16px" }}>
//               Create New Project
//             </div>
//             <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
//               <div>
//                 <label className="form-label">Project Name *</label>
//                 <input
//                   className="form-input" placeholder="e.g. Website Redesign"
//                   value={name} onChange={(e) => setName(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && addProject()}
//                 />
//               </div>
//               <div>
//                 <label className="form-label">Description</label>
//                 <input
//                   className="form-input" placeholder="Brief project description"
//                   value={description} onChange={(e) => setDesc(e.target.value)}
//                 />
//               </div>
//             </div>
//             <button
//               className="add-btn" onClick={addProject}
//               disabled={adding || !name.trim()} 
//               style={{ opacity: (!name.trim() || adding) ? 0.5 : 1 }}
//             >
//               {adding ? "Creating…" : "Create Project →"}
//             </button>
//           </div>
//         )}

//         {/* Member info banner */}
//         {role !== "admin" && (
//           <div style={{ padding:"14px 18px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:"var(--radius-sm)", marginBottom:"24px", fontSize:"13px", color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:"10px" }}>
//             <span>ℹ</span> You have view access to all projects. Contact an admin to create new projects.
//           </div>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"16px" }}>
//             {[1,2,3].map(i => <div key={i} className="loading-skeleton" style={{ height:"160px" }} />)}
//           </div>
//         ) : projects.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">⬡</div>
//             <div className="empty-text">
//               No projects yet{role === "admin" ? " — create your first one above" : ""}
//             </div>
//           </div>
//         ) : (
//           <div className="projects-grid">
//             {projects.map((p, i) => (
//               <div key={p.id} className="project-card" style={{ animationDelay:`${i * 0.05}s` }}>
//                 <div className="project-card-header">
//                   <div className="project-icon" style={{ background: PROJECT_COLORS[i % PROJECT_COLORS.length] }}>
//                     {PROJECT_ICONS[i % PROJECT_ICONS.length]}
//                   </div>
//                   {role === "admin" && (
//                     <button
//                       onClick={() => deleteProject(p.id)}
//                       title="Delete project"
//                       style={{ padding:"4px 10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"6px", color:"#f87171", fontSize:"11px", cursor:"pointer", transition:"var(--transition)" }}
//                       onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
//                       onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
//                     >
//                       ✕ Delete
//                     </button>
//                   )}
//                 </div>
//                 <div className="project-name">{p.name}</div>
//                 <div className="project-desc">{p.description || "No description provided"}</div>
//                 <div className="project-meta">
//                   <div className="project-meta-item">
//                     <span>⊞</span> {p.task_count || 0} task{p.task_count !== 1 ? "s" : ""}
//                   </div>
//                   <div className="project-meta-item">
//                     <span style={{ color:"var(--success)", fontSize:"10px" }}>●</span> Active
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// export default Projects;
import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import API from "../services/api";

const PROJECT_ICONS  = ["⬡", "◈", "⬢", "◉", "⬟", "◆"];
const PROJECT_COLORS = [
  "linear-gradient(135deg,#3b82f6,#8b5cf6)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#ef4444,#f59e0b)",
];

function Projects() {
  const role   = localStorage.getItem("user_role")?.trim();
  const [projects, setProjects] = useState([]);
  const [name, setName]         = useState("");
  const [description, setDesc]  = useState("");
  const [loading, setLoading]   = useState(true);
  const [adding, setAdding]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast]       = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/projects");
      console.log("✅ Fetched projects:", response.data);
      setProjects(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      setToast({ 
        message: error.response?.data?.message || "Failed to fetch projects", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchProjects(); 
  }, [fetchProjects]);

  const addProject = async () => {
    if (!name.trim()) {
      setToast({ message: "Project name is required", type: "error" });
      return;
    }
    
    setAdding(true);
    try {
      await API.post("/projects", { 
        name: name.trim(), 
        description: description.trim() 
      });
      
      setName("");
      setDesc("");
      setShowForm(false);
      setToast({ message: "Project created successfully!", type: "success" });
      await fetchProjects();
    } catch (err) {
      console.error("❌ Error creating project:", err);
      setToast({ 
        message: err.response?.data?.message || "Failed to create project", 
        type: "error" 
      });
    } finally {
      setAdding(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    
    try {
      await API.delete(`/projects/${id}`);
      setToast({ message: "Project deleted successfully", type: "success" });
      await fetchProjects();
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      setToast({ 
        message: err.response?.data?.message || "Failed to delete project", 
        type: "error" 
      });
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">
              {projects.length} project{projects.length !== 1 ? "s" : ""} · {role === "admin" ? "Admin view" : "Member view"}
            </p>
          </div>
          {role === "admin" && (
            <button className="add-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Cancel" : "+ New Project"}
            </button>
          )}
        </div>

        {/* Admin create form */}
        {role === "admin" && showForm && (
          <div className="card" style={{ marginBottom:"24px", animation:"fadeInUp 0.3s ease" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:"15px", fontWeight:700, marginBottom:"16px" }}>
              Create New Project
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
              <div>
                <label className="form-label">Project Name *</label>
                <input
                  className="form-input" placeholder="e.g. Website Redesign"
                  value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProject()}
                  autoFocus
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <input
                  className="form-input" placeholder="Brief project description"
                  value={description} onChange={(e) => setDesc(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addProject()}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="add-btn" onClick={addProject}
                disabled={adding || !name.trim()} 
                style={{ opacity: (!name.trim() || adding) ? 0.5 : 1 }}
              >
                {adding ? "Creating…" : "Create Project →"}
              </button>
              <button
                className="btn-secondary" onClick={() => { setShowForm(false); setName(""); setDesc(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Member info banner */}
        {role !== "admin" && (
          <div style={{ padding:"14px 18px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:"var(--radius-sm)", marginBottom:"24px", fontSize:"13px", color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:"10px" }}>
            <span>ℹ</span> You have view access to all projects. Contact an admin to create new projects.
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:"16px" }}>
            {[1,2,3].map(i => <div key={i} className="loading-skeleton" style={{ height:"160px" }} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⬡</div>
            <div className="empty-text">
              No projects yet{role === "admin" ? " — create your first one above" : ""}
            </div>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((p, i) => (
              <div key={p.id} className="project-card" style={{ animationDelay:`${i * 0.05}s` }}>
                <div className="project-card-header">
                  <div className="project-icon" style={{ background: PROJECT_COLORS[i % PROJECT_COLORS.length] }}>
                    {PROJECT_ICONS[i % PROJECT_ICONS.length]}
                  </div>
                  {role === "admin" && (
                    <button
                      onClick={() => deleteProject(p.id)}
                      title="Delete project"
                      style={{ padding:"4px 10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"6px", color:"#f87171", fontSize:"11px", cursor:"pointer", transition:"var(--transition)" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                    >
                      ✕ Delete
                    </button>
                  )}
                </div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.description || "No description provided"}</div>
                <div className="project-meta">
                  <div className="project-meta-item">
                    <span>⊞</span> {p.task_count || 0} task{p.task_count !== 1 ? "s" : ""}
                  </div>
                  <div className="project-meta-item">
                    <span style={{ color:"var(--success)", fontSize:"10px" }}>●</span> Active
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Projects;