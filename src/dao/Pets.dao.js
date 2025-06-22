import petModel from "./models/Pet.js";

/**
 * Data Access Object para operaciones relacionadas con mascotas
 */
export default class Pet {
    /**
     * Obtiene todas las mascotas que coincidan con los parámetros de búsqueda
     * @param {Object} params - Parámetros de búsqueda
     * @returns {Promise<Array>} Lista de mascotas
     */
    get = async (params = {}) => {
        try {
            return await petModel.find(params).lean();
        } catch (error) {
            console.error('Error en get:', error);
            throw error;
        }
    }

    /**
     * Obtiene una mascota por su ID
     * @param {string} id - ID de la mascota
     * @returns {Promise<Object>} Mascota encontrada
     */
    getById = async (id) => {
        try {
            return await petModel.findById(id).lean();
        } catch (error) {
            console.error('Error en getById:', error);
            throw error;
        }
    }

    /**
     * Obtiene una mascota que coincida con los parámetros
     * @param {Object} params - Parámetros de búsqueda
     * @returns {Promise<Object>} Mascota encontrada
     */
    getBy = async (params) => {
        try {
            return await petModel.findOne(params).lean();
        } catch (error) {
            console.error('Error en getBy:', error);
            throw error;
        }
    }

    /**
     * Crea una nueva mascota
     * @param {Object} doc - Datos de la mascota
     * @returns {Promise<Object>} Mascota creada
     */
    save = async (doc) => {
        try {
            const newPet = new petModel(doc);
            await newPet.save();
            return await this.getById(newPet._id);
        } catch (error) {
            console.error('Error en save:', error);
            throw error;
        }
    }

    /**
     * Actualiza una mascota existente
     * @param {string} id - ID de la mascota
     * @param {Object} doc - Campos a actualizar
     * @returns {Promise<Object>} Mascota actualizada
     */
    update = async (id, doc) => {
        try {
            await petModel.findByIdAndUpdate(id, { $set: doc });
            return await this.getById(id);
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    /**
     * Elimina una mascota
     * @param {string} id - ID de la mascota
     * @returns {Promise<Object>} Mascota eliminada
     */
    delete = async (id) => {
        try {
            const deletedPet = await petModel.findByIdAndDelete(id).lean();
            return deletedPet;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
}