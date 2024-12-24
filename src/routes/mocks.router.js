const { Router } = require('express')
const { generatePets } = require('../utils/mockingPets');

const router = Router()

// Endpoint para generar mascotas mockeadas
router.get('/mockingpets', (req, res, next) => {
    try {
        const numPets = parseInt(req.query.num || '100');  // Por defecto generamos 100 mascotas si no se especifica
        logger.info(`Generando ${numPets} mascotas...`);  // Log para confirmar el número de mascotas a generar

        if (isNaN(numPets) || numPets <= 0) {
            throw new Error("El parámetro 'num' debe ser un número válido mayor que 0");
        }

        const pets = generatePets(numPets);  // Llamamos a la función para generar las mascotas
        logger.info(`Generadas ${pets.length} mascotas.`);  // Verifica cuántas mascotas se generaron

        res.json(pets);  // Devolvemos la lista de mascotas como respuesta
    } catch (err) {
        logger.error("Error en el endpoint:", err);  // Log para capturar el error
        next(err);  // Pasamos el error al middleware de manejo de errores
    }
});


module.exports = router