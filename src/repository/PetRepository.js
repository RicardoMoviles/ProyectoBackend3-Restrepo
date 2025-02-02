const GenericRepository = require("./GenericRepository.js");

class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    // Método para insertar varias mascotas
    insertPets = (pets) => {
        return this.create(pets); // Usa el método `create` de GenericRepository para insertar las mascotas
    };

    // Nuevo método: Obtener una mascota por nombre
    getPetByName = async (name) => {
        // Suponiendo que tu DAO tiene un método `getBy` que puede buscar por un campo específico
        return await this.dao.getBy({ name });  // Busca la mascota por su nombre
    };
}

module.exports = PetRepository;
