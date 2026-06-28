import axios from 'axios';

/**
 * Axios instance configured for the TaskFlow API.
 *
 * Using an instance (not global axios) means:
 * - Interceptors only apply to our API calls
 * - Base URL and headers are centralized
 * - Easy to swap out in tests
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: unwrap data and normalize errors
api.interceptors.response.use(
  (response) => response.data, // Unwrap axios envelope → get our ApiResponse directly
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';

    const errors = error.response?.data?.errors || [];

    // Attach a normalized error shape that components can use
    const normalizedError = {
      message,
      errors,
      status: error.response?.status,
    };

    return Promise.reject(normalizedError);
  }
);

// ─── Task API Methods ─────────────────────────────────────────────────────────

export const taskApi = {
  /**
   * Fetch all tasks with optional filters, search, sort, pagination
   * @param {Object} params - query parameters
   */
  getAll: (params = {}) => api.get('/tasks', { params }),

  /**
   * Fetch aggregate stats (counts per status)
   */
  getStats: () => api.get('/tasks/stats'),

  /**
   * Fetch single task by ID
   */
  getById: (id) => api.get(`/tasks/${id}`),

  /**
   * Create new task
   * @param {Object} taskData
   */
  create: (taskData) => api.post('/tasks', taskData),

  /**
   * Full update of a task
   * @param {string} id
   * @param {Object} taskData
   */
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),

  /**
   * Quick status update (lightweight PATCH)
   * @param {string} id
   * @param {string} status
   */
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),

  /**
   * Delete a task
   * @param {string} id
   */
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
