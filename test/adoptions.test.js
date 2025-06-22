import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import { setupTestDB, clearDB, closeDB } from './config/test.config.js';
import { generateUserData, generatePetData } from './utils/test.utils.js';

const request = supertest(app);

describe('Adoptions API', () => {
  let authToken;
  let testUser;
  let testPet;

  // Configurar la base de datos de prueba
  setupTestDB();

  before(async () => {
    // Registrar un usuario de prueba y obtener token
    const userData = generateUserData({
      email: 'adoption.tester@example.com',
      password: 'test123'
    });

    // Registrar el usuario
    const registerRes = await request.post('/api/sessions/register').send(userData);
    
    // Iniciar sesión para obtener el token
    const loginRes = await request
      .post('/api/sessions/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginRes.body.token;
    
    // Obtener el ID del usuario desde el token
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    
    // Obtener los datos completos del usuario
    const userRes = await request
      .get(`/api/users/${decoded.id}`)
      .set('Authorization', `Bearer ${authToken}`);
      
    testUser = userRes.body.payload;
    console.log('Datos del usuario de prueba:', testUser);

    // Crear una mascota de prueba
    const petData = generatePetData({
      status: 'Disponible'
    });

    const petRes = await request
      .post('/api/pets')
      .set('Authorization', `Bearer ${authToken}`)
      .send(petData);

    console.log('Respuesta de creación de mascota:', JSON.stringify(petRes.body, null, 2));
    
    if (petRes.body && petRes.body._id) {
      // La respuesta exitosa directamente contiene los datos de la mascota
      testPet = petRes.body;
      console.log('Mascota creada con ID:', testPet._id);
    } else if (petRes.body && petRes.body.data) {
      // Otra posible estructura de respuesta
      testPet = petRes.body.data;
      console.log('Mascota creada con ID (data):', testPet._id);
    } else {
      console.error('Error: No se pudo obtener la mascota de la respuesta:', petRes.body);
      throw new Error('No se pudo crear la mascota de prueba');
    }
  });

  // No necesitamos afterEach(clearDB) ya que queremos que los datos persistan entre tests

  describe('POST /api/adoptions', () => {
    it('debería crear una nueva solicitud de adopción', async () => {
      // Primero verificamos que la mascota esté disponible
      const petBefore = await request
        .get(`/api/pets/${testPet._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(petBefore.body.status).to.equal('Disponible');

      // Creamos la adopción usando la ruta correcta
      const res = await request
        .post(`/api/adoptions/${testUser._id}/${testPet._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Me encantaría adoptar a esta mascota'
        });

      // Verificamos la respuesta
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('message', 'Mascota adoptada exitosamente');
      expect(res.body).to.have.property('payload');
      
      // Verificamos que la respuesta incluya la información de la mascota y el dueño
      expect(res.body.payload).to.have.property('pet');
      expect(res.body.payload.pet).to.have.property('_id', testPet._id.toString());
      expect(res.body.payload).to.have.property('owner');
      expect(res.body.payload.owner).to.have.property('_id', testUser._id.toString());
      
      // Verificamos que la mascota ahora esté marcada como adoptada
      const petAfter = await request
        .get(`/api/pets/${testPet._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(petAfter.body.status).to.equal('Adoptado');
    });

    it('debería fallar si la mascota no existe', async () => {
      // Usar un ID de mascota que no existe
      const nonExistentPetId = new mongoose.Types.ObjectId();
      
      const res = await request
        .post(`/api/adoptions/${testUser._id}/${nonExistentPetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Esta mascota no existe'
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('status', 'error');
      // El mensaje puede ser 'Usuario no encontrado' o 'Mascota no encontrada' dependiendo de qué verificación falle primero
      expect(['Usuario no encontrado', 'Mascota no encontrada']).to.include(res.body.message);
    });
  });

  describe('GET /api/adoptions', () => {
    it('debería obtener una lista de adopciones', async () => {
      // Crear una nueva mascota para este test específico
      const newPetData = generatePetData({
        status: 'Disponible'
      });

      const petRes = await request
        .post('/api/pets')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPetData);

      console.log('Nueva mascota creada para el test de lista:', JSON.stringify(petRes.body, null, 2));
      
      const newPet = petRes.body;
      
      // Verificar que tenemos los IDs necesarios
      console.log('Test - ID de usuario:', testUser._id);
      console.log('Test - ID de nueva mascota:', newPet._id);
      
      // Crear una adopción de prueba
      console.log('Creando adopción de prueba...');
      const adoptionRes = await request
        .post(`/api/adoptions/${testUser._id}/${newPet._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notes: 'Solicitud de prueba para lista de adopciones'
        });

      // Verificar que la adopción se creó correctamente
      console.log('Respuesta de creación de adopción - Status:', adoptionRes.status);
      console.log('Respuesta de creación de adopción - Body:', JSON.stringify(adoptionRes.body, null, 2));
      
      // Verificar el código de estado (el controlador devuelve 201 para creación exitosa)
      if (adoptionRes.status !== 201) {
        console.error('Error en la creación de adopción:', {
          status: adoptionRes.status,
          body: adoptionRes.body,
          headers: adoptionRes.headers
        });
      }
      
      expect(adoptionRes.status).to.equal(201);
      expect(adoptionRes.body).to.have.property('status', 'success');
      expect(adoptionRes.body).to.have.property('payload');
      
      // Obtener el ID de la adopción creada
      const adoptionId = adoptionRes.body.payload._id;
      console.log('ID de adopción creada:', adoptionId);
      
      // Obtener la lista de adopciones
      const res = await request
        .get('/api/adoptions')
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Respuesta de GET /api/adoptions:', JSON.stringify(res.body, null, 2));

      // Verificar la respuesta
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('payload').that.is.an('array');
      
      // Verificar que la lista no esté vacía
      expect(res.body.payload.length).to.be.greaterThan(0, 'La lista de adopciones no debería estar vacía');
      
      // Buscar la adopción que acabamos de crear
      const createdAdoption = res.body.payload.find(adoption => 
        (adoption._id && adoption._id.toString() === adoptionId) || 
        (adoption.pet && adoption.pet._id && adoption.pet._id.toString() === newPet._id.toString())
      );
      
      // Verificar que encontramos la adopción
      expect(createdAdoption, 'No se encontró la adopción creada en la lista').to.exist;
      
      // Verificar la estructura de la adopción
      expect(createdAdoption).to.have.property('pet');
      expect(createdAdoption.pet).to.have.property('_id', newPet._id.toString());
      expect(createdAdoption).to.have.property('owner');
      expect(createdAdoption.owner).to.have.property('_id', testUser._id.toString());
      
      // Verificar que la mascota ahora esté marcada como adoptada
      const petAfter = await request
        .get(`/api/pets/${newPet._id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(petAfter.body.status).to.equal('Adoptado');
    });
  });

  // Nota: No hay un endpoint PUT /api/adoptions/:id implementado actualmente
  // Se ha eliminado el test de actualización hasta que se implemente la funcionalidad
});
