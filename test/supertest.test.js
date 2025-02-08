const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing Users API', () => {

    let createdUserId;  // Variable para almacenar el _id del usuario creado

    describe('GET /api/users', () => {
        it('Debe devolver todos los usuarios correctamente', async () => {
            const { statusCode, body } = await requester.get('/api/users');

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.payload).to.be.an('array');
            expect(body.payload.length).to.be.greaterThan(0);  // Suponiendo que ya hay usuarios en la DB

            // Verifica que cada usuario tenga las propiedades correctas
            body.payload.forEach(user => {
                expect(user).to.have.property('_id');
                expect(user).to.have.property('first_name');
                expect(user).to.have.property('last_name');
                expect(user).to.have.property('email');
                expect(user).to.have.property('password'); // Si no deseas que la contraseña esté en la respuesta, ajusta la validación
            });
        });
    });

    describe('GET /api/users/:uid', () => {
        it('Debe devolver un usuario por su ID', async () => {
            const userId = '676b92f09b2851d107e08197';  // Asume que este ID existe
            const { statusCode, body } = await requester.get(`/api/users/${userId}`);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.payload).to.have.property('_id', userId);
        });

        it('Debe devolver un error 404 si el usuario no existe', async () => {
            const userId = '676b92f09b2851d107e08191';
            const { statusCode, body } = await requester.get(`/api/users/${userId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('User not found');
        });
    });

    describe('POST /api/users', () => {
        it('Debe crear un nuevo usuario correctamente', async () => {
            const newUser = {
                first_name: 'Juan',
                last_name: 'Pérez',
                email: 'juanperez@gmail.com',
                password: '123456'
            };

            const { statusCode, body } = await requester.post('/api/users').send(newUser);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('User created');

            // Guarda el _id del usuario creado en la variable createdUserId
            createdUserId = body.payload;  // Suponiendo que el _id está en la propiedad payload
        });

        it('Debe devolver un error 400 si faltan datos para la creación del usuario', async () => {
            const newUser = {
                first_name: 'Juan',
                email: 'juanperez@gmail.com'  // Faltando "last_name"
            };

            const { statusCode, body } = await requester.post('/api/users').send(newUser);

            expect(statusCode).to.equal(400);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Error typing to create user');
        });
    });

    describe('PUT /api/users/:uid', () => {
        it('Debe actualizar un usuario correctamente', async () => {
            const userId = '676b92f09b2851d107e0819a';  // Asegúrate de que este ID exista
            const updateData = { last_name: 'González' };

            const { statusCode, body } = await requester.put(`/api/users/${createdUserId}`).send(updateData);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('User updated');
        });

        it('Debe devolver un error 404 si el usuario a actualizar no existe', async () => {
            const userId = '676b92f09b2851d107e08190';
            const updateData = { last_name: 'González' };

            const { statusCode, body } = await requester.put(`/api/users/${userId}`).send(updateData);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('User not found');
        });
    });

    describe('DELETE /api/users/:uid', () => {
        it('Debe eliminar un usuario correctamente', async () => {
            const { statusCode, body } = await requester.delete(`/api/users/${createdUserId}`);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('User deleted');
        });

        it('Debe devolver un error 404 si el usuario a eliminar no existe', async () => {
            const userId = '676b92f09b2851d107e08190';

            const { statusCode, body } = await requester.delete(`/api/users/${userId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('User not found');
        });
    });

});

describe('Testing Pets API', () => {

    let createdPetId;  // Variable para almacenar el _id de la mascota creada

    describe('GET /api/pets', () => {
        it('Debe devolver todas las mascotas correctamente', async () => {
            const { statusCode, body } = await requester.get('/api/pets');

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.payload).to.be.an('array');
            expect(body.payload.length).to.be.greaterThan(0);  // Suponiendo que ya hay mascotas en la DB

            // Verifica que cada mascota tenga las propiedades correctas
            body.payload.forEach(pet => {
                expect(pet).to.have.property('_id');
                expect(pet).to.have.property('name');
                expect(pet).to.have.property('specie');
                expect(pet).to.have.property('birthDate');
            });

        });
    });

    describe('POST /api/pets', () => {
        it('Debe crear una nueva mascota correctamente', async () => {
            const newPet = {
                name: 'Firulais',
                specie: 'Dog',
                birthDate: '2020-01-01'
            };

            const { statusCode, body } = await requester.post('/api/pets').send(newPet);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet created');

            // Guarda el _id de la mascota creada en la variable createdPetId
            createdPetId = body.payload._id;  // Suponiendo que el _id está en la propiedad payload
        });

        it('Debe devolver un error 400 si faltan datos para la creación de la mascota', async () => {
            const newPet = {
                name: 'Firulais',
                specie: 'Dog'  // Faltando "birthDate"
            };

            const { statusCode, body } = await requester.post('/api/pets').send(newPet);

            expect(statusCode).to.equal(400);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Incomplete or invalid data for pet creation');
        });
    });

    describe('PUT /api/pets/:pid', () => {
        it('Debe actualizar una mascota correctamente', async () => {
            const petId = createdPetId;  // Usando el ID de la mascota creada
            const updateData = { name: 'Max' };

            const { statusCode, body } = await requester.put(`/api/pets/${petId}`).send(updateData);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet updated');
        });

        it('Debe devolver un error 404 si la mascota a actualizar no existe', async () => {
            const petId = '676b92f09b2851d107e08190';  // Un ID que no exista
            const updateData = { name: 'Max' };

            const { statusCode, body } = await requester.put(`/api/pets/${petId}`).send(updateData);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Pet not found');
        });
    });

    describe('DELETE /api/pets/:pid', () => {
        it('Debe eliminar una mascota correctamente', async () => {
            const petId = createdPetId;  // Usando el ID de la mascota creada

            const { statusCode, body } = await requester.delete(`/api/pets/${petId}`);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet deleted');
        });

        it('Debe devolver un error 404 si la mascota a eliminar no existe', async () => {
            const petId = '676b92f09b2851d107e08190';  // Un ID que no exista

            const { statusCode, body } = await requester.delete(`/api/pets/${petId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Pet not found');
        });
    });

    describe('POST /api/pets/withimage', () => {
        it('Debe crear una mascota con imagen correctamente', async () => {
            const newPetWithImage = {
                name: 'Rex',
                specie: 'Dog',
                birthDate: '2019-01-01'
            };

            // Usamos un archivo de prueba en lugar de uno real para esta prueba
            const { statusCode, body } = await requester
                .post('/api/pets/withimage')
                .field('name', newPetWithImage.name)
                .field('specie', newPetWithImage.specie)
                .field('birthDate', newPetWithImage.birthDate)
                .attach('image', 'test/testFiles/testImage.jpg');  // Asume que testImage.jpg es un archivo de imagen en el directorio `testFiles`

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet created');
        });

    });

});

describe('Testing Adoptions API', () => {
    let createdUserId;  // Variable para almacenar el _id del usuario creado
    let createdPetId;   // Variable para almacenar el _id de la mascota creada
    let createdAdoptionId;

    //Crear un usuario y una mascota para pruebas previas
    before(async () => {
        const newUser = {
            first_name: 'Juan',
            last_name: 'Pérez',
            email: 'juanperez@gmail.com',
            password: '123456'
        };
        const { body } = await requester.post('/api/users').send(newUser);
        createdUserId = body.payload;

        const newPet = {
            name: 'Firulais',
            specie: 'Dog',
            birthDate: '2020-01-01'
        };
        const petResponse = await requester.post('/api/pets').send(newPet);
        createdPetId = petResponse.body.payload._id;
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debe crear una adopción correctamente', async () => {
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${createdUserId}/${createdPetId}`);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.message).to.equal('Pet adopted');
            createdAdoptionId = body.payload._id;
        });

        it('Debe devolver un error 404 si el usuario no existe', async () => {
            const nonExistentUserId = '676b92f09b2851d107e08194';  // ID inexistente
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${nonExistentUserId}/${createdPetId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('user Not found');
        });

        it('Debe devolver un error 404 si la mascota no existe', async () => {
            const nonExistentPetId = '676b92f09b2851d107e08197';  // ID inexistente
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${createdUserId}/${nonExistentPetId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Pet not found');
        });

        it('Debe devolver un error 400 si la mascota ya está adoptada', async () => {
            // Adoptar la mascota una vez
            await requester.post(`/api/adoptions/${createdUserId}/${createdPetId}`);

            // Intentar adoptar la misma mascota de nuevo
            const { statusCode, body } = await requester
                .post(`/api/adoptions/${createdUserId}/${createdPetId}`);

            expect(statusCode).to.equal(400);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Pet is already adopted');
        });
    });

    describe('GET /api/adoptions', () => {
        it('Debe devolver todas las adopciones correctamente', async () => {
            const { statusCode, body } = await requester.get('/api/adoptions');

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.payload).to.be.an('array');
            expect(body.payload.length).to.be.greaterThan(0);
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debe devolver una adopción por su ID', async () => {
            const { statusCode, body } = await requester.get(`/api/adoptions/${createdAdoptionId}`);

            expect(statusCode).to.equal(200);
            expect(body.status).to.equal('success');
            expect(body.payload).to.have.property('owner');
            expect(body.payload).to.have.property('pet');
        });

        it('Debe devolver un error 404 si la adopción no existe', async () => {
            const nonExistentAdoptionId = '676b92f09b2851d107e08197';  // ID inexistente
            const { statusCode, body } = await requester.get(`/api/adoptions/${nonExistentAdoptionId}`);

            expect(statusCode).to.equal(404);
            expect(body.status).to.equal('error');
            expect(body.error).to.include('Adoption not found');
        });
    });

    // Limpiar solo al final de todas las pruebas
    after(async () => {
        // Eliminar adopción
        await requester.delete(`/api/adoptions/${createdAdoptionId}`);

        // Eliminar mascota
        await requester.delete(`/api/pets/${createdPetId}`);

        // Eliminar usuario
        await requester.delete(`/api/users/${createdUserId}`);
    });
});

