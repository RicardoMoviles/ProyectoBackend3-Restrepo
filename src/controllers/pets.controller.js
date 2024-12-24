const PetDTO = require("../dto/Pet.dto.js");
const { petsService } = require("../services/index.js");
const { CustomError } = require("../utils/Error/CustomError.js");
const { EError } = require("../utils/Error/enums.js");
const { generatePetInfo, generateDatabaseErrorInfo, generateDuplicateInfo } = require("../utils/Error/info.js");

const getAllPets = async (req, res) => {
    try {
        req.logger.info("Fetching all pets...");  // Log de inicio de la operación

        const pets = await petsService.getAll();
        
        req.logger.info(`Fetched ${pets.length} pets`);  // Log del resultado de la operación
        res.send({ status: "success", payload: pets });
    } catch (error) {
        req.logger.error(`Error fetching pets: ${error.message}`);  // Log del error
        CustomError.createError({
            name: 'Database Error',
            cause: generateDatabaseErrorInfo(error),
            message: 'Error fetching pets from the database.',
            code: EError.DATABASE_ERROR
        });
    }
}

const createPet = async(req, res) => {
    const { name, specie, birthDate } = req.body;
    req.logger.info(`Creating pet with data: ${JSON.stringify({ name, specie, birthDate })}`);  // Log de inicio de la operación

    if (!name || !specie || !birthDate) {
        req.logger.warn('Incomplete data for pet creation');  // Log de advertencia en caso de datos incompletos
        return CustomError.createError({
            name: 'Pet creation error',
            cause: generatePetInfo({ name, specie, birthDate }),
            message: 'Incomplete or invalid data for pet creation',
            code: EError.INVALID_TYPE_ERROR
        });
    }

    // Verificar si la mascota ya existe
    const existingPet = await petsService.getPetByName(name);
    if (existingPet) {
        req.logger.warn(`Pet with name ${name} already exists.`);  // Log de advertencia por duplicado
        return CustomError.createError({
            name: 'Duplicate Pet',
            cause: generateDuplicateInfo('Pet', name),
            message: 'Pet with this name already exists.',
            code: EError.ALREADY_EXISTS_ERROR
        });
    }

    const pet = PetDTO.getPetInputFrom({ name, specie, birthDate });
    const result = await petsService.create(pet);
    
    req.logger.info(`Pet created successfully with ID: ${result._id}`);  // Log de éxito
    res.send({ status: "success", payload: result });
}

const updatePet = async (req, res) => {
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    req.logger.info(`Updating pet with ID: ${petId} and data: ${JSON.stringify(petUpdateBody)}`);  // Log de inicio de la operación

    const pet = await petsService.getPetById(petId);

    if (!pet) {
        req.logger.warn(`Pet with ID: ${petId} not found`);  // Log de advertencia si no se encuentra la mascota
        return CustomError.createError({
            name: 'Pet Not Found',
            cause: `Pet ID: ${petId}`,
            message: 'Pet not found.',
            code: EError.NOT_FOUND_ERROR
        });
    }

    const result = await petsService.update(petId, petUpdateBody);
    req.logger.info(`Pet with ID: ${petId} updated successfully`);  // Log de éxito
    res.send({ status: "success", message: "Pet updated" });
}

const deletePet = async(req, res) => {
    const petId = req.params.pid;

    req.logger.info(`Deleting pet with ID: ${petId}`);  // Log de inicio de la operación

    const result = await petsService.delete(petId);
    
    req.logger.info(`Pet with ID: ${petId} deleted successfully`);  // Log de éxito
    res.send({ status: "success", message: "Pet deleted" });
}

const createPetWithImage = async(req, res) => {
    const file = req.file;
    const { name, specie, birthDate } = req.body;

    req.logger.info(`Creating pet with image and data: ${JSON.stringify({ name, specie, birthDate })}`);  // Log de inicio

    if (!name || !specie || !birthDate) {
        req.logger.warn('Incomplete data for pet creation with image');  // Log de advertencia
        return CustomError.createError({
            name: 'Pet creation error',
            cause: generatePetInfo({ name, specie, birthDate }),
            message: 'Incomplete or invalid data for pet creation with image',
            code: EError.INVALID_TYPE_ERROR
        });
    }

    req.logger.info(`File uploaded: ${file.originalname}`);  // Log de archivo subido
    const pet = PetDTO.getPetInputFrom({
        name,
        specie,
        birthDate,
        image: `${__dirname}/../public/img/${file.filename}`
    });

    req.logger.info(`Pet data prepared: ${JSON.stringify(pet)}`);  // Log de la mascota preparada con imagen
    const result = await petsService.create(pet);
    
    req.logger.info(`Pet with image created successfully with ID: ${result._id}`);  // Log de éxito
    res.send({ status: "success", payload: result });
}

module.exports = {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}
