const validateTask = (req, res, next) => {
    // Only check for title on POST or PUT
    if (req.method === 'POST' || req.method === 'PUT') {
        const { title } = req.body;
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'Validation Error: Title is required and cannot be empty' });
        }
    }
    
    next();
};

module.exports = validateTask;
