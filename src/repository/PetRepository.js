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

    // Obtener una mascota por ID
    getPetById = async (id) => {
        return await this.dao.getBy({ _id: id });  // Suponiendo que tu DAO tiene un método `getBy` que puede buscar por ID
    };

    // Actualizar una mascota por ID
    update = async (id, doc) => {
        return await this.dao.update(id, doc);  // Usa el método `update` del repositorio genérico
    };
}

module.exports = PetRepository;
