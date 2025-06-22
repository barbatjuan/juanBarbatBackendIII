# 🐾 AdoptMe - Plataforma de Adopción de Mascotas

Bienvenido a AdoptMe, una plataforma completa para la adopción de mascotas desarrollada con Node.js, Express y MongoDB. Este proyecto es parte del curso de Backend de Coderhouse y ofrece un sistema completo para la gestión de adopciones de mascotas.

## 📌 Características Destacadas

- **Autenticación JWT** con roles de usuario y administrador
- **Gestión Completa de Mascotas** (CRUD) con búsqueda y filtros avanzados
- **Sistema de Adopciones** con seguimiento de estado
- **Dashboard de Administración** con métricas clave
- **Documentación API** con Swagger
- **Pruebas Automatizadas** con Mocha y Chai
- **Despliegue con Docker** para entornos de desarrollo y producción
- **Logging** con Winston
- **Seguridad Mejorada** con validación de datos y manejo de errores centralizado

## 🚀 Empezando Rápido

### Requisitos Previos

- Node.js v16+ y npm
- MongoDB 6.0+ (local o Atlas)
- Docker y Docker Compose (opcional pero recomendado)

### Instalación Rápida con Docker (Recomendado)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/adoptme.git
   cd adoptme
   ```

2. Copia el archivo de entorno de ejemplo:
   ```bash
   cp .env.example .env
   ```

3. Inicia los servicios con Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. La aplicación estará disponible en: http://localhost:8081
5. La documentación de la API en: http://localhost:8081/api-docs

### Instalación Local (Sin Docker)

1. Clona el repositorio e instala dependencias:
   ```bash
   git clone https://github.com/tu-usuario/adoptme.git
   cd adoptme
   npm install
   ```

2. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita el archivo .env según tu configuración
   ```

3. Inicia MongoDB localmente

4. Inicia la aplicación:
   ```bash
   # Modo desarrollo
   npm run dev
   
   # Modo producción
   npm start
   ```

## 🐳 Docker

### Configuración de Entornos

El proyecto incluye dos archivos de Docker Compose:
- `docker-compose.yml`: Para desarrollo y producción
- `docker-compose.test.yml`: Para ejecutar las pruebas automatizadas

### Desarrollo con Docker

#### Iniciar la Aplicación
```bash
# Inicia la aplicación y MongoDB
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f
```

#### Detener la Aplicación
```bash
# Detiene los contenedores
# Opción -v para eliminar volúmenes (opcional)
docker-compose down [-v]
```

#### Reconstruir Contenedores
```bash
# Reconstruye las imágenes y reinicia los contenedores
docker-compose up -d --build
```

#### Acceder a MongoDB
```bash
# Conectarse al contenedor de MongoDB
docker exec -it adoptme-mongo mongosh -u root -p ejemplo

# O usar MongoDB Compass con:
# URI: mongodb://localhost:27017/adoptme
```

### Variables de Entorno para Docker

El archivo `.env.docker` contiene las configuraciones por defecto. Asegúrate de configurar:
- `MONGO_URI` para la conexión a MongoDB
- `JWT_SECRET` para la autenticación
- Credenciales de Cloudinary si usas carga de imágenes

## 🧪 Guía Completa para Ejecutar Pruebas

### Opción 1: Usando Docker (Recomendado)

#### Requisitos Previos
- Docker y Docker Compose instalados
- Puerto 27017 disponible para MongoDB

#### 1. Ejecutar Todas las Pruebas
```bash
# Construye las imágenes y ejecuta las pruebas
docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit

# Para ver los logs en tiempo real:
docker-compose -f docker-compose.test.yml logs -f
```

#### 2. Ejecutar Categorías Específicas
```bash
# Pruebas de usuarios
docker-compose -f docker-compose.test.yml run --rm app npm run test:users

# Pruebas de mascotas
docker-compose -f docker-compose.test.yml run --rm app npm run test:pets

# Pruebas de adopciones
docker-compose -f docker-compose.test.yml run --rm app npm run test:adoptions

# Pruebas de sesiones
docker-compose -f docker-compose.test.yml run --rm app npm run test:sessions
```

#### 3. Depuración de Pruebas
```bash
# Ejecutar pruebas con Node.js inspector
# Luego conectar con Chrome DevTools en chrome://inspect
docker-compose -f docker-compose.test.yml run --rm \
  -p 9229:9229 \
  -e NODE_OPTIONS='--inspect=0.0.0.0:9229' \
  app npm test
```

#### 4. Limpieza
```bash
# Detener y eliminar contenedores de prueba
docker-compose -f docker-compose.test.yml down -v

# Limpiar recursos no utilizados
docker system prune -f
docker volume prune -f
```

### Opción 2: Ejecución Local (Sin Docker)

#### Requisitos Previos
- Node.js v16 o superior
- MongoDB Community Edition instalado localmente

#### 1. Configuración Inicial
```bash
# Instalar dependencias
npm install

# Crear archivo .env.test (si no existe)
cp .env.example .env.test
```

#### 2. Configurar .env.test
```
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/adoptme_test
JWT_SECRET=test_secret_key
```

#### 3. Ejecutar Pruebas
```bash
# Todas las pruebas
npm test

# Pruebas específicas
npm run test:users
npm run test:pets
npm run test:adoptions
npm run test:sessions

# Con cobertura de código
npm run test:coverage
```

### Solución de Problemas Comunes

1. **Error de conexión a MongoDB**
   - Verifica que MongoDB esté en ejecución
   - Asegúrate de que el puerto 27017 esté disponible

2. **Problemas con Docker**
   - Prueba a reconstruir las imágenes: `docker-compose -f docker-compose.test.yml build --no-cache`
   - Verifica que no haya contenedores huérfanos: `docker ps -a`

3. **Las pruebas fallan inesperadamente**
   - Limpia la base de datos de prueba: `mongo adoptme_test --eval 'db.dropDatabase()'`
   - Verifica que no haya instancias de la aplicación ejecutándose en otros terminales

## 📊 Base de Datos

### Poblar con Datos de Prueba

```bash
# Con Docker
docker exec -it adoptme-app node seed.js

# Sin Docker
node seed.js
```

### Usuarios de Prueba

**Administradores:**
- Email: `admin1@adoptme.com` / Contraseña: `123456`
- Email: `admin2@adoptme.com` / Contraseña: `123456`

**Usuarios Regulares:**
- Email: `user1@adoptme.com` a `user18@adoptme.com`
- Contraseña: `123456`

## 📊 Cobertura de Código

Para generar un informe de cobertura de código:

```bash
# Con Docker
docker-compose -f docker-compose.test.yml run --rm app npm run test:coverage

# Localmente
npm run test:coverage
```

El informe se generará en `coverage/lcov-report/index.html`

## 🔍 Analizando los Resultados

- Las pruebas exitosas mostrarán checkmarks verdes (✓)
- Las fallidas mostrarán una 'x' roja (✖) con detalles del error
- Los logs detallados están disponibles en la consola
- Los informes de cobertura muestran qué líneas de código no están siendo probadas

## 🛠️ Configuración Avanzada

### Reintentos Automáticos
Para reintentar automáticamente las pruebas fallidas:

```bash
# Reintentar hasta 3 veces las pruebas fallidas
npx mocha --retries 3
```

### Ejecución en Paralelo
Para ejecutar pruebas en paralelo (útil para conjuntos de pruebas grandes):

```bash
# Instalar el módulo de pruebas en paralelo
npm install --save-dev mocha-parallel-tests

# Ejecutar pruebas en paralelo
npx mocha-parallel-tests test/**/*.test.js
```

## 📚 Documentación de la API

La documentación interactiva está disponible en:
- http://localhost:8081/api-docs

### Endpoints Principales

#### Autenticación
- `POST /api/sessions/register` - Registrar nuevo usuario
- `POST /api/sessions/login` - Iniciar sesión
- `GET /api/sessions/current` - Obtener usuario actual

#### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

#### Mascotas
- `GET /api/pets` - Listar mascotas (filtros disponibles)
- `GET /api/pets/:id` - Obtener mascota por ID
- `POST /api/pets` - Crear mascota (autenticado)
- `PUT /api/pets/:id` - Actualizar mascota
- `DELETE /api/pets/:id` - Eliminar mascota (admin)

#### Adopciones
- `GET /api/adoptions` - Listar adopciones
- `POST /api/adoptions` - Solicitar adopción
- `PUT /api/adoptions/:id` - Actualizar estado de adopción (admin)

## 🏗️ Estructura del Proyecto

```
src/
├── config/           # Configuraciones
│   ├── db.config.js
│   ├── cloudinary.config.js
│   └── swagger.config.js
├── controllers/      # Controladores
│   ├── users.controller.js
│   ├── pets.controller.js
│   └── adoptions.controller.js
├── dao/             # Data Access Objects
│   └── mongo/
│       ├── users.dao.js
│       └── pets.dao.js
├── middlewares/     # Middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── logger.middleware.js
├── models/          # Modelos
│   ├── User.js
│   ├── Pet.js
│   └── Adoption.js
├── routes/          # Rutas
│   ├── users.router.js
│   ├── pets.router.js
│   └── adoptions.router.js
├── services/        # Lógica de negocio
│   ├── users.service.js
│   ├── pets.service.js
│   └── adoptions.service.js
└── utils/          # Utilidades
    ├── logger.js
    └── errors/
```

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=8081
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/adoptme

# JWT
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRES_IN=1h

# Cloudinary (opcional para cargar imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## ✨ Créditos

- Desarrollado por [Tu Nombre](https://github.com/tu-usuario)
- Curso Backend de Coderhouse
- Imágenes de ejemplo de [Unsplash](https://unsplash.com/)

---

💡 **Nota:** Asegúrate de nunca exponer las credenciales reales en el control de versiones. Usa siempre variables de entorno para la configuración sensible.

[![Docker Image](https://img.shields.io/docker/pulls/barbatjuan/adoptme?style=flat-square)](https://hub.docker.com/r/barbatjuan/adoptme)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Winston Logger](https://img.shields.io/badge/logger-winston-2ecc71.svg)](https://github.com/winstonjs/winston)

## 📚 Documentación de la API

La documentación interactiva de la API está disponible en:
- [Documentación Swagger](http://localhost:8081/api-docs) (local)
- [Documentación Postman](https://documenter.getpostman.com/view/...) (pendiente de enlace)

## ✨ Características Principales

- 🔒 Autenticación JWT con roles de usuario y administrador
- 🐕 Gestión completa de mascotas (CRUD)
- 👥 Sistema de usuarios con perfiles
- 📋 Proceso de adopción completo
- 📊 Dashboard de administración
- 📝 Documentación con Swagger
- 🧪 Suite de pruebas automatizadas
- 🐳 Despliegue con Docker
- 🌐 API RESTful
- 📝 Sistema de logging con Winston
- 🔍 Middleware de autenticación y autorización
- 🛡️ Manejo centralizado de errores
- 🔄 Validación de datos con Joi
- 🗄️ Persistencia con MongoDB y Mongoose

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- npm (v8 o superior) o yarn
- MongoDB (v6.0 o superior) local o Atlas
- Docker (opcional, para desarrollo con contenedores)
- Git

## 🚀 Instalación Rápida

1. Clona el repositorio:
   ```bash
   git clone https://github.com/barbatjuan/juanBarbatBackendIII.git
   cd adoptme
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus configuraciones
   ```

4. Inicia la base de datos MongoDB

5. Inicia la aplicación:
   ```bash
   # Modo desarrollo
   npm run dev
   
   # O en producción
   npm start
   ```

## 📊 Sistema de Logging (Winston)

La aplicación utiliza Winston para el registro de eventos con las siguientes características:

### Niveles de Log
- `error`: Errores críticos que requieren atención inmediata
- `warn`: Advertencias sobre situaciones inusuales
- `info`: Información general de la aplicación
- `http`: Logs de peticiones HTTP
- `debug`: Información detallada para depuración

### Configuración
- En desarrollo: Muestra logs en consola con colores
- En producción: Guarda logs en archivos separados por nivel
- Formato personalizado que incluye timestamp, nivel y mensaje

### Uso en el Código
```javascript
import logger from '../utils/logger.js';

// Ejemplos de uso
logger.error('Mensaje de error');
logger.warn('Advertencia');
logger.info('Información general');
logger.http('Petición HTTP');
logger.debug('Mensaje de depuración');
```

### Archivos de Log
- `logs/error.log`: Errores y advertencias
- `logs/combined.log`: Todos los logs combinados

### Middleware de Logging
Se incluye un middleware que registra todas las peticiones HTTP:
- Método HTTP
- URL
- Código de estado
- Tiempo de respuesta
- User-Agent
- IP del cliente

## Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/barbatjuan/juanBarbatBackendIII.git
   cd adoptme
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones.

## Ejecución

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

## Ejecutar Pruebas

### Todas las pruebas
```bash
npm test
```

### Pruebas por categoría
```bash
# Pruebas de usuarios
npm run test:users

# Pruebas de mascotas
npm run test:pets

# Pruebas de adopciones
npm run test:adoptions

# Pruebas de autenticación
npm run test:sessions

# Pruebas de cobertura
npm run test:coverage
```

## Docker

### Construir la imagen
```bash
docker build -t barbatjuan/adoptme .
```

### Ejecutar con Docker (con MongoDB local)
```bash
docker run -p 8081:8081 -e MONGO_URI=mongodb://host.docker.internal:27017/adoptme -d barbatjuan/adoptme
```

### Usar con Docker Compose
```bash
docker-compose up -d
```

### Subir a Docker Hub
```bash
docker push barbatjuan/adoptme:latest
```

## Documentación de la API

La documentación interactiva de la API está disponible en:
- [Documentación Swagger](http://localhost:8081/api-docs)

### Endpoints principales:
- `POST /api/sessions/register` - Registro de usuarios
- `POST /api/sessions/login` - Inicio de sesión
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/pets` - Listar mascotas
- `POST /api/pets` - Crear mascota (autenticado)
- `POST /api/adoptions` - Solicitar adopción

## Estructura del Proyecto

```
src/
├── config/         # Configuraciones de la aplicación
│   ├── db.config.js
│   ├── cloudinary.config.js
│   └── swagger.config.js
├── controllers/     # Controladores de la API
│   ├── users.controller.js
│   ├── pets.controller.js
│   └── adoptions.controller.js
├── dao/            # Data Access Objects
│   ├── mongo
│   │   ├── users.dao.js
│   │   └── pets.dao.js
│   └── index.js
├── middlewares/    # Middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── logger.middleware.js
├── models/         # Modelos de datos
│   ├── User.js
│   ├── Pet.js
│   └── Adoption.js
├── routes/         # Rutas de la API
│   ├── users.router.js
│   ├── pets.router.js
│   └── adoptions.router.js
├── services/       # Lógica de negocio
│   ├── users.service.js
│   ├── pets.service.js
│   └── adoptions.service.js
└── utils/          # Utilidades
    ├── logger.js
    ├── errors/
    └── index.js
```

## ⚙️ Variables de Entorno

El archivo `.env` debe contener las siguientes variables:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Copia el archivo `.env.example` a `.env`
   - Configura las variables según tu entorno

## 🚦 Iniciar la Aplicación

### Entorno de Desarrollo
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

La aplicación estará disponible en `http://localhost:8081`

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar cobertura de código
npm run test:coverage
```

## 📚 Documentación de la API

La documentación de la API está disponible en formato Swagger. Para acceder a ella:

1. Inicia la aplicación en modo desarrollo
2. Abre tu navegador en: `http://localhost:8081/api-docs`

## 🐳 Docker

### Construir la imagen
```bash
docker build -t adoptme .
```

### Ejecutar el contenedor
```bash
docker run -p 8081:8081 --name adoptme adoptme
```

### Docker Hub
La imagen está disponible en Docker Hub: [usuario/adoptme](https://hub.docker.com/r/usuario/adoptme)

## 🗃️ Base de Datos

### Poblar la Base de Datos

La aplicación incluye scripts para poblar la base de datos con datos de ejemplo:

1. **Mascotas de Ejemplo**
   ```bash
   node scripts/seedPets.js
   ```
   - Crea 100 mascotas (50 perros y 50 gatos) con datos aleatorios
   - Incluye razas, edades, tamaños y descripciones variadas

2. **Usuarios de Ejemplo**
   ```bash
   node scripts/seedUsers.js
   ```
   - Crea 20 usuarios (1 administrador + 19 usuarios regulares)
   - Datos realistas con nombres y apellidos en español
   - Contraseñas hasheadas para seguridad

### Credenciales de Prueba

**Usuarios Administradores:**
- **Admin 1:**
  - **Email:** admin1@adoptme.com
  - **Contraseña:** 123456
- **Admin 2:**
  - **Email:** admin2@adoptme.com
  - **Contraseña:** 123456

**Usuarios Regulares:**
- **Contraseña para todos:** password123
- Los correos siguen el formato: nombre.apellido@dominio.com

### Estructura de la Base de Datos

- **MongoDB** en `mongodb://localhost:27017/adoptme`
- Colecciones principales:
  - `Users`: Información de usuarios y autenticación
  - `Pets`: Datos de mascotas disponibles para adopción
  - `Adoptions`: Registro de adopciones realizadas

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del servidor
PORT=8081
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/adoptme

# JWT
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRES_IN=1h

# Cloudinary (opcional, para carga de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

## 🧪 Datos de Prueba

El proyecto incluye un script para poblar la base de datos con datos de prueba. Para usarlo:

1. Asegúrate de que MongoDB esté en ejecución
2. Ejecuta el siguiente comando:
   ```bash
   node seed.js
   ```

### Datos Generados

#### Usuarios
- **Total:** 20 usuarios
  - 2 administradores: 
    - `admin1@adoptme.com` (contraseña: `123456`)
    - `admin2@adoptme.com` (contraseña: `123456`)
  - 18 usuarios regulares: `user1@adoptme.com` a `user18@adoptme.com` (contraseña: `123456`)
  - Nombres y apellidos realistas en español

#### Mascotas
- **Total:** 100 mascotas
  - 50 perros de diferentes razas (Labrador, Pastor Alemán, Golden Retriever, etc.)
  - 50 gatos de diferentes razas (Siamés, Persa, Maine Coon, etc.)
  - Edades variadas (1-15 años para perros, 1-18 años para gatos)
  - Tamaños: Pequeño, Mediano, Grande
  - Imágenes aleatorias de Unsplash relacionadas con la raza
  - Todas las mascotas están marcadas como 'Disponible' inicialmente

### Estructura de Datos

#### Usuarios
- **Campos principales:**
  - `first_name`: Nombre del usuario
  - `last_name`: Apellido del usuario
  - `email`: Correo electrónico único
  - `password`: Contraseña hasheada
  - `role`: Rol del usuario (`admin` o `user`)
  - `pets`: Array de referencias a mascotas adoptadas

#### Mascotas
- **Campos principales:**
  - `name`: Nombre de la mascota
  - `species`: Especie (`Perro` o `Gato`)
  - `breed`: Raza de la mascota
  - `age`: Edad en años
  - `gender`: Género (`Macho` o `Hembra`)
  - `size`: Tamaño (`Pequeño`, `Mediano`, `Grande`)
  - `description`: Descripción detallada
  - `status`: Estado actual (`Disponible` o `Adoptado`)
  - `image`: URL de la imagen

### Acceso a los Datos

Puedes acceder a los datos a través de los siguientes endpoints:
- Lista de usuarios: `GET /api/users`
- Lista de mascotas: `GET /api/pets`
- Detalles de una mascota: `GET /api/pets/:id`

### Notas
- El script `seed.js` limpia todas las colecciones antes de generar nuevos datos
- Las contraseñas están hasheadas usando bcrypt
- Las imágenes se cargan desde Unsplash con términos de búsqueda relevantes
- Los datos están diseñados para pruebas de desarrollo y demostración
JWT_COOKIE_NAME=jwt

# Logger
LOG_LEVEL=debug
```

## 🗂️ Estructura del Proyecto

```
src/
├── config/           # Configuraciones de la aplicación
│   ├── db.config.js    # Configuración de la base de datos
│   ├── swagger.js      # Configuración de Swagger
│   └── cloudinary.js   # Configuración de Cloudinary
├── controllers/      # Controladores de la API
│   ├── users.controller.js
│   ├── pets.controller.js
│   └── adoptions.controller.js
├── dao/              # Data Access Objects
│   └── mongo/        # Implementaciones específicas de MongoDB
├── middlewares/      # Middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── logger.middleware.js
├── models/           # Modelos de Mongoose
│   ├── User.js
│   ├── Pet.js
│   └── Adoption.js
├── routes/           # Rutas de la API
│   ├── users.router.js
│   ├── pets.router.js
│   └── adoptions.router.js
├── services/         # Lógica de negocio
│   ├── users.service.js
│   ├── pets.service.js
│   └── adoptions.service.js
├── tests/            # Pruebas automatizadas
│   ├── integration/
│   └── unit/
├── utils/            # Utilidades
│   ├── errors/       # Manejo de errores personalizados
│   │   ├── index.js
│   │   └── errorDictionary.js
│   └── logger.js     # Configuración de Winston
├── app.js            # Configuración de Express
└── server.js         # Punto de entrada de la aplicación
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📧 Contacto

Para cualquier consulta, por favor contacta a [tu-email@ejemplo.com](mailto:tu-email@ejemplo.com)
