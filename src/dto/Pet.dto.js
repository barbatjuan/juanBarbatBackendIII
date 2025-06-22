export default class PetDTO {
    static getPetInputFrom = (pet) => {
        return {
            name: pet.name || '',
            species: pet.species || 'Otro',
            breed: pet.breed || 'Mestizo',
            age: parseInt(pet.age) || 0,
            gender: pet.gender || 'Desconocido',
            size: pet.size || 'Mediano',
            description: pet.description || '',
            status: pet.status || 'Disponible'
        };
    };

    static getPetOutputFrom = (pet) => {
        return {
            _id: pet._id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed,
            age: pet.age,
            gender: pet.gender,
            size: pet.size,
            description: pet.description,
            status: pet.status
        };
    };
}