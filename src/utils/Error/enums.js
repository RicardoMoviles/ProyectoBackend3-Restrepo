exports.EError = {
    ROUTING_ERROR: 1,               // Error en la ruta
    INVALID_TYPE_ERROR: 2,          // Error de tipo de datos
    DATABASE_ERROR: 3,              // Error en la base de datos
    NOT_FOUND_ERROR: 4,             // No encontrado
    INCOMPLETE_DATA_ERROR: 5,       // Datos incompletos
    ALREADY_EXISTS_ERROR: 6,        // Error de duplicados (ej: usuario ya existe)
    INTERNAL_SERVER_ERROR: 500      // Error interno del servidor
};