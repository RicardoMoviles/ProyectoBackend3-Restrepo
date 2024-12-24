const dotenv = require('dotenv')
const { program } = require('../utils/commander')

const { mode } = program.opts()


dotenv.config({
    path: mode ==='production' ? './.env.production' : './.env.development'
})

// console.log(process.env.PORT)

const configObject = {
    port: process.env.PORT || 8080,
    mongo_url: process.env.MONGO_URL,
    node_env: process.env.NODE_ENV
}

module.exports = {
    configObject
}