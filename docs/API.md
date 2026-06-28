# API Documentation — TaskFlow v1

Base URL: `http://localhost:5000/api/v1`

All responses follow this shape:
```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "title", "message": "Title is required" }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Endpoints

### GET /tasks

List tasks with filtering, searching, sorting, and pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `search` | string | - | Full-text search on title + description |
| `status` | string | all | `todo` \| `in-progress` \| `completed` |
| `priority` | string | all | `low` \| `medium` \| `high` |
| `sortBy` | string | `createdAt` | `createdAt` \| `updatedAt` \| `dueDate` \| `priority` \| `title` |
| `order` | string | `desc` | `asc` \| `desc` |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Results per page (max 100) |

**Response 200:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": {
    "tasks": [
      {
        "id": "666abc123def",
        "title": "Design landing page",
        "description": "Create Figma mockups for the homepage",
        "status": "in-progress",
        "priority": "high",
        "dueDate": "2024-02-01T00:00:00.000Z",
        "tags": ["design", "frontend"],
        "isOverdue": false,
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T11:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Design landing page",           // Required, 3-100 chars
  "description": "Create Figma mockups",    // Optional, max 500 chars
  "status": "todo",                         // Optional, default: todo
  "priority": "high",                       // Optional, default: medium
  "dueDate": "2024-02-01",                  // Optional, ISO date
  "tags": ["design", "frontend"]            // Optional, max 10 tags
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { "task": { ... } }
}
```

**Response 422 (Validation Failed):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "title", "message": "Title must be at least 3 characters" }
  ]
}
```

---

### GET /tasks/:id

Get a single task by ID.

**Response 200:** Task object  
**Response 404:** Task not found  
**Response 400:** Invalid ID format

---

### PUT /tasks/:id

Full update of a task. Send all fields.

**Request Body:** Same as POST, but all fields are optional (at least 1 required)

**Response 200:** Updated task object  
**Response 404:** Task not found

---

### PATCH /tasks/:id/status

Lightweight status-only update.

**Request Body:**
```json
{ "status": "completed" }
```

**Response 200:** Updated task object

---

### DELETE /tasks/:id

Delete a task permanently.

**Response 200:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": { "id": "666abc123def" }
}
```

---

### GET /tasks/stats

Aggregate task counts per status.

**Response 200:**
```json
{
  "success": true,
  "message": "Stats retrieved successfully",
  "data": {
    "total": 42,
    "todo": 15,
    "in-progress": 12,
    "completed": 15,
    "overdue": 3
  }
}
```

---

### GET /health

Health check endpoint for deployment monitoring.

**Response 200:**
```json
{
  "success": true,
  "message": "TaskFlow API is running",
  "environment": "production",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid format) |
| 404 | Not Found |
| 422 | Unprocessable (validation failed) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |
