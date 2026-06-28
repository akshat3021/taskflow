'use strict';

const express = require('express');
const router = express.Router();
const taskRoutes = require('./task.routes');

/**
 * Route aggregator — single import point for server.js.
 * As the app grows, add more route modules here.
 */
router.use('/tasks', taskRoutes);

// Health check endpoint for deployment monitoring
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
