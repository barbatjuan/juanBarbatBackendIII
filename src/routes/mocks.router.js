import { Router } from 'express';
import { faker } from '@faker-js/faker/locale/es';
import Pet from '../dao/models/Pet.js';
import User from '../dao/models/User.js';
import { CustomError } from '../utils/errors/errorHandler.js';

const router = Router();

// Generar mascotas de prueba
router.get('/mockingpets', async (req, res, next) => {
  try {
    const pets = [];
    
    for (let i = 0; i < 100; i++) {
      const pet = new Pet({
        name: faker.animal.dog(),
        species: faker.animal.type(),
        breed: faker.animal.dog(),
        age: faker.number.int({ min: 0, max: 15 }),
        gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
        size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
        description: faker.lorem.paragraph(),
        status: 'Disponible',
        image: faker.image.animals(400, 400, true),
        location: {
          city: faker.location.city(),
          state: faker.location.state()
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
      
      pets.push(pet);
    }
    
    await Pet.insertMany(pets);
    
    res.json({
      success: true,
      message: 'Se generaron 100 mascotas de prueba',
      count: pets.length
    });
  } catch (error) {
    next(new CustomError('DATABASE_ERROR', { error: error.message }));
  }
});

// Generar usuarios de prueba
router.get('/mockingusers', async (req, res, next) => {
  try {
    const users = [];
    const password = '$2b$10$Y50UoM9xJ/Vz7yRt5rC6l.5jXK1Xx3Vn8Jz5mX8YH9vKJvX8YH9vK';
    
    for (let i = 0; i < 50; i++) {
      const user = new User({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password,
        role: faker.helpers.arrayElement(['user', 'admin']),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode()
        },
        pets: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
      
      users.push(user);
    }
    
    await User.insertMany(users);
    
    res.json({
      success: true,
      message: 'Se generaron 50 usuarios de prueba',
      count: users.length,
      defaultPassword: 'coder123' // Contraseña por defecto para todos los usuarios
    });
  } catch (error) {
    next(new CustomError('DATABASE_ERROR', { error: error.message }));
  }
});

// Ruta para generar todos los datos de prueba
router.get('/generateData', async (req, res, next) => {
  try {
    // Limpiar colecciones
    await Pet.deleteMany({});
    await User.deleteMany({});
    
    // Generar mascotas
    const pets = [];
    for (let i = 0; i < 100; i++) {
      pets.push({
        name: faker.animal.dog(),
        species: faker.animal.type(),
        breed: faker.animal.dog(),
        age: faker.number.int({ min: 0, max: 15 }),
        gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
        size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
        description: faker.lorem.paragraph(),
        status: 'Disponible',
        image: faker.image.animals(400, 400, true),
        location: {
          city: faker.location.city(),
          state: faker.location.state()
        },
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }
    
    // Insertar mascotas
    const createdPets = await Pet.insertMany(pets);
    
    // Generar usuarios
    const users = [];
    const password = '$2b$10$Y50UoM9xJ/Vz7yRt5rC6l.5jXK1Xx3Vn8Jz5mX8YH9vKJvX8YH9vK';
    
    for (let i = 0; i < 50; i++) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password,
        role: faker.helpers.arrayElement(['user', 'admin']),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode()
        },
        pets: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }
    
    // Insertar usuarios
    const createdUsers = await User.insertMany(users);
    
    res.json({
      success: true,
      message: 'Datos de prueba generados exitosamente',
      pets: createdPets.length,
      users: createdUsers.length,
      defaultPassword: 'coder123' // Contraseña por defecto para los usuarios
    });
  } catch (error) {
    next(new CustomError('DATABASE_ERROR', { error: error.message }));
  }
});

export default router;
