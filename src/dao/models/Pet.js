import mongoose from 'mongoose';

const collection = 'Pets';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    species: {
        type: String,
        required: true,
        enum: ['Perro', 'Gato', 'Conejo', 'Otro']
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        required: true,
        enum: ['Macho', 'Hembra', 'Desconocido']
    },
    size: {
        type: String,
        required: true,
        enum: ['Pequeño', 'Mediano', 'Grande']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Disponible', 'Reservado', 'Adoptado'],
        default: 'Disponible'
    }
}, {
    versionKey: false
});

// Índice para búsquedas frecuentes
schema.index({ species: 1, status: 1 });

const Pet = mongoose.model(collection, schema);

export default Pet;