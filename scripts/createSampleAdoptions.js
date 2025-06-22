import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Importar modelos
import User from '../src/dao/models/User.js';
import Pet from '../src/dao/models/Pet.js';
import Adoption from '../src/dao/models/Adoption.js';

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
async function createSampleAdoptions() {
    try {
        // Conectar a la base de datos
        const connected = await connectDB();
        if (!connected) {
            process.exit(1);
        }

        // Los modelos ya están importados al inicio del archivo

        // Limpiar adopciones existentes
        await Adoption.deleteMany({});
        console.log('Adopciones existentes eliminadas');

        // Obtener usuarios y mascotas
        const users = await User.find().limit(2);
        const availablePets = await Pet.find({ status: 'Disponible' }).limit(2);

        if (users.length === 0 || availablePets.length === 0) {
            console.log('No hay suficientes usuarios o mascotas disponibles');
            process.exit(1);
        }

        // Crear adopciones
        const adoptions = [];
        for (let i = 0; i < Math.min(users.length, availablePets.length); i++) {
            const adoption = new Adoption({
                owner: users[i]._id,
                pet: availablePets[i]._id
            });
            
            // Actualizar estado de la mascota
            await Pet.findByIdAndUpdate(availablePets[i]._id, { status: 'Adoptado' });
            
            const savedAdoption = await adoption.save();
            adoptions.push(savedAdoption);
            
            console.log(`Creada adopción: ${users[i].email} adoptó a ${availablePets[i].name}`);
        }

        console.log(`\nTotal de adopciones creadas: ${adoptions.length}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }
}

// Ejecutar el script
createSampleAdoptions();
