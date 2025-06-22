import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/es';
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

// Configurar mongoose
mongoose.set('strictQuery', false);

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

// Función para limpiar la base de datos
async function cleanDatabase() {
    try {
        await User.deleteMany({});
        await Pet.deleteMany({});
        await Adoption.deleteMany({});
        console.log('Base de datos limpiada');
        return true;
    } catch (error) {
        console.error('Error limpiando la base de datos:', error);
        return false;
    }
}

// Función para crear usuarios
async function createUsers() {
    try {
        // Crear administradores
        const admin1 = new User({
            first_name: 'Admin',
            last_name: 'Uno',
            email: 'admin1@adoptme.com',
            password: await bcrypt.hash('123456', 10),
            role: 'admin'
        });

        const admin2 = new User({
            first_name: 'Admin',
            last_name: 'Dos',
            email: 'admin2@adoptme.com',
            password: await bcrypt.hash('123456', 10),
            role: 'admin'
        });

        // Crear usuarios regulares
        const users = [admin1, admin2];
        
        for (let i = 1; i <= 18; i++) {
            const user = new User({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: `user${i}@adoptme.com`,
                password: await bcrypt.hash('password123', 10),
                role: 'user'
            });
            users.push(user);
        }

        // Guardar todos los usuarios
        await User.insertMany(users);
        console.log(`Creados ${users.length} usuarios (2 admin, 18 usuarios regulares)`);
        return users;
    } catch (error) {
        console.error('Error creando usuarios:', error);
        return [];
    }
}

// Función para crear mascotas
async function createPets() {
    try {
        const pets = [];
        const species = ['Perro', 'Gato'];
        
        // Razas de perros y gatos
        const dogBreeds = [
            'Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog Francés',
            'Beagle', 'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dálmata',
            'Chihuahua', 'Bulldog Inglés', 'Pug', 'Husky Siberiano', 'Dóberman',
            'Gran Danés', 'Schnauzer', 'Pomerania', 'Shih Tzu', 'Border Collie'
        ];

        const catBreeds = [
            'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Esfinge', 'Azul Ruso',
            'Británico de Pelo Corto', 'Ragdoll', 'Siberiano', 'Angora Turco',
            'Scottish Fold', 'Birmano', 'Abisinio', 'Somalí', 'Burmés',
            'Bombay', 'Maine Coon', 'Oriental', 'Somalí', 'Van Turco'
        ];

        // Crear 45 perros
        for (let i = 0; i < 45; i++) {
            const pet = new Pet({
                name: faker.person.firstName(),
                species: 'Perro',
                breed: faker.helpers.arrayElement(dogBreeds),
                age: faker.number.int({ min: 1, max: 15 }),
                gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
                size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
                description: faker.lorem.paragraph(),
                status: 'Disponible',
                image: 'https://source.unsplash.com/random/300x300/?dog'
            });
            pets.push(pet);
        }

        // Crear 45 gatos
        for (let i = 0; i < 45; i++) {
            const pet = new Pet({
                name: faker.person.firstName(),
                species: 'Gato',
                breed: faker.helpers.arrayElement(catBreeds),
                age: faker.number.int({ min: 1, max: 18 }),
                gender: faker.helpers.arrayElement(['Macho', 'Hembra']),
                size: faker.helpers.arrayElement(['Pequeño', 'Mediano']),
                description: faker.lorem.paragraph(),
                status: 'Disponible',
                image: 'https://source.unsplash.com/random/300x300/?cat'
            });
            pets.push(pet);
        }

        // Guardar todas las mascotas
        await Pet.insertMany(pets);
        console.log(`Creadas ${pets.length} mascotas (45 perros, 45 gatos)`);
        return pets;
    } catch (error) {
        console.error('Error creando mascotas:', error);
        return [];
    }
}

// Función para crear adopciones
async function createAdoptions(users, pets) {
    try {
        const adoptions = [];
        const availablePets = [...pets];
        
        // Crear una adopción para cada usuario (excepto admin1 y admin2)
        for (let i = 2; i < users.length && availablePets.length > 0; i++) {
            const randomPetIndex = Math.floor(Math.random() * availablePets.length);
            const pet = availablePets.splice(randomPetIndex, 1)[0];
            
            const adoption = new Adoption({
                owner: users[i]._id,
                pet: pet._id
            });
            
            // Actualizar estado de la mascota
            await Pet.findByIdAndUpdate(pet._id, { status: 'Adoptado' });
            
            adoptions.push(await adoption.save());
        }
        
        console.log(`Creadas ${adoptions.length} adopciones`);
        return adoptions;
    } catch (error) {
        console.error('Error creando adopciones:', error);
        return [];
    }
}

// Función principal
async function seedDatabase() {
    try {
        // Conectar a la base de datos
        const connected = await connectDB();
        if (!connected) {
            process.exit(1);
        }
        
        console.log('Iniciando proceso de semillado de la base de datos...');
        
        // Limpiar la base de datos
        await cleanDatabase();
        
        // Crear usuarios
        const users = await createUsers();
        
        // Crear mascotas
        const pets = await createPets();
        
        // Crear adopciones
        await createAdoptions(users, pets);
        
        console.log('\n¡Base de datos poblada exitosamente!');
        console.log('\nCredenciales de administradores:');
        console.log('- admin1@adoptme.com / 123456');
        console.log('- admin2@adoptme.com / 123456');
        console.log('\nCredenciales de usuarios (todos con contraseña "password123"):');
        console.log('user1@adoptme.com a user18@adoptme.com');
        
    } catch (error) {
        console.error('Error en el proceso de semillado:', error);
    } finally {
        // Cerrar la conexión
        await mongoose.connection.close();
        console.log('Conexión cerrada');
    }
}

// Ejecutar el script
seedDatabase();
