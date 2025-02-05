const { usersService } = require("../services/index.js");
const { CustomError } = require("../utils/Error/CustomError.js");
const { EError } = require("../utils/Error/enums.js");
const { generateUserInfo } = require("../utils/Error/info.js");
const { createHash } = require("../utils/index.js");

const getAllUsers = async (req, res) => {
    try {
        req.logger.info("Fetching all users...");  // Log de inicio de la operación
        const users = await usersService.getAll();
        req.logger.info(`Fetched ${users.length} users`);  // Log con el resultado de la operación
        res.send({ status: "success", payload: users });
    } catch (error) {
        req.logger.error(`Error fetching users: ${error.message}`);  // Log de error
        CustomError.createError({
            name: 'Database Error',
            cause: error,
            message: 'Error fetching users from the database.',
            code: EError.DATABASE_ERROR
        });
    }
}

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.uid;
        req.logger.info(`Fetching user with ID: ${userId}`);

        const user = await usersService.getUserById(userId);
        if (!user) {
            req.logger.warn(`User not found with ID: ${userId}`);
            // Ahora, en vez de lanzar el error, lo pasamos a `next`
            return next(CustomError.createError({
                name: 'UserNotFound',
                cause: `User ID: ${userId}`,
                message: 'User not found.',
                code: EError.NOT_FOUND_ERROR
            }));
        }

        req.logger.info(`Fetched user with ID: ${userId}`);
        return res.status(200).send({ status: "success", payload: user });
    } catch (error) {
        req.logger.error(`Error fetching user: ${error.message}`);
        // De nuevo, pasamos el error a `next`
        return next(CustomError.createError({
            name: 'Database Error',
            cause: error.message,
            message: 'Error fetching the user from the database.',
            code: EError.DATABASE_ERROR
        }));
    }
};

const createUser = async (req, res, next) => {
    try {
        const { first_name, last_name, password, email } = req.body;
        req.logger.info(`Creating user: ${first_name} ${last_name}, Email: ${email}`);  // Log de intento de creación

        if (!first_name || !last_name || !email) {
            req.logger.warn('Incomplete data for user creation');  // Log de advertencia si los datos son incompletos
            // Pasar el error al middleware de manejo de errores
            return next(CustomError.createError({
                name: 'User creation error',
                cause: generateUserInfo({ first_name, last_name, email }),
                message: 'Error typing to create user',
                code: EError.INVALID_TYPE_ERROR
            }));
        }

        // Verificar si el usuario ya existe
        const existingUser = await usersService.getUserByEmail(email);
        if (existingUser) {
            req.logger.warn(`User already exists with email: ${email}`);  // Log de advertencia si el usuario ya existe
            return next(CustomError.createError({
                name: 'Duplicate User',
                cause: `User with email: ${email}`,
                message: 'User already exists.',
                code: EError.ALREADY_EXISTS_ERROR
            }));
        }

        const newUser = {
            first_name: first_name,
            last_name: last_name,
            password: await createHash(password),
            email: email
        };

        const result = await usersService.create(newUser);
        req.logger.info(`User created successfully: ${JSON.stringify(result)}`);  // Log de éxito al crear el usuario
        res.send({ status: "success", message: "User created" });
    } catch (error) {
        req.logger.error(`Error creating user: ${error.message}`);  // Log de error
        next(error);
    }
}

const updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;

    req.logger.info(`Updating user with ID: ${userId}`);  // Log de inicio de la actualización

    const user = await usersService.getUserById(userId);
    if (!user) {
        req.logger.warn(`User not found with ID: ${userId}`);  // Log de advertencia si no se encuentra el usuario
        return res.status(404).send({ status: "error", error: "User not found" });
    }

    const result = await usersService.update(userId, updateBody);
    req.logger.info(`User updated successfully with ID: ${userId}`);  // Log de éxito al actualizar
    res.send({ status: "success", message: "User updated" });
}

const deleteUser = async (req, res) => {
    const userId = req.params.uid;

    req.logger.info(`Deleting user with ID: ${userId}`);  // Log de inicio de eliminación

    const result = await usersService.getUserById(userId);
    if (!result) {
        req.logger.warn(`User not found with ID: ${userId}`);  // Log de advertencia si no se encuentra el usuario
        return res.status(404).send({ status: "error", error: "User not found" });
    }

    await usersService.delete(userId);
    req.logger.info(`User deleted with ID: ${userId}`);  // Log de éxito al eliminar
    res.send({ status: "success", message: "User deleted" });
}

module.exports = {
    deleteUser,
    getAllUsers,
    createUser,
    getUser,
    updateUser
};
