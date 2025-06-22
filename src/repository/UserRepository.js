
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = (email) =>{
        return this.getBy({email});
    }
    getUserById = async (id) => {
        try {
            // Asegurarse de que el ID sea un ObjectId válido
            const mongoose = await import('mongoose');
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            return await this.getBy({ _id: new mongoose.Types.ObjectId(id) });
        } catch (error) {
            console.error('Error en getUserById:', error);
            return null;
        }
    }
    
}