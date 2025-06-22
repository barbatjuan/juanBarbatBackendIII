import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno de .env.test
dotenv.config({ path: `${__dirname}/../../.env.test`, override: true });

console.log('JWT_SECRET en test.config.js:', process.env.JWT_SECRET);

// Configuración de la base de datos de prueba
const TEST_DB_URI = `mongodb://${process.env.TEST_DB_HOST}:${process.env.TEST_DB_PORT}/${process.env.TEST_DB_NAME}`;
console.log('Conectando a la base de datos de prueba:', TEST_DB_URI);

// Crear una nueva conexión de Mongoose para pruebas
const createTestConnection = async () => {
  try {
    // Cerrar cualquier conexión existente
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    // Conectar a la base de datos de prueba
    console.log('Estableciendo conexión con MongoDB...');
    await mongoose.connect(TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 segundos para la selección del servidor
      socketTimeoutMS: 45000, // 45 segundos de tiempo de espera del socket
    });
    console.log('Conexión a MongoDB establecida correctamente');

    console.log('Conectado a la base de datos de prueba');
    return mongoose.connection;
  } catch (error) {
    console.error('Error al conectar a la base de datos de prueba:', error);
    process.exit(1);
  }
};

// Limpiar la base de datos de prueba
const clearDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('Base de datos de prueba limpiada');
  } catch (error) {
    console.error('Error al limpiar la base de datos de prueba:', error);
  }
};

// Desconectar de la base de datos de prueba
const closeDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.connection.close();
      console.log('Conexión a la base de datos de prueba cerrada');
    } else {
      console.log('No hay conexión activa para cerrar');
    }
  } catch (error) {
    console.error('Error al cerrar la conexión a la base de datos de prueba:', error);
  }
};

// Función para configurar la conexión de prueba
const setupTestDB = () => {
  before(async () => {
    await createTestConnection();
    // Limpiamos la base de datos al inicio de las pruebas
    await clearDB();
  });

  after(async function() {
    this.timeout(10000); // Aumentar el tiempo de espera a 10 segundos
    // Solo cerramos la conexión al final de todas las pruebas
    // No limpiamos la base de datos aquí para mantener los datos entre pruebas
    await closeDB();
  });
};

export { setupTestDB, createTestConnection, clearDB, closeDB };
