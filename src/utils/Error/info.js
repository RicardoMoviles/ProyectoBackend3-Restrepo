exports.generateUserInfo = ( user ) => {
    return `One or more properties were incomplete or note valid
    list of required properties:
    * first_name: needs to be a String, recived ${user.first_name}
    * last_name: needs to be a String, recived ${user.last_name}
    * email: needs to be a String, recived ${user.email}
    `
}

exports.generatePetInfo = (pet) => {
    return `
        One or more properties were incomplete or not valid for the pet. 
        List of required properties:
        * name: needs to be a String, received ${pet.name}
        * species: needs to be a String, received ${pet.species}
        * breed: needs to be a String, received ${pet.breed}
        * age: needs to be a Number, received ${pet.age}
    `;
};

// Información de error para duplicados (ej: usuario ya existe)
exports.generateDuplicateInfo = (resource, identifier) => {
    return `${resource} with identifier ${identifier} already exists.`;
}

// Información de error para base de datos
exports.generateDatabaseErrorInfo = (error) => {
    return `Database operation failed. 
    Error message: ${error.message}`;
}