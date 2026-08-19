require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./models/Task');
const User = require('./models/User');
const auth = require('./middleware/auth');
const validateTask = require('./middleware/validateTask');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

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

// --- Auth Routes ---

// POST /register: Register a new user
app.post('/register', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        next(err);
    }
});

// POST /login: Authenticate user and return JWT
app.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Sign JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});

// GET /me: Return currently logged-in user details
app.get('/me', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
});

// --- CRUD Routes ---

// Apply auth middleware to all task routes
app.use('/tasks', auth);

// GET /tasks: Retrieve all tasks
app.get('/tasks', async (req, res, next) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (err) {
        next(err); // Pass error to global error handler
    }
});

// GET /tasks/:id: Retrieve a single task
app.get('/tasks/:id', async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (err) {
        next(err);
    }
});

// POST /tasks: Create a new task
app.post('/tasks', validateTask, async (req, res, next) => {
    try {
        const newTask = await Task.create(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        next(err);
    }
});

// PUT /tasks/:id: Update an existing task
app.put('/tasks/:id', validateTask, async (req, res, next) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Return updated doc, run schema validators
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        next(err);
    }
});

// DELETE /tasks/:id: Delete a task
app.delete('/tasks/:id', async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(deletedTask);
    } catch (err) {
        next(err);
    }
});

// Supplementary: 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Global Error handling middleware (MUST be the last middleware)
app.use((err, req, res, next) => {
    console.error('Error caught by global handler:', err.message);
    
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            error: 'Validation Error',
            details: messages
        });
    }

    // Handle invalid MongoDB ObjectId formatting
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({ error: 'Invalid Task ID format' });
    }

    res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
