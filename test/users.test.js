import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker/locale/es';
import app from '../src/app.js';
import { createTestConnection, clearDB, closeDB } from './config/test.config.js';
import { generateUserData } from './utils/test.utils.js';

const request = supertest(app);

describe('Users API', function() {
  this.timeout(60000); // Aumentar el tiempo de espera a 60 segundos
  let authToken;
  let adminToken;
  let testUser;

  before(async function() {
    this.timeout(60000); // Tiempo de espera para el hook before
    
    try {
      // Configurar la conexión a la base de datos
      console.log('Configurando conexión a la base de datos de prueba...');
      await createTestConnection();
      
      // Limpiar la base de datos antes de comenzar
      console.log('Limpiando base de datos de prueba...');
      await clearDB();
      
      console.log('Base de datos de prueba configurada');

      // Registrar un usuario administrador
      const adminData = generateUserData({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      });

      console.log('Registrando usuario administrador...');
      const registerRes = await request
        .post('/api/sessions/register')
        .send(adminData)
        .timeout(10000);
        
      if (registerRes.status !== 200 && registerRes.status !== 201) {
        console.error('Error al registrar usuario administrador:', registerRes.body);
        throw new Error('No se pudo registrar el usuario administrador');
      }
      
      console.log('Iniciando sesión como administrador...');
      const adminLoginRes = await request
        .post('/api/sessions/login')
        .send({
          email: adminData.email,
          password: adminData.password
        })
        .timeout(10000);

      if (!adminLoginRes.body.token) {
        console.error('Error al iniciar sesión como administrador:', adminLoginRes.body);
        throw new Error('No se pudo iniciar sesión como administrador');
      }

      adminToken = adminLoginRes.body.token;
      console.log('Sesión de administrador iniciada');

      // Registrar un usuario normal
      const userData = generateUserData({
        email: 'test.user@example.com',
        password: 'user123',
        first_name: 'Test',
        last_name: 'User'
      });
      
      console.log('Registrando usuario de prueba...');
      const userRes = await request
        .post('/api/sessions/register')
        .send(userData)
        .timeout(10000);
      
      console.log('Respuesta de registro de usuario de prueba:', JSON.stringify(userRes.body, null, 2));
      
      if (userRes.status !== 200 && userRes.status !== 201) {
        console.error('Error al registrar usuario de prueba:', userRes.body);
        throw new Error('No se pudo registrar el usuario de prueba');
      }
      
      testUser = userRes.body.payload || userRes.body.user;
      console.log('Usuario de prueba registrado:', testUser);

      if (!testUser || !testUser._id) {
        // Si no se pudo obtener el usuario del registro, intentamos obtenerlo de la base de datos
        console.log('Obteniendo usuario de la base de datos...');
        const usersRes = await request
          .get('/api/users')
          .set('Authorization', `Bearer ${adminToken}`);
          
        if (usersRes.status === 200 && usersRes.body.payload && usersRes.body.payload.length > 0) {
          testUser = usersRes.body.payload.find(u => u.email === userData.email);
          console.log('Usuario obtenido de la base de datos:', testUser);
        }
        
        if (!testUser || !testUser._id) {
          console.error('No se pudo obtener el ID del usuario de prueba');
          throw new Error('No se pudo obtener el ID del usuario de prueba');
        }
      }

      // Iniciar sesión como usuario normal
      console.log('Iniciando sesión como usuario de prueba...');
      const loginRes = await request
        .post('/api/sessions/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .timeout(10000);

      console.log('Respuesta de inicio de sesión de usuario de prueba:', JSON.stringify(loginRes.body, null, 2));

      if (!loginRes.body.token) {
        console.error('Error al iniciar sesión como usuario de prueba:', loginRes.body);
        throw new Error('No se pudo iniciar sesión como usuario de prueba');
      }

      authToken = loginRes.body.token;
      console.log('Sesión de usuario de prueba iniciada');
    } catch (error) {
      console.error('Error en el hook before:', error);
      throw error; // Relanzar el error para que falle la prueba
    }

  });

  // No limpiamos la base de datos durante las pruebas
  after(async function() {
    this.timeout(5000); // Aumentar el tiempo de espera a 5 segundos
    await closeDB();
  });

  describe('GET /api/users', () => {
    it('debería obtener una lista de usuarios (solo admin)', async () => {
      const res = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.be.an('array');
    });
  });

  describe('GET /api/users/:id', () => {
    it('debería obtener un usuario por ID', async () => {
      // Primero obtenemos la lista de usuarios para asegurarnos de que hay al menos uno
      const usersRes = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(usersRes.status).to.equal(200);
      expect(usersRes.body.payload).to.be.an('array').that.is.not.empty;
      
      // Usamos el ID del primer usuario de la lista
      const userId = usersRes.body.payload[0]._id;
      
      // Ahora hacemos la petición para obtener ese usuario por ID
      const res = await request
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      console.log('Respuesta de get user by ID:', JSON.stringify(res.body, null, 2));
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body.payload).to.have.property('_id', userId);
      expect(res.body.payload).to.have.property('email');
    });
  });
});
