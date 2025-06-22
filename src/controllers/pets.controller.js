import mongoose from 'mongoose';
import { petsService } from "../services/index.js";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { AppError } from "../utils/AppError.js";

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Obtiene todas las mascotas disponibles
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *           enum: [Perro, Gato, Conejo, Otro]
 *         description: Filtrar por especie de mascota
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Disponible, En Proceso, Adoptado]
 *         description: Filtrar por estado de adopción
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [Pequeño, Mediano, Grande]
 *         description: Filtrar por tamaño de la mascota
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [Macho, Hembra]
 *         description: Filtrar por género de la mascota
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
 *                 total:
 *                   type: integer
 *                   description: Número total de mascotas
 *                   example: 15
 */
const getAllPets = async (req, res, next) => {
    try {
        const { species, status, size, gender } = req.query;
        const filter = {};
        
        // Aplicar filtros si están presentes en la consulta
        if (species) filter.species = species;
        if (status) filter.status = status;
        if (size) filter.size = size;
        if (gender) filter.gender = gender;
        
        const pets = await petsService.getAll(filter);
        
        // Estructura de respuesta esperada por los tests
        res.status(200).json({ 
            status: 'success', 
            payload: pets,
            total: pets.length
        });
    } catch (error) {
        console.error('Error en getAllPets:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las mascotas'
        });
    }
};

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
 *         description: ID de la mascota a buscar
 *     responses:
 *       200:
 *         description: Detalles de la mascota
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: ID de mascota no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: ID de mascota no válido
 *       404:
 *         description: Mascota no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Mascota no encontrada
 */
const getPetById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID tenga un formato válido de MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID de mascota no válido'
            });
        }
        
        const pet = await petsService.getById(id);
        
        if (!pet) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró ninguna mascota con ese ID'
            });
        }
        
        res.status(200).json(pet);
    } catch (error) {
        console.error('Error en getPetById:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la mascota'
        });
    }
};

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
 *               - breed
 *               - age
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la mascota
 *               species:
 *                 type: string
 *                 enum: [Perro, Gato, Conejo, Otro]
 *                 description: Especie de la mascota
 *               breed:
 *                 type: string
 *                 description: Raza de la mascota
 *               age:
 *                 type: number
 *                 description: Edad de la mascota en años
 *               gender:
 *                 type: string
 *                 enum: [Macho, Hembra]
 *                 description: Género de la mascota
 *               size:
 *                 type: string
 *                 enum: [Pequeño, Mediano, Grande]
 *                 description: Tamaño de la mascota
 *               description:
 *                 type: string
 *                 description: Descripción detallada de la mascota
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de la mascota
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
 *                 message:
 *                   type: string
 *                   example: Mascota creada exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Error en los datos de entrada
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       500:
 *         description: Error al procesar la imagen
 */
const createPet = async (req, res, next) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { 
            name, 
            species, 
            breed,
            age, 
            gender, 
            size, 
            description, 
            status
        } = req.body;
        
        // Validar campos requeridos
        if (!name || !species || !breed || !age || !gender || !size || !description || !status) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }
        
        // Crear objeto con los datos de la mascota
        const petData = {
            name,
            species,
            breed,
            age: parseInt(age, 10),
            gender,
            size,
            description,
            status
        };
        
        // Guardar la mascota en la base de datos
        const newPet = await petsService.create(petData);
        
        // Enviar respuesta exitosa
        res.status(201).json(newPet);
    } catch (error) {
        next(error);
    }
};

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
 *                 description: Nuevo nombre de la mascota
 *               species:
 *                 type: string
 *                 enum: [Perro, Gato, Conejo, Otro]
 *                 description: Nueva especie de la mascota
 *               breed:
 *                 type: string
 *                 description: Nueva raza de la mascota
 *               age:
 *                 type: number
 *                 description: Nueva edad de la mascota en años
 *               gender:
 *                 type: string
 *                 enum: [Macho, Hembra]
 *                 description: Nuevo género de la mascota
 *               size:
 *                 type: string
 *                 enum: [Pequeño, Mediano, Grande]
 *                 description: Nuevo tamaño de la mascota
 *               status:
 *                 type: string
 *                 enum: [Disponible, En Proceso, Adoptado]
 *                 description: Nuevo estado de adopción
 *               description:
 *                 type: string
 *                 description: Nueva descripción de la mascota
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
 *                 message:
 *                   type: string
 *                   example: Mascota actualizada exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Error en los datos de entrada
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       403:
 *         description: No tienes permiso para actualizar esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
const updatePet = async (req, res, next) => {
    try {
        // Verificar que la mascota exista
        const pet = await petsService.getById(req.params.id);
        
        if (!pet) {
            return next(new AppError('No se encontró ninguna mascota con ese ID', 404));
        }
        
        // Actualizar la mascota
        const updatedPet = await petsService.update(req.params.id, req.body);
        
        res.status(200).json({
            status: 'success',
            data: { pet: updatedPet }
        });
    } catch (error) {
        next(error);
    }
};

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
 *                   example: Mascota eliminada exitosamente
 *       401:
 *         description: No autorizado - Se requiere autenticación
 *       403:
 *         description: No tienes permiso para eliminar esta mascota
 *       404:
 *         description: Mascota no encontrada
 */
const deletePet = async (req, res, next) => {
    try {
        // Verificar que la mascota exista
        const pet = await petsService.getById(req.params.id);
        
        if (!pet) {
            return next(new AppError('No se encontró ninguna mascota con ese ID', 404));
        }
        
        // Eliminar la mascota
        await petsService.delete(req.params.id);
        
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllPets,
    getPetById,
    createPet,
    updatePet,
    deletePet
};