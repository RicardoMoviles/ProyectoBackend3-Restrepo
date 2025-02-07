const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/c72830')

describe('Testing Users API', () => {

  let createdUserId;  // Variable para almacenar el _id del usuario creado

  describe('GET /api/users', () => {
    it('Debe devolver todos los usuarios correctamente', async () => {
      const { statusCode, body } = await requester.get('/api/users');
      
      expect(statusCode).to.equal(200);
      expect(body.status).to.equal('success');
      expect(body.payload).to.be.an('array');
      expect(body.payload.length).to.be.greaterThan(0);  // Suponiendo que ya hay usuarios en la DB
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
      const userId = '676b92f09b2851d107e0819a';  // Asegúrate de que este ID exista

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
  