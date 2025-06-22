import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/dao/models/User.js';
import Pet from '../src/dao/models/Pet.js';
import Adoption from '../src/dao/models/Adoption.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configurar rutas para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../.env') });

// Conectar a la base de datos
const connectDB = async () => {
    try {
        // Usar directamente la cadena de conexión
        const mongoUri = 'mongodb://localhost:27017/adoptme';
        
        console.log(`Conectando a MongoDB: ${mongoUri}`);
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a MongoDB exitosamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Función principal
const seedAdoptions = async () => {
    try {
        await connectDB();
        
        // Limpiar adopciones existentes
        await Adoption.deleteMany({});
        console.log('Adopciones existentes eliminadas');
        
        // Obtener usuarios y mascotas disponibles
        const users = await User.find().limit(5); // Tomar los primeros 5 usuarios
        const availablePets = await Pet.find({ status: 'Disponible' }).limit(5); // Tomar las primeras 5 mascotas disponibles
        
        if (users.length === 0 || availablePets.length === 0) {
            console.error('No hay suficientes usuarios o mascotas disponibles para crear adopciones');
            process.exit(1);
        }
        
        // Crear adopciones de ejemplo
        const adoptions = [];
        
        // Crear una adopción para cada usuario con una mascota disponible
        for (let i = 0; i < Math.min(users.length, availablePets.length); i++) {
            const adoption = new Adoption({
                owner: users[i]._id,
                pet: availablePets[i]._id
            });
            
            // Actualizar el estado de la mascota a 'Adoptado'
            await Pet.findByIdAndUpdate(availablePets[i]._id, { status: 'Adoptado' });
            
            adoptions.push(await adoption.save());
        }
        
        console.log(`\nSe han creado ${adoptions.length} adopciones de ejemplo`);
        console.log('\nResumen de adopciones creadas:');
        
        // Mostrar resumen
        for (const adoption of adoptions) {
            const user = await User.findById(adoption.owner);
            const pet = await Pet.findById(adoption.pet);
            console.log(`- ${user.first_name} ${user.last_name} adoptó a ${pet.name} (${pet.species})`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error al sembrar la base de datos con adopciones:', error);
        process.exit(1);
    }
};

// Ejecutar el script
seedAdoptions();
