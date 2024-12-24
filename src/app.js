const express = require('express')
const mongoose = require('mongoose' )
const cookieParser = require('cookie-parser' )
const appRouter = require('./routes/index.js')


const cors = require('cors')
const { configObject } = require('./config/index.js')
const { fork } = require('child_process')
const { handleError } = require('./middleware/handleError.middleware.js')
const { logger } = require('./utils/logger.js')
const { addLogger} = require('./middleware/logger.middleware.js')
// importaciones de swagger 


const app = express() 
const { port, mongo_url }  = configObject

const PORT = port
mongoose.set('strictQuery', false);
const connection = mongoose.connect(mongo_url)

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(addLogger)


/* These lines of code are setting up routes in your Express application. */
app.use(appRouter)
app.use(handleError)

app.listen(PORT,()=>logger.info(`Listening on ${PORT}`))



