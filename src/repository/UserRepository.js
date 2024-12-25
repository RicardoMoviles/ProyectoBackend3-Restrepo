const GenericRepository = require("./GenericRepository.js");

class UserRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    // Método para obtener un usuario por email
    getUserByEmail = (email) => {
        return this.getBy({ email });
    };

    // Método para obtener un usuario por ID
    getUserById = (id) => {
        return this.getBy({ _id: id });
    };

    // Método para insertar múltiples usuarios
    insertUsers = (users) => {
        return this.create(users); // Llamamos al método `create` de GenericRepository
    };
}

module.exports = UserRepository;
