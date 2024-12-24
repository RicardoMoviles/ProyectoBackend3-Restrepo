const express = require('express');
const { loggerTest } = require('../controllers/logger.controller.js');
const { addLogger } = require('../middleware/logger.middleware.js')

const router = express.Router();

// Middleware para agregar logger a cada solicitud
router.use(addLogger);

// Endpoint para probar todos los logs
router.get('/loggerTest', loggerTest);

module.exports = router;