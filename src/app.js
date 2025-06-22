import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cloudinaryConfig from './config/cloudinary.config.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import loggerTestRouter from './routes/loggerTest.routes.js';
import mocksRouter from './routes/mocks.router.js';
import { addLogger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 8081;
dotenv.config();

// Conexión a MongoDB
let connection;
const mongoUri = process.env.MONGO_URI;
console.log(`Conectando a MongoDB en ${process.env.NODE_ENV} con URI:`, mongoUri);

connection = mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 segundos de tiempo de espera
  socketTimeoutMS: 45000, // 45 segundos de tiempo de espera del socket
}).then(() => {
  console.log('Conexión exitosa a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
  process.exit(1);
});

// Configuración de Cloudinary (solo en producción o desarrollo, no en pruebas)
if (process.env.NODE_ENV !== 'test') {
  cloudinaryConfig();
}

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

// Configuración de Swagger
import { schemas, securitySchemes } from './config/swagger.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AdoptMe API',
      version: '1.0.0',
      description: 'API para la plataforma de adopción de mascotas AdoptMe',
      contact: {
        name: 'Soporte',
        email: 'soporte@adoptme.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8081',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas,
      securitySchemes
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Configuración simple de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customSiteTitle: 'AdoptMe API'
}));

// Rutas
// Rutas de la API
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

// Rutas de utilidades
app.use('/loggerTest', loggerTestRouter);

// Rutas de mocks (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/mocks', mocksRouter);
}

// Manejo de errores
import { errorHandler } from './utils/errors/errorHandler.js';
app.use(errorHandler);

// Iniciar servidor solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

export default app;
