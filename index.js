require('dotenv').config();

const express = require('express');
const path = require('node:path');

const app = express();

app.use((req, res, next) => {
    const startedAt = Date.now();

    res.on('finish', () => {
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
    });

    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/user', (req, res) => {
    const { name, email } = req.body ?? {};

    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({
            error: 'Both name and email are required.',
        });
    }

    return res.send(`Hello, ${name.trim()}!`);
});

app.get('/user/:id', (req, res) => {
    res.send(`User ${req.params.id} profile`);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof SyntaxError && err.status === 400 && Object.hasOwn(err, 'body')) {
        return res.status(400).json({ error: 'Invalid JSON.' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
});

if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`My Week 2 API is running on port ${port}`);
    });
}

module.exports = app;
