import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Importar modelo de mascota
import Pet from '../src/dao/models/Pet.js';

// Datos de ejemplo para mascotas
const samplePets = [
    {
        name: 'Max',
        species: 'Perro',
        breed: 'Labrador',
        age: 3,
        gender: 'Macho',
        size: 'Grande',
        description: 'Max es un perro muy juguetón y cariñoso. Le encanta jugar a la pelota y dar largos paseos.',
        status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&auto=format&fit=crop&q=60'
    },
    {
        name: 'Luna',
        species: 'Gato',
        breed: 'Siamés',
        age: 2,
        gender: 'Hembra',
        size: 'Pequeño',
        description: 'Luna es una gata tranquila y cariñosa. Le gusta dormir en lugares cómodos y recibir mimos.',
        status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=60'
    },
    {
        name: 'Rocky',
        species: 'Perro',
        breed: 'Bulldog Francés',
        age: 4,
        gender: 'Macho',
        size: 'Mediano',
        description: 'Rocky es un perro tranquilo y amigable. Se lleva bien con niños y otros animales.',
        status: 'Disponible',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=60'
    }
];

// Conectar a MongoDB
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/adoptme', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB');
        return true;
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        return false;
    }
}

// Función principal
async function createSamplePets() {
    try {
        // Conectar a la base de datos
        const connected = await connectDB();
        if (!connected) {
            process.exit(1);
        }

        // Limpiar mascotas existentes (opcional, comentado para no borrar datos existentes)
        // await Pet.deleteMany({});
        // console.log('Mascotas existentes eliminadas');

        // Crear mascotas de ejemplo
        const createdPets = [];
        for (const petData of samplePets) {
            const pet = new Pet(petData);
            const savedPet = await pet.save();
            createdPets.push(savedPet);
            console.log(`Creada mascota: ${savedPet.name} (${savedPet.species})`);
        }

        console.log(`\nTotal de mascotas creadas: ${createdPets.length}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }
}

// Ejecutar el script
createSamplePets();
