// 
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        console.log("📊 Dashboard mounted!");
        console.log("Token exists:", !!localStorage.getItem("access_token"));
        setUserName(localStorage.getItem('user_name') || 'User');
        setUserRole(localStorage.getItem('user_role') || 'member');
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            const [projectsRes, tasksRes] = await Promise.all([
                API.get('/projects'),
                API.get('/tasks/all')
            ]);
            
            console.log('✅ Projects:', projectsRes.data);
            console.log('✅ Tasks:', tasksRes.data);
            
            setProjects(projectsRes.data || []);
            setTasks(tasksRes.data || []);
            setError('');
            
        } catch (err) {
            console.error('❌ Error fetching dashboard:', err);
            
            if (err.response?.status === 401 || err.response?.status === 422) {
                setError('Session expired. Redirecting to login...');
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/';
                }, 2000);
            } else if (err.code === 'ERR_NETWORK') {
                setError('Cannot connect to server. Make sure backend is running on port 5000.');
            } else {
                setError('Failed to load dashboard. Please try refreshing.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Calculate stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;
    const overdueTasks = tasks.filter(t => {
        if (!t.deadline || t.status === 'done') return false;
        return new Date(t.deadline) < new Date();
    }).length;

    if (loading) {
        return (
            <div className="app-layout">
                <Navbar />
                <main className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
                        <div style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Loading dashboard...</div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-layout">
                <Navbar />
                <main className="main-content" style={{ padding: '24px' }}>
                    <div style={{ 
                        background: '#ffebee', 
                        border: '1px solid #ffcdd2', 
                        borderRadius: '8px', 
                        padding: '24px', 
                        textAlign: 'center',
                        maxWidth: '500px',
                        margin: '100px auto'
                    }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
                        <h3 style={{ marginBottom: '8px', color: '#c62828' }}>Error</h3>
                        <p style={{ color: '#666', marginBottom: '16px' }}>{error}</p>
                        <button 
                            onClick={fetchDashboardData}
                            style={{
                                padding: '10px 24px',
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                marginRight: '8px'
                            }}
                        >
                            Try Again
                        </button>
                        <button 
                            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                            style={{
                                padding: '10px 24px',
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Login
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">
                            Welcome back, {userName}! · {userRole === 'admin' ? 'Admin' : 'Member'} view
                        </p>
                    </div>
                    <button 
                        onClick={fetchDashboardData} 
                        className="add-btn" 
                        style={{ background: 'transparent', border: '1px solid var(--border)' }}
                    >
                        ↻ Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '16px', 
                    marginBottom: '30px' 
                }}>
                    <div className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Projects</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent)' }}>{projects.length}</div>
                    </div>
                    
                    <div className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Tasks</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalTasks}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {completedTasks} completed · {inProgressTasks} in progress · {todoTasks} todo
                        </div>
                    </div>
                    
                    <div className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Completed</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {completedTasks} of {totalTasks} tasks
                        </div>
                    </div>
                    
                    <div className="card" style={{ padding: '20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Overdue</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', color: overdueTasks > 0 ? '#ef4444' : '#10b981' }}>
                            {overdueTasks}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {overdueTasks > 0 ? '⚠️ Needs attention' : '✅ All on track'}
                        </div>
                    </div>
                </div>

                {/* Projects and Tasks Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Recent Projects */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📁 Recent Projects</h3>
                        {projects.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⬡</div>
                                <p>No projects yet</p>
                                {userRole === 'admin' && <p style={{ fontSize: '12px' }}>Go to Projects to create one</p>}
                            </div>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {projects.slice(0, 8).map(project => (
                                    <div key={project.id} style={{ 
                                        padding: '12px', 
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{project.name}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {project.description?.substring(0, 60) || 'No description'}
                                            </div>
                                        </div>
                                        <span style={{ 
                                            fontSize: '12px', 
                                            color: 'var(--text-muted)',
                                            background: 'var(--bg-card)',
                                            padding: '4px 10px',
                                            borderRadius: '12px'
                                        }}>
                                            {project.task_count || 0} tasks
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Tasks */}
                    <div className="card" style={{ padding: '20px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>✅ Recent Tasks</h3>
                        {tasks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⊞</div>
                                <p>No tasks yet</p>
                                {userRole === 'admin' && <p style={{ fontSize: '12px' }}>Go to Tasks to create one</p>}
                            </div>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {tasks.slice(0, 8).map(task => (
                                    <div key={task.id} style={{ 
                                        padding: '12px', 
                                        borderBottom: '1px solid var(--border)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>{task.title}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                Project ID: {task.project_id}
                                            </div>
                                        </div>
                                        <span style={{ 
                                            fontSize: '11px',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            background: 
                                                task.status === 'done' ? 'rgba(16, 185, 129, 0.1)' :
                                                task.status === 'inprogress' ? 'rgba(59, 130, 246, 0.1)' :
                                                'rgba(107, 114, 128, 0.1)',
                                            color:
                                                task.status === 'done' ? '#10b981' :
                                                task.status === 'inprogress' ? '#3b82f6' :
                                                '#6b7280'
                                        }}>
                                            {task.status || 'todo'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;