const validateTask = (req, res, next) => {
    if (req.method === 'POST') {
        const { title } = req.body;
        
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({ error: 'Validation Error: Title is required and cannot be empty' });
        }
    }

    if (req.method === 'PUT' && req.body.title !== undefined &&
        (typeof req.body.title !== 'string' || req.body.title.trim() === '')) {
        return res.status(400).json({ error: 'Validation Error: Title cannot be empty' });
    }
    
    next();
};

module.exports = validateTask;
