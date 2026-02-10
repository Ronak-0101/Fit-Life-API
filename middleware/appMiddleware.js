const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const applyMiddleware = (app) => {
    // Security middleware
    app.use(helmet());
    app.use(cors({
        origin: [
            'http://localhost:3000', 
            'http://localhost:8081',
            'http://localhost:5555', // Flutter web default
            'exp://192.168.x.x:8081' // Expo go
        ], // Flutter web & mobile
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    });
    app.use('/api/', limiter);

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
}

module.exports = applyMiddleware;