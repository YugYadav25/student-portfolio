const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const normalizeTask = (task) => ({ ...task, id: task._id || task.id });

// Helper to get auth headers
const getAuthHeaders = (headers = {}) => {
    const token = localStorage.getItem('token');
    if (token) {
        return { ...headers, 'Authorization': `Bearer ${token}` };
    }
    return headers;
};

// Helper to handle 401 responses
const handleResponse = async (res) => {
    if (res.status === 401) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth_error')); // Custom event to trigger logout in UI
        throw new Error('Unauthorized or token expired. Please log in again.');
    }
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }
    return res.json();
};

export const loginUser = (credentials) => {
    return fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(handleResponse);
};

export const registerUser = (credentials) => {
    return fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }).then(handleResponse);
};

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(data => data.map(normalizeTask));
};

export const createTask = (task) => {
    const taskPayload = { ...task };
    delete taskPayload.id;
    return fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(taskPayload)
    }).then(handleResponse).then(normalizeTask);
};

export const updateTask = (id, updates) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates)
    }).then(handleResponse).then(normalizeTask);
};

export const deleteTask = (id) => {
    return fetch(`${BASE_URL}/tasks/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse).then(normalizeTask);
};

export const generateTaskDescription = (title) => {
    return fetch(`${BASE_URL}/api/ai/generate-description`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ title })
    }).then(handleResponse);
};
