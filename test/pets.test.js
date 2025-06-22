import { expect } from 'chai';
import supertest from 'supertest';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';

const request = supertest(app);

describe('Pets API', () => {
  // Configurar la base de datos de prueba
  setupTestDB();

  describe('GET /api/pets', () => {
    it('debería obtener una lista de mascotas', async () => {
      const res = await request.get('/api/pets');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array');
    });
  });

  describe('POST /api/pets', () => {
    it('debería crear una nueva mascota', async () => {
      const petData = {
        name: 'Firulais',
        species: 'Perro',
        breed: 'Labrador',
        age: 3,
        gender: 'Macho',
        size: 'Mediano',
        description: 'Un perro muy amigable',
        status: 'Disponible'
      };

      const res = await request
        .post('/api/pets')
        .send(petData);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('name', petData.name);
      expect(res.body).to.have.property('species', petData.species);
    });

    it('debería fallar si faltan campos requeridos', async () => {
      const res = await request
        .post('/api/pets')
        .send({ name: 'Solo nombre' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('GET /api/pets/:id', () => {
    let testPet;

    beforeEach(async () => {
      // Crear una mascota de prueba
      const petData = {
        name: 'Luna',
        species: 'Gato',
        breed: 'Siamés',
        age: 2,
        gender: 'Hembra',
        size: 'Pequeño',
        description: 'Un gato muy cariñoso',
        status: 'Disponible'
      };

      const res = await request.post('/api/pets').send(petData);
      testPet = res.body;
    });

    it('debería obtener una mascota por ID', async () => {
      const res = await request.get(`/api/pets/${testPet._id}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', testPet._id);
      expect(res.body).to.have.property('name', 'Luna');
    });

    it('debería fallar con un ID inválido', async () => {
      const res = await request.get('/api/pets/invalid-id');
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
    });
  });
});
