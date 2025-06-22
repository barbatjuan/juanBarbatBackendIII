import GenericRepository from "./GenericRepository.js";
import PetDTO from "../dto/Pet.dto.js";

/**
 * Repositorio para operaciones relacionadas con mascotas
 */
export default class PetRepository extends GenericRepository {
    constructor(dao) {
        super(dao);
    }

    /**
     * Obtiene todas las mascotas con opción de filtrado
     * @param {Object} filter - Objeto de filtro (opcional)
     * @returns {Promise<Array>} Lista de mascotas
     */
    async getAll(filter = {}) {
        try {
            const pets = await this.dao.get(filter);
            return pets.map(pet => PetDTO.getPetOutputFrom(pet));
        } catch (error) {
            console.error('Error en PetRepository.getAll:', error);
            throw error;
        }
    }

    /**
     * Obtiene una mascota por su ID
     * @param {string} id - ID de la mascota
     * @returns {Promise<Object>} Mascota encontrada
     */
    async getById(id) {
        try {
            const pet = await this.dao.getById(id);
            if (!pet) {
                const error = new Error('Mascota no encontrada');
                error.status = 404;
                throw error;
            }
            return PetDTO.getPetOutputFrom(pet);
        } catch (error) {
            console.error('Error en PetRepository.getById:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva mascota
     * @param {Object} petData - Datos de la mascota
     * @returns {Promise<Object>} Mascota creada
     */
    async create(petData) {
        try {
            const petInput = PetDTO.getPetInputFrom(petData);
            const newPet = await this.dao.save(petInput);
            return PetDTO.getPetOutputFrom(newPet);
        } catch (error) {
            console.error('Error en PetRepository.create:', error);
            throw error;
        }
    }

    /**
     * Actualiza una mascota existente
     * @param {string} id - ID de la mascota
     * @param {Object} updates - Campos a actualizar
     * @returns {Promise<Object>} Mascota actualizada
     */
    async update(id, updates) {
        try {
            // Aseguramos que solo se actualicen los campos permitidos
            const allowedUpdates = ['name', 'species', 'breed', 'age', 'gender', 'size', 'description', 'status', 'location', 'images'];
            const filteredUpdates = Object.keys(updates)
                .filter(key => allowedUpdates.includes(key))
                .reduce((obj, key) => {
                    obj[key] = updates[key];
                    return obj;
                }, {});

            const updatedPet = await this.dao.update(id, filteredUpdates);
            return PetDTO.getPetOutputFrom(updatedPet);
        } catch (error) {
            console.error('Error en PetRepository.update:', error);
            throw error;
        }
    }

    /**
     * Elimina una mascota
     * @param {string} id - ID de la mascota
     * @returns {Promise<Object>} Mascota eliminada
     */
    async delete(id) {
        try {
            const pet = await this.getById(id);
            if (!pet) {
                const error = new Error('Mascota no encontrada');
                error.status = 404;
                throw error;
            }
            await this.dao.delete(id);
            return pet;
        } catch (error) {
            console.error('Error en PetRepository.delete:', error);
            throw error;
        }
    }


}