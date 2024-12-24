const { Router } = require('express')
const { generarUsers } = require('../utils/mocks')
const { faker } = require('@faker-js/faker')

const router = Router()

router.get('/user', (req, res) => {

    res.send({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    })
})


router.get('/logger', (req, res) => {
    // req.logger.info('esto es un info')
    // req.logger.warning('esto es un warning')
    req.logger.fatal('esto es un error crítico')
    res.send('probando loggers')
})


router.get('/mocks', (req, res) => {
    let users = []
    for (let i = 0; i < 100; i++) {
        users.push(generarUsers())        
    }

    res.send({status: 'success', data: users})
})

module.exports = router