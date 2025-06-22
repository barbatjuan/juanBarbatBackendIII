import { Router } from 'express';
import multer from 'multer';
import petsController from '../controllers/pets.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPetSchema, updatePetSchema } from '../validations/pet.validation.js';

const router = Router();

// Configuración de multer para manejar la carga de archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
});

/**
 * @swagger
 * tags:
 *   name: Pets
 *   description: Gestión de mascotas en la plataforma
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pet'
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas con opción de filtrado
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [Perro, Gato, Conejo, Otro]
 *         description: Filtrar por especie
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Disponible, Reservado, Adoptado]
 *         description: Filtrar por estado de adopción
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [Pequeño, Mediano, Grande]
 *         description: Filtrar por tamaño
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Macho, Hembra, Desconocido]
 *         description: Filtrar por género
 *     responses:
 *       200:
 *         description: Lista de mascotas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: number
 *                   example: 1
 *                 data:
 *                   type: object
 *                   properties:
 *                     pets:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Error del servidor
 */
// Ruta pública para obtener todas las mascotas
router.get('/', petsController.getAllPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Obtiene una mascota por su ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota
 *     responses:
 *       200:
 *         description: Mascota encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     pet:
 *                       $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
// Ruta pública para obtener una mascota por ID
router.get('/:id', petsController.getPetById);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(authMiddleware);

// Rutas protegidas que requieren autenticación

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Crea una nueva mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - age
 *               - gender
 *               - size
 *               - description
 *               - status
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max
 *               species:
 *                 type: string
 *                 enum: [Perro, Gato, Conejo, Otro]
 *                 example: Perro
 *               breed:
 *                 type: string
 *                 example: Labrador
 *               age:
 *                 type: number
 *                 example: 2
 *               gender:
 *                 type: string
 *                 enum: [Macho, Hembra, Desconocido]
 *                 example: Macho
 *               size:
 *                 type: string
 *                 enum: [Pequeño, Mediano, Grande]
 *                 example: Mediano
 *               description:
 *                 type: string
 *                 example: Muy juguetón y cariñoso
 *               status:
 *                 type: string
 *                 enum: [Disponible, Reservado, Adoptado]
 *                 example: Disponible
 *               location:
 *                 type: string
 *                 description: Objeto JSON stringificado con city y state
 *                 example: '{"city":"Madrid","state":"Madrid"}'
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Mascota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     pet:
 *                       $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Faltan campos requeridos o son inválidos
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       500:
 *         description: Error del servidor
 */
// Ruta protegida para crear una nueva mascota
router.post(
  '/',
  upload.array('images', 5), // Máximo 5 imágenes
  validate(createPetSchema),
  petsController.createPet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   patch:
 *     summary: Actualiza una mascota existente
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Max (actualizado)
 *               species:
 *                 type: string
 *                 enum: [Perro, Gato, Conejo, Otro]
 *                 example: Perro
 *               breed:
 *                 type: string
 *                 example: Labrador Retriever
 *               age:
 *                 type: number
 *                 example: 3
 *               gender:
 *                 type: string
 *                 enum: [Macho, Hembra, Desconocido]
 *                 example: Macho
 *               size:
 *                 type: string
 *                 enum: [Pequeño, Mediano, Grande]
 *                 example: Grande
 *               description:
 *                 type: string
 *                 example: Muy juguetón, cariñoso y juguetón
 *               status:
 *                 type: string
 *                 enum: [Disponible, Reservado, Adoptado]
 *                 example: Reservado
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: Barcelona
 *                   state:
 *                     type: string
 *                     example: Barcelona
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     pet:
 *                       $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       403:
 *         description: No tienes permiso para actualizar esta mascota
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
// Ruta protegida para actualizar una mascota
router.patch(
  '/:id',
  authMiddleware,
  validate(updatePetSchema),
  petsController.updatePet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Elimina una mascota
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a eliminar
 *     responses:
 *       204:
 *         description: Mascota eliminada exitosamente
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       403:
 *         description: No tienes permiso para eliminar esta mascota
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
// Ruta protegida para eliminar una mascota
router.delete(
  '/:id',
  authMiddleware,
  petsController.deletePet
);

export default router;