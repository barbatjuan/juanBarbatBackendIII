import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pet from '../src/dao/models/Pet.js';

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

// Datos de ejemplo para perros
const dogBreeds = [
    'Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog Francés', 'Beagle',
    'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dálmata', 'Chihuahua',
    'Bulldog Inglés', 'Pug', 'Husky Siberiano', 'Dóberman', 'Shih Tzu', 'Gran Danés',
    'Border Collie', 'Pomerania', 'Schnauzer Miniatura'
];

// Datos de ejemplo para gatos
const catBreeds = [
    'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Esfinge', 'Ragdoll', 'British Shorthair',
    'Scottish Fold', 'Siberiano', 'Azul Ruso', 'Bombay', 'Birmano', 'Abisinio', 'Angora Turco',
    'Somalí', 'Burmés', 'Nebelung', 'Savannah', 'Peterbald', 'Munchkin'
];

// Nombres para mascotas
const petNames = [
    'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Lucy', 'Buddy', 'Daisy', 'Rocky', 'Molly',
    'Bear', 'Sadie', 'Duke', 'Maggie', 'Toby', 'Sophie', 'Jack', 'Chloe', 'Oliver', 'Lily',
    'Zeus', 'Zoe', 'Winston', 'Lola', 'Leo', 'Bailey', 'Milo', 'Coco', 'Oscar', 'Ruby',
    'Teddy', 'Rosie', 'Louie', 'Mia', 'Jax', 'Penny', 'Gus', 'Ellie', 'Sammy', 'Stella'
];

// Funciones de ayuda
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomAge = () => Math.floor(Math.random() * 15) + 1; // 1-15 años
const getRandomDescription = (name, species) => {
    const descriptions = [
        `${name} es un${species === 'Perro' ? '' : 'a'} ${species.toLowerCase()} muy juguetón y cariñoso.`,
        `Conoce a ${name}, un${species === 'Perro' ? '' : 'a'} adorable ${species.toLowerCase()} que está buscando un hogar.`,
        `${name} es un${species === 'Perro' ? '' : 'a'} ${species.toLowerCase()} tranquilo y amigable que se lleva bien con todos.`,
        `Este hermoso ${species.toLowerCase()} llamado ${name} está listo para ser parte de tu familia.`,
        `${name} es un${species === 'Perro' ? '' : 'a'} ${species.toLowerCase()} lleno de energía y amor para dar.`
    ];
    return getRandomElement(descriptions);
};

// Generar mascotas de ejemplo
const generatePets = () => {
    const pets = [];
    
    // Generar 50 perros
    for (let i = 0; i < 50; i++) {
        const name = getRandomElement(petNames);
        const breed = getRandomElement(dogBreeds);
        pets.push({
            name,
            species: 'Perro',
            breed,
            age: getRandomAge(),
            gender: getRandomElement(['Macho', 'Hembra']),
            size: getRandomElement(['Pequeño', 'Mediano', 'Grande']),
            description: getRandomDescription(name, 'Perro'),
            status: 'Disponible'
        });
    }
    
    // Generar 50 gatos
    for (let i = 0; i < 50; i++) {
        const name = getRandomElement(petNames);
        const breed = getRandomElement(catBreeds);
        pets.push({
            name,
            species: 'Gato',
            breed,
            age: getRandomAge(),
            gender: getRandomElement(['Macho', 'Hembra']),
            size: getRandomElement(['Pequeño', 'Mediano']),
            description: getRandomDescription(name, 'Gato'),
            status: 'Disponible'
        });
    }
    
    return pets;
};

// Función principal
const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Eliminar todas las mascotas existentes
        await Pet.deleteMany({});
        console.log('Todas las mascotas existentes han sido eliminadas');
        
        // Generar y guardar nuevas mascotas
        const pets = generatePets();
        await Pet.insertMany(pets);
        
        console.log(`Se han creado ${pets.length} mascotas de ejemplo (50 perros y 50 gatos)`);
        process.exit(0);
    } catch (error) {
        console.error('Error al sembrar la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar el script
seedDatabase();
