const { logger } = require("../utils/logger.js");  // Importamos el logger

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

module.exports = {
    addLogger
};