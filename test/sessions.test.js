import { expect } from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker/locale/es';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { setupTestDB } from './config/test.config.js';

const request = supertest(app);

describe('Sessions API', function() {
  // Aumentar el tiempo de espera para las pruebas
  this.timeout(10000);

  // Configurar la base de datos de prueba
  setupTestDB();

  // Importar los modelos después de configurar la conexión
  before(async () => {
    // Importar dinámicamente los modelos para asegurar que usen la conexión correcta
    await import('../src/dao/models/User.js');
  });

  describe('POST /api/sessions/register', () => {
    it('debería registrar un nuevo usuario exitosamente', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request
        .post('/api/sessions/register')
        .send(userData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('payload');
    });

    it('debería fallar si el email ya está registrado', async () => {
      // Primero creamos un usuario
      await request.post('/api/sessions/register').send({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Intentamos crear otro usuario con el mismo email
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123'
      };

      // Primer registro
      await request.post('/api/sessions/register').send(userData);
      
      // Segundo intento con el mismo email
      const res = await request
        .post('/api/sessions/register')
        .send(userData);

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'User already exists');
    });
  });

  describe('POST /api/sessions/login', () => {
    it('debería iniciar sesión exitosamente con credenciales válidas', async () => {
      // Primero creamos un usuario
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123'
      };

      await request
        .post('/api/sessions/register')
        .send(userData);

      // Intentamos iniciar sesión
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const res = await request
        .post('/api/sessions/login')
        .send(loginData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
      expect(res.body.user).to.have.property('email', 'test@example.com');
    });

    it('debería fallar con credenciales inválidas', async () => {
      // Primero creamos un usuario
      await request.post('/api/sessions/register').send({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Intentamos iniciar sesión con contraseña incorrecta
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const res = await request
        .post('/api/sessions/login')
        .send(loginData);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'Invalid credentials');
    });

    it('debería fallar si el usuario no existe', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const res = await request
        .post('/api/sessions/login')
        .send(loginData);

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'Invalid credentials');
    });
  });
});
