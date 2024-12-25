const { Router } = require('express')
const { generatePets } = require('../utils/mockingPets');
const { logger } = require('../utils/logger'); // Importa el logger que has configurado

const { generateMockUsers } = require('../utils/mockingUsers'); // Importamos la función para generar usuarios
const { usersService, petsService } = require('../services/index.js');

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

// Endpoint para generar 50 usuarios de prueba
router.get('/mockingusers', async (req, res) => {
    try {
        const numUsers = 50; // Generamos 50 usuarios
        const users = await generateMockUsers(numUsers);

        // Insertamos los usuarios generados en la base de datos
        await usersService.insertUsers(users);

        res.json({ status: 'success', message: `${numUsers} usuarios generados y agregados a la base de datos.` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al generar usuarios', error: error.message });
    }
});

// Endpoint para generar usuarios y mascotas basados en los parámetros 'users' y 'pets'
router.post('/generateData', async (req, res) => {
    try {
        const { users, pets } = req.body; // Recibimos los parámetros

        // Generar los usuarios y mascotas mockeadas
        const mockUsers = await generateMockUsers(users);
        const mockPets = await generatePets(pets); 

        // Insertar los usuarios y mascotas en la base de datos
        await usersService.insertUsers(mockUsers);
        await petsService.insertPets(mockPets); // Insertamos mascotas en la base de datos

        res.json({ status: 'success', message: `${users} usuarios y ${pets} mascotas generados y agregados a la base de datos.` });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error al generar datos', error: error.message });
    }
});



module.exports = router