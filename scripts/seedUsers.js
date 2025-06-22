import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/dao/models/User.js';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/adoptme');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Datos de ejemplo para usuarios
const firstNames = [
    'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofía', 'Diego', 'Valentina',
    'Andrés', 'Camila', 'Javier', 'Isabella', 'Miguel', 'Valeria', 'José', 'Gabriela', 'David', 'Lucía'
];

const lastNames = [
    'González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'Sánchez', 'Romero',
    'Torres', 'Álvarez', 'Ruiz', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina', 'Herrera', 'Gutiérrez'
];

const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'protonmail.com'];

// Generar usuarios de ejemplo
const generateUsers = async (count = 20) => {
    const users = [];
    const password = await bcrypt.hash('password123', 10); // Contraseña por defecto para todos los usuarios
    
    // Crear administradores
    users.push({
        first_name: 'Admin',
        last_name: 'Uno',
        email: 'admin1@adoptme.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin'
    });
    
    users.push({
        first_name: 'Admin',
        last_name: 'Dos',
        email: 'admin2@adoptme.com',
        password: await bcrypt.hash('123456', 10),
        role: 'admin'
    });

    // Crear usuarios regulares
    for (let i = 0; i < count - 1; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(domains)}`;
        
        users.push({
            first_name: firstName,
            last_name: lastName,
            email: email.replace(/[^a-zA-Z0-9@.]/g, ''), // Limpiar caracteres especiales
            password: password,
            role: 'user'
        });
    }
    
    return users;
};

// Función de ayuda
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Función principal
const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Eliminar todos los usuarios existentes (excepto los administradores)
        await User.deleteMany({ 
            email: { 
                $nin: ['admin1@adoptme.com', 'admin2@adoptme.com'] 
            } 
        });
        console.log('Usuarios existentes han sido eliminados (excepto administradores)');
        
        // Verificar si los administradores ya existen
        const admin1Exists = await User.findOne({ email: 'admin1@adoptme.com' });
        const admin2Exists = await User.findOne({ email: 'admin2@adoptme.com' });
        
        // Generar y guardar nuevos usuarios
        const users = await generateUsers(20); // Generar 20 usuarios (2 admins + 18 regulares)
        
        // Si los administradores no existen, los agregamos
        if (!admin1Exists) {
            await User.create(users[0]);
            console.log('Usuario administrador 1 creado');
        }
        
        if (!admin2Exists) {
            await User.create(users[1]);
            console.log('Usuario administrador 2 creado');
        }
        
        // Insertar el resto de usuarios (excluyendo los 2 primeros que son admins)
        await User.insertMany(users.slice(2));
        
        console.log(`Se han creado ${users.length} usuarios de ejemplo`);
        console.log('\nCredenciales de administradores:');
        console.log('Admin 1:');
        console.log('  Email: admin1@adoptme.com');
        console.log('  Contraseña: 123456');
        console.log('\nAdmin 2:');
        console.log('  Email: admin2@adoptme.com');
        console.log('  Contraseña: 123456');
        console.log('\nLos demás usuarios pueden iniciar sesión con la contraseña: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar el script
seedDatabase();
