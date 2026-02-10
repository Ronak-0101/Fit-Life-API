const express = require('express');
const applyMiddlewares = require('./middleware/appMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const routes = require('./routes');

const app = express();

applyMiddlewares(app);

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;