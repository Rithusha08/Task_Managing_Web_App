# ⚡ TaskFlow — Team Task Manager

A full-stack web app for teams to manage projects, assign tasks, and track progress with role-based access control.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | JWT-based signup / login |
| 👑 Role-based access | Admin: create/delete projects & tasks · Member: update status |
| 📁 Project management | Create, view, and delete projects |
| ✅ Task tracking | Kanban board (To Do → In Progress → Done) |
| 📊 Dashboard | Task stats, completion %, overdue indicators |
| 👤 Task assignment | Assign tasks to team members with deadlines |

---

## 🗂 Project Structure

```
taskflow/
├── backend/           ← Flask REST API
│   ├── app.py         ← App factory + entry point
│   ├── models.py      ← SQLAlchemy models (User, Project, Task)
│   ├── extensions.py  ← Bcrypt instance
│   ├── init_db.py     ← One-time DB table creation
│   ├── requirements.txt
│   ├── Procfile       ← For Railway / Heroku deploy
│   ├── .env           ← Environment variables (see below)
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── project_routes.py
│   │   └── task_routes.py
│   └── utils/
│       └── auth_middleware.py
│
└── frontend/          ← React app
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── services/api.js
        ├── components/
        │   ├── Navbar.js
        │   ├── ProtectedRoute.js
        │   └── Toast.js
        └── pages/
            ├── Login.js
            ├── Signup.js
            ├── Dashboard.js
            ├── Projects.js
            └── Tasks.js
```

---

## 🚀 Local Development

### Prerequisites
- **Node.js** ≥ 16  
- **Python** ≥ 3.9  
- **MySQL** (or skip to SQLite for zero-config local dev)

---

### 1 — Backend Setup

```bash
cd taskflow/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env .env.local
nano .env.local                 # or edit with any editor
```

#### `.env` configuration

```env
# SQLite (easiest for local dev — no DB install required)
DATABASE_URL=sqlite:///taskflow.db

# MySQL (production)
# DATABASE_URL=mysql+pymysql://user:password@host:3306/dbname

SECRET_KEY=your-long-random-secret-key
FRONTEND_URL=http://localhost:3000
```

```bash
# Initialize database tables (run once)
python init_db.py

# Start the backend
python app.py
# → Running on http://localhost:5000
```

---

### 2 — Frontend Setup

```bash
cd taskflow/frontend

# Install dependencies
npm install

# (Optional) set API URL if backend is not on localhost:5000
# Create .env.local:  REACT_APP_API_URL=http://localhost:5000

# Start the dev server
npm start
# → Opens http://localhost:3000
```

---

## 🌐 REST API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register a new user |
| POST | `/login`  | ❌ | Login, returns JWT |
| GET  | `/me`     | ✅ | Current user info |
| GET  | `/users`  | ✅ | List all users |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/projects`         | ✅ Any   | List all projects |
| POST   | `/projects`         | ✅ Admin | Create project |
| GET    | `/projects/:id`     | ✅ Any   | Get single project |
| PUT    | `/projects/:id`     | ✅ Admin | Update project |
| DELETE | `/projects/:id`     | ✅ Admin | Delete project + tasks |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET    | `/tasks/all`        | ✅ Any   | All tasks (dashboard) |
| GET    | `/tasks/:project_id`| ✅ Any   | Tasks for a project |
| POST   | `/tasks`            | ✅ Admin | Create task |
| PUT    | `/tasks/:id`        | ✅ Any   | Update status (member) / full update (admin) |
| DELETE | `/tasks/:id`        | ✅ Admin | Delete task |

---

## ☁️ Deploy to Railway

### Backend
1. Push the `backend/` folder to a GitHub repo  
2. Create a new Railway project → **Deploy from GitHub**  
3. Add environment variables in the Railway dashboard:
   - `DATABASE_URL` (Railway provides a MySQL/PostgreSQL plugin)
   - `SECRET_KEY`
   - `FRONTEND_URL` (your Vercel/Netlify URL)
4. Railway auto-detects the `Procfile` and runs `gunicorn app:app`

### Frontend
1. Push the `frontend/` folder to GitHub  
2. Deploy to **Vercel** or **Netlify**  
3. Set environment variable:  
   `REACT_APP_API_URL=https://your-railway-backend.up.railway.app`

---

## 🔑 Role Permissions

| Action | Admin | Member |
|---|---|---|
| View projects | ✅ | ✅ |
| Create project | ✅ | ❌ |
| Delete project | ✅ | ❌ |
| View tasks | ✅ | ✅ |
| Create task | ✅ | ❌ |
| Assign task | ✅ | ❌ |
| Update task status | ✅ | ✅ |
| Delete task | ✅ | ❌ |

---

## 🛠 Tech Stack

**Backend:** Flask · Flask-SQLAlchemy · Flask-Bcrypt · PyJWT · Flask-CORS  
**Frontend:** React 18 · React Router 6 · Axios  
**Database:** SQLite (dev) / MySQL (prod)  
**Deploy:** Railway (backend) · Vercel/Netlify (frontend)
