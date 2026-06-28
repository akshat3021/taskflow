# TaskFlow

> Clarity in every task. Flow in every day.

A production-grade MERN stack task management application built to demonstrate real-world full-stack engineering practices.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb)](https://mongodb.com)

---

## Features

### Core (Mandatory)
- ✅ **Create Task** — Full form with validation
- ✅ **Read Tasks** — Paginated list with real-time updates
- ✅ **Update Task** — Inline editing via modal
- ✅ **Delete Task** — With confirmation dialog
- ✅ **Form Validation** — Client + server side
- ✅ **REST API** — 7 endpoints, versioned at `/api/v1`
- ✅ **MongoDB Integration** — Mongoose with indexes
- ✅ **Responsive Design** — Mobile-first, all breakpoints
- ✅ **Dynamic Updates** — No page refresh needed

### Bonus
- ✅ **Search** — Debounced full-text MongoDB search
- ✅ **Filtering** — Status and priority filters
- ✅ **Sorting** — By date, priority, title, with asc/desc
- ✅ **Toast Notifications** — 4 types with progress bar timers
- ✅ **Reusable Components** — Button, Input, Select, Badge, Modal, Skeleton
- ✅ **Environment Variables** — Both client and server
- ✅ **Loading Skeletons** — Card and stat variants
- ✅ **Error Boundary** — Graceful crash recovery
- ✅ **Clean Folder Structure** — Feature-based, scalable

---

## Project Structure

```
taskflow/
├── client/          # React + Vite frontend
└── server/          # Express + MongoDB backend
```

See [architecture doc](./docs/ARCHITECTURE.md) for the full tree.

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/taskflow.git
cd taskflow

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

**Server** (`server/.env`):
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start development servers

```bash
# Terminal 1 — Start backend
cd server && npm run dev

# Terminal 2 — Start frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List tasks (search, filter, sort, paginate) |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/:id` | Get task |
| PUT | `/api/v1/tasks/:id` | Update task |
| PATCH | `/api/v1/tasks/:id/status` | Quick status update |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| GET | `/api/v1/tasks/stats` | Get status counts |

**Query Parameters for GET /tasks:**
```
search=keyword          Full-text search
status=todo|in-progress|completed
priority=low|medium|high
sortBy=createdAt|updatedAt|dueDate|priority|title
order=asc|desc
page=1&limit=20
```

---

## Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| State Management | Context + useReducer | Right-sized for this scale |
| Styling | Vanilla CSS + CSS Variables | Zero overhead, full control |
| Validation | Joi (server) + custom (client) | Strict server truth, instant client feedback |
| API Client | Axios with interceptors | Global error normalization |
| Error Handling | Global middleware | Single error format across all routes |
| Optimistic Updates | Status toggle | Instant feedback without waiting for server |

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Connect repo to Vercel, set VITE_API_URL env var
```

### Backend → Railway / Render

```bash
# Add to Railway/Render:
NODE_ENV=production
PORT=5000
MONGODB_URI=your_atlas_connection_string
CLIENT_URL=https://your-app.vercel.app
```

### Database → MongoDB Atlas

1. Create M0 free cluster
2. Create database user
3. Whitelist IPs (0.0.0.0/0 for cloud deployments)
4. Copy connection string to `MONGODB_URI`

---

## Git Commit Strategy

```
feat: add task creation with form validation
feat: implement search with debouncing
feat: add optimistic status updates
fix: revert status on API failure
style: polish task card hover animations
chore: add environment variable examples
docs: write API documentation
```

## Future Improvements

- [ ] Drag-and-drop Kanban board view
- [ ] User authentication (JWT + refresh tokens)
- [ ] Task assignment and collaboration
- [ ] Due date reminders (push notifications)
- [ ] File attachments
- [ ] Activity log / audit trail
- [ ] Export to CSV/PDF
- [ ] Dark mode toggle
- [ ] Recurring tasks
- [ ] Unit tests (Vitest) and API tests (Jest + Supertest)
