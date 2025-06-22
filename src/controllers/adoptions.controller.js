import { adoptionsService, petsService, usersService } from "../services/index.js"

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
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 */
const getAllAdoptions = async(req,res)=>{
    try {
        const adoptions = await adoptionsService.getAll({});
        // Popular la información del dueño y la mascota
        const populatedAdoptions = await Promise.all(adoptions.map(async (adoption) => {
            const owner = await usersService.getUserById(adoption.owner);
            const pet = await petsService.getBy({_id: adoption.pet});
            return {
                ...adoption._doc,
                owner: {
                    _id: owner._id,
                    name: `${owner.first_name} ${owner.last_name}`,
                    email: owner.email
                },
                pet: {
                    _id: pet._id,
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed
                }
            };
        }));
        
        res.status(200).json({
            status: "success",
            count: populatedAdoptions.length,
            payload: populatedAdoptions
        });
    } catch (error) {
        console.error('Error en getAllAdoptions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener las adopciones'
        });
    }
}

/**
 * @swagger
 * /api/adoptions/{id}:
 *   get:
 *     summary: Obtiene una adopción por ID
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               $ref: '#/components/schemas/Adoption'
 *       404:
 *         description: Adopción no encontrada
 */
const getAdoption = async(req,res)=>{
    try {
        const adoptionId = req.params.id;
        const adoption = await adoptionsService.getBy({_id: adoptionId});
        
        if(!adoption) {
            return res.status(404).json({
                status: "error",
                message: "Adopción no encontrada"
            });
        }

        // Obtener información del dueño y la mascota
        const owner = await usersService.getUserById(adoption.owner);
        const pet = await petsService.getBy({_id: adoption.pet});

        const populatedAdoption = {
            ...adoption._doc,
            owner: {
                _id: owner._id,
                name: `${owner.first_name} ${owner.last_name}`,
                email: owner.email
            },
            pet: {
                _id: pet._id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                age: pet.age,
                gender: pet.gender
            }
        };

        res.status(200).json({
            status: "success",
            payload: populatedAdoption
        });
    } catch (error) {
        console.error('Error en getAdoption:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al obtener la adopción'
        });
    }
}

/**
 * @swagger
 * /api/adoptions/user/{userId}/pet/{petId}:
 *   post:
 *     summary: Crea una nueva adopción
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario que adopta
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la mascota a adoptar
 *     responses:
 *       201:
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
 *                   example: Mascota adoptada exitosamente
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: La mascota ya ha sido adoptada
 *       404:
 *         description: Usuario o mascota no encontrados
 */
const createAdoption = async(req,res)=>{
    try {
        const { uid, pid } = req.params;
        console.log('Intentando crear adopción para usuario:', uid, 'y mascota:', pid);
        
        if (!uid || !pid) {
            console.log('Faltan parámetros en la URL');
            return res.status(400).json({
                status: "error",
                message: "Se requieren tanto el ID del usuario como el de la mascota"
            });
        }
        
        // Verificar que el usuario existe
        console.log('Buscando usuario con ID:', uid);
        const user = await usersService.getUserById(uid);
        console.log('Resultado de búsqueda de usuario:', user ? 'Usuario encontrado' : 'Usuario no encontrado');
        
        if(!user) {
            console.log('Usuario no encontrado con ID:', uid);
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }
        
        // Verificar que la mascota existe
        const pet = await petsService.getBy({_id: pid});
        if(!pet) {
            return res.status(404).json({
                status: "error",
                message: "Mascota no encontrada"
            });
        }
        
        // Verificar que la mascota no esté ya adoptada
        if(pet.status === 'Adoptado') {
            return res.status(400).json({
                status: "error",
                message: "La mascota ya ha sido adoptada"
            });
        }
        
        // Actualizar la lista de mascotas del usuario
        user.pets.push(pet._id);
        await usersService.update(user._id, {pets: user.pets});
        
        // Actualizar el estado de la mascota
        await petsService.update(pet._id, {status: 'Adoptado'});
        
        // Crear el registro de adopción
        const newAdoption = await adoptionsService.create({
            owner: user._id,
            pet: pet._id,
            adoptionDate: new Date()
        });

        // Obtener la adopción con la información poblada
        const populatedAdoption = {
            ...newAdoption._doc,
            owner: {
                _id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email
            },
            pet: {
                _id: pet._id,
                name: pet.name,
                species: pet.species,
                breed: pet.breed
            }
        };
        
        res.status(201).json({
            status: "success",
            message: "Mascota adoptada exitosamente",
            payload: populatedAdoption
        });
    } catch (error) {
        console.error('Error en createAdoption:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al procesar la adopción',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}