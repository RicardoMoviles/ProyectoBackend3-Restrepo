const GenericRepository = require("./GenericRepository.js");

class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    // Método para insertar varias mascotas
    insertPets = (pets) => {
        return this.create(pets); // Usa el método `create` de GenericRepository para insertar las mascotas
    };
}

module.exports = PetRepository;
