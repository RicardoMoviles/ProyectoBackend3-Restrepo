const { logger } = require("../utils/logger.js");

const loggerTest = (req, res) => {
    // Probar todos los niveles de log
    logger.debug("Este es un log de debug");
    logger.http("Este es un log de http");
    logger.info("Este es un log de info");
    logger.warning("Este es un log de warning");
    logger.error("Este es un log de error");
    logger.fatal("Este es un log de fatal");

    res.send({
        status: "success",
        message: "Logs generados en todos los niveles. Revisa la consola y el archivo errors.log si es producción."
    });
};

module.exports = {
    loggerTest
};
