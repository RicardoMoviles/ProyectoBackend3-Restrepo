const bcrypt = require('bcrypt');
//const { fileURLToPath } = require('url');
//const { dirname } = require('path');

// Funciones exportadas
const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
};

const passwordValidation = async (user, password) => bcrypt.compare(password, user.password);

// Definir __dirname y __filename
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);

// Exportar las funciones y variables
module.exports = {
    createHash,
    passwordValidation,
};
