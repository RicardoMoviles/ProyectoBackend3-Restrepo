class CustomError {
    static createError ({name= 'Error', cause='', message='', code=1}){
        const error = new Error(message)
        error.name = name
        error.cause = cause
        error.code = code
        //throw error  // romper nuestro server
        return error; // Solo devolvemos el error para que lo manejes en otro lugar
    }
}

module.exports = {
    CustomError
}