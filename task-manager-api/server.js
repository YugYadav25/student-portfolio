require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Task = require('./models/Task');
const User = require('./models/User');
const auth = require('./middleware/auth');
const validateTask = require('./middleware/validateTask');

const app = express();
const port = process.env.PORT || 5000;
const aiRequestTimes = new Map();
const AI_RATE_LIMIT_MS = 60 * 1000;

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

// GET /health: Verify that the API process is available
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// POST /api/ai/generate-description: Generate an editable task description
app.post('/api/ai/generate-description', auth, async (req, res) => {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    const rateLimitKey = `${req.user.id}:${title.toLowerCase()}`;
    const lastRequestAt = aiRequestTimes.get(rateLimitKey);
    if (lastRequestAt && Date.now() - lastRequestAt < AI_RATE_LIMIT_MS) {
        return res.status(429).json({
            error: 'Please wait one minute before generating another description for this task.'
        });
    }

    aiRequestTimes.set(rateLimitKey, Date.now());
    if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
            description: 'AI suggestions are unavailable. Please add a description manually.',
            fallback: true
        });
    }

    try {
        const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = client.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
        });
        const result = await model.generateContent(
            `Write a concise, practical task description for: ${title}`
        );
        const description = result.response.text().trim();

        if (!description) {
            throw new Error('AI provider returned an empty description');
        }

        return res.status(200).json({ description, fallback: false });
    } catch (err) {
        console.error('AI description generation failed:', err.message);
        const isAuthenticationError = /api key|unauthorized|permission|forbidden/i.test(err.message);
        return res.status(isAuthenticationError ? 502 : 503).json({
            error: isAuthenticationError
                ? 'Gemini API key is invalid or does not have access. Update GEMINI_API_KEY and restart the backend.'
                : 'Gemini is temporarily unavailable. Please try again or add a description manually.'
        });
    }
});

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
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
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

const startServer = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

if (require.main === module) {
    startServer().catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exitCode = 1;
    });
}

module.exports = { app, startServer };
