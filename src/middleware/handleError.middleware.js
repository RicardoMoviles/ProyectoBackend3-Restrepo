const { EError } = require("../utils/Error/enums");

exports.handleError = (err, req, res, next) => {
    // console.log(err)
    switch (err.code) {
        case EError.INVALID_TYPE_ERROR:
            return res.status(400).send({status: 'error', error: err})
            
            break;
            
        default:
            return res.status(500).send({status: 'error', error: 'Error server'})
                
            break;
    }
}