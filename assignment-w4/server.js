const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());
// Enable CORS for frontend connection
app.use(cors());

// 1. Request logging middleware (Global)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

// Supplementary: Middleware that rejects requests without Content-Type: application/json on POST/PUT
const requireJsonContent = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.is('application/json')) {
            return res.status(400).json({ error: 'Content-Type must be application/json' });
        }
    }
    next();
};

app.use(requireJsonContent);

// In-memory array for temporary storage
let tasks = [];
let nextId = 1;

// Supplementary: Route-specific middleware to validate the task ID format
const validateTaskId = (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Task ID must be a valid number' });
    }
    req.taskId = id; // pass the parsed ID to the next handler
    next();
};

// --- CRUD Routes ---

// GET /tasks: Retrieve all tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
    const { title, description, completed } = req.body;
    
    // Simple validation
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: nextId++,
        title,
        description: description || '',
        completed: completed || false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task
app.put('/tasks/:id', validateTaskId, (req, res) => {
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
});

// DELETE /tasks/:id: Delete a task
app.delete('/tasks/:id', validateTaskId, (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    res.status(200).json(deletedTask[0]); // Returns the deleted task
});

// Supplementary: 404 handler for undefined routes
// This will catch any request that doesn't match the routes defined above
app.use((req, res, next) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global Error handling middleware (MUST be the last middleware)
app.use((err, req, res, next) => {
    console.error('Global Error Handler caught an error:', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
