import { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import API from "../services/api";

/* ── Task creation modal ── */
function AddTaskModal({ projectId, users, onClose, onCreated }) {
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState("");

  const submit = async () => {
    if (!title.trim()) { setErr("Task title is required"); return; }
    setSaving(true); setErr("");
    try {
      await API.post("/tasks", {
        title: title.trim(),
        description: desc.trim(),
        project_id: projectId,
        assigned_to: assignTo ? parseInt(assignTo) : null,
        deadline: deadline || null,
      });
      onCreated();
      onClose();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">New Task</div>

        {err && (
          <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"var(--radius-sm)", color:"#f87171", fontSize:"13px", marginBottom:"16px" }}>
            {err}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Title *</label>
          <input className="form-input" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="Optional description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Assign to</label>
          <select className="form-select" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Deadline</label>
          <input className="form-input" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="add-btn" onClick={submit} disabled={saving || !title.trim()} style={{ opacity: !title.trim() ? 0.5 : 1 }}>
            {saving ? "Creating…" : "Create Task →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Tasks page ── */
function Tasks() {
  const role   = localStorage.getItem("user_role")?.trim();
  const [tasks,      setTasks]      = useState([]);
  const [projects,   setProjects]   = useState([]);
  const [users,      setUsers]      = useState([]);
  const [projectId,  setProjectId]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [toast,      setToast]      = useState(null);

  // FIXED: Load all tasks and filter by project
  const loadTasks = useCallback(async (pid) => {
    try {
        const res = await API.get('/tasks/all');
        const allTasks = Array.isArray(res.data) ? res.data : [];
        
        // If pid is null/undefined/0, show ALL tasks
        if (!pid) {
            setTasks(allTasks);
        } else {
            // Filter by selected project
            setTasks(allTasks.filter(t => t.project_id === pid));
        }
    } catch (err) {
        console.error('❌ Error loading tasks:', err);
        setTasks([]);
    }
}, []);
  useEffect(() => {
    const init = async () => {
        try {
            const [projRes, userRes] = await Promise.all([
                API.get("/projects"),
                API.get("/auth/users"),
            ]);
            const projs = projRes.data || [];
            setProjects(projs);
            setUsers(userRes.data || []);
            
            // FIXED: Load ALL tasks first, then filter by project if needed
            await loadTasks(null);  // null = show all tasks
            
            // Set first project for the "Add Task" modal
            if (projs.length > 0) {
                setProjectId(projs[0].id);
            }
        }catch (e) {
            console.error('❌ Init error:', e);
        } finally {
            setLoading(false);
           }
    };
      init();
  }, [loadTasks]);

  const switchProject = async (pid) => {
    setProjectId(pid);
    setLoading(true);
    await loadTasks(pid);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      await loadTasks(projectId);
      setToast({ message: "Status updated", type: "success" });
    } catch {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      await loadTasks(projectId);
      setToast({ message: "Task deleted", type: "success" });
    } catch {
      setToast({ message: "Failed to delete task", type: "error" });
    }
  };

  const safeTasks  = Array.isArray(tasks) ? tasks : [];
  const todo       = safeTasks.filter(t => t.status?.toLowerCase() === "todo");
  const inprogress = safeTasks.filter(t => t.status?.toLowerCase() === "inprogress");
  const done       = safeTasks.filter(t => t.status?.toLowerCase() === "done");
  const currentProject = projects.find(p => p.id === projectId);

  const columns = [
    { id:"todo",       label:"To Do",       tasks:todo,       dotClass:"todo",       nextStatus:"inprogress", nextLabel:"Start →"    },
    { id:"inprogress", label:"In Progress", tasks:inprogress, dotClass:"inprogress", nextStatus:"done",       nextLabel:"Complete ✓" },
    { id:"done",       label:"Done",        tasks:done,       dotClass:"done",       nextStatus:null                                 },
  ];

  return (
    <div className="app-layout">
      <Navbar />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {showModal && projectId && (
        <AddTaskModal
          projectId={projectId}
          users={users}
          onClose={() => setShowModal(false)}
          onCreated={() => loadTasks(projectId)}
        />
      )}

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Task Board</h1>
            <p className="page-subtitle">
              {currentProject ? currentProject.name : "Select a project"} · {safeTasks.length} total tasks
            </p>
          </div>
          {role === "admin" && projects.length > 0 && (
            <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Task</button>
          )}
        </div>

        {/* Project tabs */}
        {projects.length > 0 && (
          <div style={{ display:"flex", gap:"8px", marginBottom:"24px", flexWrap:"wrap" }}>
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => switchProject(p.id)}
                style={{
                  padding:"7px 16px",
                  background: projectId === p.id ? "rgba(59,130,246,0.12)" : "var(--bg-card)",
                  border:`1px solid ${projectId === p.id ? "rgba(59,130,246,0.3)" : "var(--border)"}`,
                  borderRadius:"99px",
                  color: projectId === p.id ? "var(--accent)" : "var(--text-secondary)",
                  fontSize:"13px", fontWeight:600, cursor:"pointer",
                  transition:"var(--transition)", fontFamily:"var(--font-body)",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        {/* Member notice */}
        {role !== "admin" && (
          <div style={{ padding:"12px 16px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:"var(--radius-sm)", marginBottom:"20px", fontSize:"13px", color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:"8px" }}>
            <span>ℹ</span> Click the arrow buttons to update your task progress.
          </div>
        )}

        {/* Kanban board */}
        {loading ? (
          <div className="board-grid">
            {[1,2,3].map(i => <div key={i} className="loading-skeleton" style={{ height:"300px" }} />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state" style={{ marginTop:"40px" }}>
            <div className="empty-icon">⬡</div>
            <div className="empty-text">No projects yet — have an admin create one first</div>
          </div>
        ) : (
          <div className="board-grid">
            {columns.map(col => (
              <div key={col.id} className="board-column">
                <div className="board-column-header">
                  <div className="board-column-title">
                    <span className={`board-col-dot ${col.dotClass}`} />
                    {col.label}
                  </div>
                  <span className="board-count">{col.tasks.length}</span>
                </div>

                <div className="board-column-body">
                  {col.tasks.length === 0 ? (
                    <div className="empty-state" style={{ padding:"24px 12px" }}>
                      <div style={{ fontSize:"24px", marginBottom:"8px", opacity:0.4 }}>○</div>
                      <div style={{ fontSize:"12px", color:"var(--text-muted)" }}>No tasks here</div>
                    </div>
                  ) : (
                    col.tasks.map(t => {
                      const now = new Date();
                      const isOverdue = t.deadline && new Date(t.deadline) < now && t.status !== "done";
                      const assignedUser = users.find(u => u.id === t.assigned_to);
                      return (
                        <div key={t.id} className="task-card">
                          <div className="task-card-title">{t.title}</div>

                          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"10px" }}>
                            {assignedUser && (
                              <span style={{ fontSize:"11px", color:"var(--text-secondary)", background:"var(--bg-card)", padding:"2px 8px", borderRadius:"99px", border:"1px solid var(--border)" }}>
                                👤 {assignedUser.name}
                              </span>
                            )}
                            {t.deadline && (
                              <span style={{ fontSize:"11px", color: isOverdue ? "var(--danger)" : "var(--text-muted)", background: isOverdue ? "rgba(239,68,68,0.08)" : "var(--bg-card)", padding:"2px 8px", borderRadius:"99px", border:`1px solid ${isOverdue ? "rgba(239,68,68,0.2)" : "var(--border)"}` }}>
                                {isOverdue ? "⚠ " : "⏱ "}{new Date(t.deadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          <div className="task-card-footer">
                            <span className={`status-badge ${col.id === "inprogress" ? "inprogress" : col.id === "done" ? "done" : "todo"}`}>
                              {col.id === "inprogress" ? "In Progress" : col.id === "done" ? "Done" : "To Do"}
                            </span>
                            <div style={{ display:"flex", gap:"6px" }}>
                              {col.nextStatus && (
                                <button className="task-move-btn" onClick={() => updateStatus(t.id, col.nextStatus)}>
                                  {col.nextLabel}
                                </button>
                              )}
                              {role === "admin" && (
                                <button
                                  onClick={() => deleteTask(t.id)}
                                  style={{ padding:"5px 10px", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"6px", color:"#f87171", fontSize:"11px", cursor:"pointer", transition:"var(--transition)" }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.18)"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Tasks;