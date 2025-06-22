import { Router } from 'express';
import adoptionsController from '../controllers/adoptions.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Adoptions
 *   description: Gestión de adopciones de mascotas
 */

/**
 * @swagger
 * /api/adoptions:
 *   get:
 *     summary: Obtiene todas las adopciones
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de adopciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 count:
 *                   type: number
 *                   example: 2
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 */
router.get('/', adoptionsController.getAllAdoptions);

/**
 * @swagger
 * /api/adoptions/{aid}:
 *   get:
 *     summary: Obtiene una adopción por su ID
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la adopción
 *     responses:
 *       200:
 *         description: Detalles de la adopción
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 */
router.get('/:aid', adoptionsController.getAdoption);

/**
 * @swagger
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que está adoptando
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a adoptar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Notas adicionales para la solicitud de adopción
 *     responses:
 *       200:
 *         description: Mascota adoptada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Pet adopted
 *       400:
 *         description: La mascota ya ha sido adoptada
 *       404:
 *         description: Usuario o mascota no encontrados
 */
router.post('/:uid/:pid', adoptionsController.createAdoption);

export default router;