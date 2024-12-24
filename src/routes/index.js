const { Router } = require('express')


const usersRouter = require('./users.router.js');
const petsRouter = require('./pets.router.js');
const adoptionsRouter = require('./adoption.router.js');
const sessionsRouter = require('./sessions.router.js');
const pruebasRouter = require('./pruebas.router.js')
const mocksRouter = require('./mocks.router.js')
const loggerRouter = require('./logger.router.js');  // Importamos las rutas de logger


const router = Router()

router.use('/api/users',usersRouter);
router.use('/api/pets',petsRouter);
router.use('/api/adoptions',adoptionsRouter);
router.use('/api/sessions',sessionsRouter);
router.use('/api/mocks',mocksRouter);
router.use('/api', loggerRouter);
router.use("/pruebas", pruebasRouter)

module.exports = router