import { Router } from 'express';
import sessionsController from '../controllers/sessions.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Manejo de autenticación y sesiones de usuario
 */

/**
 * @swagger
 * /api/sessions/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombre del usuario
 *               last_name:
 *                 type: string
 *                 description: Apellido del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Contraseña (mínimo 6 caracteres)
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: string
 *                   description: ID del usuario creado
 *       400:
 *         description: Error en la solicitud (datos faltantes, email ya registrado, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: User already exists
 */
router.post('/register', sessionsController.register);

/**
 * @swagger
 * /api/sessions/login:
 *   post:
 *     summary: Inicia sesión con un usuario existente
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
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
 *                   example: Logged in
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: token=abcde12345; Path=/; HttpOnly
 *       400:
 *         description: Credenciales inválidas o error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Incorrect password
 */
router.post('/login', sessionsController.login);

/**
 * @swagger
 * /api/sessions/current:
 *   get:
 *     summary: Obtiene la información del usuario actual
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
router.get('/current', sessionsController.current);

// Rutas sin protección (solo para pruebas)
router.get('/unprotectedLogin', sessionsController.unprotectedLogin);
router.get('/unprotectedCurrent', sessionsController.unprotectedCurrent);

export default router;