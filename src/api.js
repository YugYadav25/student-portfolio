const BASE_URL = 'http://localhost:5000';

const normalizeTask = (task) => ({ ...task, id: task._id || task.id });

export const getTasks = () => {
    return fetch(`${BASE_URL}/tasks`).then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks. Is the backend running?');
        return res.json();
    }).then(data => data.map(normalizeTask));
};

export const createTask = (task) => {
    return fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    }).then(res => {
        if (!res.ok) throw new Error('Failed to create task');
        return res.json();
    }).then(normalizeTask);
};

export const updateTask = (id, updates) => {
    return fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    }).then(res => {
        if (!res.ok) throw new Error('Failed to update task');
        return res.json();
    }).then(normalizeTask);
};

export const deleteTask = (id) => {
    return fetch(`${BASE_URL}/tasks/${id}`, { 
        method: 'DELETE' 
    }).then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        return res.json(); 
    }).then(normalizeTask);
};
