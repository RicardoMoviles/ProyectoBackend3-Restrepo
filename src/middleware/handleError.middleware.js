const { EError } = require("../utils/Error/enums");

exports.handleError = (err, req, res, next) => {
    // Aquí estamos asegurándonos de que todos los errores sean capturados
    // y enviando la respuesta correspondiente.
    console.error(err);  // Puedes usar esto para ver el error en consola

    switch (err.code) {
        case EError.INVALID_TYPE_ERROR:
            return res.status(400).send({ status: 'error', error: err.message });
        
        case EError.NOT_FOUND_ERROR:
            return res.status(404).send({ status: 'error', error: err.message });
        
        case EError.DATABASE_ERROR:
            return res.status(500).send({ status: 'error', error: err.message });
        
        default:
            return res.status(500).send({ status: 'error', error: 'Internal Server Error' });
    }
};
