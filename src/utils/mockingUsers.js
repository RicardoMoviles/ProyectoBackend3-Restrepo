const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

// Función para generar un usuario mockeado
const generateMockUser = async () => {
    const roles = ['user', 'admin'];
    const role = roles[Math.floor(Math.random() * roles.length)];

    // Encriptar la contraseña "coder123"
    const password = await bcrypt.hash('coder123', 10);
    
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password,  // Contraseña encriptada
        role,      // Rol aleatorio: "user" o "admin"
        pets: [],  // Array vacío para mascotas
    };
};

// Función para generar múltiples usuarios mockeados
const generateMockUsers = async (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        const user = await generateMockUser();
        users.push(user);
    }
    return users;
};

module.exports = {
    generateMockUsers
};
