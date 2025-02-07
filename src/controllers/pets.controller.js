const PetDTO = require("../dto/Pet.dto.js");
const { petsService } = require("../services/index.js");
const { CustomError } = require("../utils/Error/CustomError.js");
const { EError } = require("../utils/Error/enums.js");
const { generatePetInfo, generateDatabaseErrorInfo, generateDuplicateInfo } = require("../utils/Error/info.js");

const getAllPets = async (req, res, next) => {
    try {
        req.logger.info("Fetching all pets...");  // Log de inicio de la operación

        const pets = await petsService.getAll();
        
        req.logger.info(`Fetched ${pets.length} pets`);  // Log del resultado de la operación
        res.send({ status: "success", payload: pets });
    } catch (error) {
        req.logger.error(`Error fetching pets: ${error.message}`);  // Log del error
        return next(CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error fetching pets from the database.',
            code: EError.DATABASE_ERROR
        }));
    }
}

const createPet = async(req, res, next) => {
    const { name, specie, birthDate } = req.body;
    req.logger.info(`Creating pet with data: ${JSON.stringify({ name, specie, birthDate })}`);  // Log de inicio de la operación

    if (!name || !specie || !birthDate) {
        req.logger.warn('Incomplete data for pet creation');  // Log de advertencia en caso de datos incompletos
        return next(CustomError.createError({
            name: 'Pet creation error',
            cause: generatePetInfo({ name, specie, birthDate }),
            message: 'Incomplete or invalid data for pet creation',
            code: EError.INVALID_TYPE_ERROR
        }));
    }

    // Verificar si la mascota ya existe
    const existingPet = await petsService.getPetByName(name);
    if (existingPet) {
        req.logger.warn(`Pet with name ${name} already exists.`);  // Log de advertencia por duplicado
        return next(CustomError.createError({
            name: 'Duplicate Pet',
            cause: generateDuplicateInfo('Pet', name),
            message: 'Pet with this name already exists.',
            code: EError.ALREADY_EXISTS_ERROR
        }));
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    try {
        const result = await petsService.create(pet);
        req.logger.info(`Pet created successfully with ID: ${result._id}`);  // Log de éxito
        res.send({ status: "success", payload: result, message: "Pet created" });
    } catch (error) {
        req.logger.error(`Error creating pet: ${error.message}`);  // Log de error
        return next(CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error creating pet in the database.',
            code: EError.DATABASE_ERROR
        }));
    }
}

const updatePet = async (req, res, next) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    req.logger.info(`Updating pet with ID: ${petId} and data: ${JSON.stringify(petUpdateBody)}`);  // Log de inicio de la operación

    const pet = await petsService.getPetById(petId);

    if (!pet) {
        req.logger.warn(`Pet with ID: ${petId} not found`);  // Log de advertencia si no se encuentra la mascota
        return next(CustomError.createError({
            name: 'Pet Not Found',
            cause: `Pet ID: ${petId}`,
            message: 'Pet not found.',
            code: EError.NOT_FOUND_ERROR
        }));
    }

    try {
        const result = await petsService.update(petId, petUpdateBody);
        req.logger.info(`Pet with ID: ${petId} updated successfully`);  // Log de éxito
        res.send({ status: "success", message: "Pet updated" });
    } catch (error) {
        req.logger.error(`Error updating pet: ${error.message}`);  // Log de error
        return next(CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error updating pet in the database.',
            code: EError.DATABASE_ERROR
        }));
    }
}

const deletePet = async (req, res, next) => {
    const petId = req.params.pid;

    req.logger.info(`Deleting pet with ID: ${petId}`);  // Log de inicio de la operación

    try {
        // Verificar si la mascota existe antes de intentar eliminarla
        const pet = await petsService.getPetById(petId);  // Verifica si la mascota existe
        
        if (!pet) {
            req.logger.warn(`Pet with ID: ${petId} not found`);  // Log si no se encuentra la mascota
            // Lanzar un error para el middleware de manejo de errores
            return next(CustomError.createError({
                name: 'Pet Not Found',
                cause: `Pet ID: ${petId}`,
                message: 'Pet not found',
                code: EError.NOT_FOUND_ERROR
            }));
        }

        // Si la mascota existe, proceder con la eliminación
        await petsService.delete(petId);
        
        req.logger.info(`Pet with ID: ${petId} deleted successfully`);  // Log de éxito
        res.status(200).send({ 
            status: 'success', 
            message: 'Pet deleted' 
        });
    } catch (error) {
        req.logger.error(`Error deleting pet: ${error.message}`);  // Log de error
        // Si ocurre un error, pasarlo al middleware de manejo de errores
        return next(CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error deleting pet from the database.',
            code: EError.DATABASE_ERROR
        }));
    }
};

const createPetWithImage = async(req, res, next) => {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    req.logger.info(`Creating pet with image and data: ${JSON.stringify({ name, specie, birthDate })}`);  // Log de inicio

    if (!name || !specie || !birthDate) {
        req.logger.warn('Incomplete data for pet creation with image');  // Log de advertencia
        return next(CustomError.createError({
            name: 'Pet creation error',
            cause: generatePetInfo({ name, specie, birthDate }),
            message: 'Incomplete or invalid data for pet creation with image',
            code: EError.INVALID_TYPE_ERROR
        }));
    }

    req.logger.info(`File uploaded: ${file.originalname}`);  // Log de archivo subido
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image: `${__dirname}/../public/img/${file.filename}`
    });

    req.logger.info(`Pet data prepared: ${JSON.stringify(pet)}`);  // Log de la mascota preparada con imagen
    try {
        const result = await petsService.create(pet);
        req.logger.info(`Pet with image created successfully with ID: ${result._id}`);  // Log de éxito
        res.send({ status: "success", payload: result, message: "Pet created" });
    } catch (error) {
        req.logger.error(`Error creating pet with image: ${error.message}`);  // Log de error
        return next(CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error creating pet with image in the database.',
            code: EError.DATABASE_ERROR
        }));
    }
}

module.exports = {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}
