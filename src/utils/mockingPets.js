const { faker } = require('@faker-js/faker')

const generatePet = () => {
    return {
        name: faker.animal.dog(),
        specie: 'dog',  // Esto puede ser modificado para otros tipos de animales si es necesario
        birthDate: faker.date.past(5),  // Generar una fecha de nacimiento aleatoria dentro de los últimos 5 años
        adopted: false,  // Las mascotas creadas no están adoptadas por defecto
        owner: null,  // Sin dueño, ya que según el enunciado no se asigna dueño
        image: `https://source.unsplash.com/1600x900/?animals,pet`,  // Imagen aleatoria de animales desde Unsplash
    };
};

// Función para generar una cantidad específica de mascotas
exports.generatePets = (numPets) => {
    let pets = [];
    for (let i = 0; i < numPets; i++) {
        pets.push(generatePet());
    }
    return pets;
};

