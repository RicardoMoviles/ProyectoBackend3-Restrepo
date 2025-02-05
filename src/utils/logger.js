const winston = require('winston');
const { configObject } = require('../config/index.js')

const { node_env } = configObject

const customLevelOptions = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'green',
        http: 'magenta',
        info: 'blue',
        warn: 'yellow',
        error: 'red',
        fatal: 'red'
    },
};

const environment = node_env || 'development'; // Por defecto, 'development'

const transports = [];

if (environment === 'development') {
    // Logger para desarrollo (solo consola, desde nivel debug)
    transports.push(
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    );
} else {
    // Logger para producción (console y archivo)
    transports.push(
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    );
}

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: transports
});

module.exports = {
    logger
};
