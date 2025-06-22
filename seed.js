import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './src/dao/models/User.js';
import Pet from './src/dao/models/Pet.js';
import Adoption from './src/dao/models/Adoption.js';

// Configuración de rutas y entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde .env si existe localmente
try {
  dotenv.config({ path: path.join(__dirname, '.env') });
} catch (error) {
  console.log('No se encontró archivo .env local, usando variables de entorno del contenedor');
}

// Conectar a MongoDB - Usar MONGO_URI del entorno o la configuración por defecto para Docker
const MONGO_URI = process.env.MONGO_URI || 'mongodb://adoptme-mongo:27017/adoptme';

console.log('Conectando a MongoDB con URI:', MONGO_URI);

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Nombres y apellidos para generar usuarios realistas
const firstNames = [
  'Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Laura', 'Pedro', 'Sofía', 'Diego', 'Valentina',
  'Andrés', 'Camila', 'Javier', 'Paula', 'Miguel', 'Daniela', 'Alejandro', 'Lucía', 'José', 'Mariana'
];

const lastNames = [
  'González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez', 'Pérez', 'Sánchez', 'Romero',
  'Sosa', 'Torres', 'Álvarez', 'Ruiz', 'Ramírez', 'Flores', 'Acosta', 'Benítez', 'Medina', 'Herrera'
];

// Razas de perros y gatos
const dogBreeds = [
  'Labrador Retriever', 'Pastor Alemán', 'Golden Retriever', 'Bulldog Francés', 'Beagle',
  'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dálmata', 'Chihuahua', 'Bulldog Inglés',
  'Pug', 'Husky Siberiano', 'Doberman', 'Gran Danés', 'Shih Tzu', 'Bichón Frisé', 'Pomerania', 'Maltés'
];

const catBreeds = [
  'Siamés', 'Persa', 'Maine Coon', 'Bengalí', 'Esfinge', 'Azul Ruso', 'Británico de Pelo Corto',
  'Ragdoll', 'Siberiano', 'Birmano', 'Abisinio', 'Somalí', 'Angora Turco', 'Scottish Fold', 'Maine Coon',
  'Bombay', 'Burmés', 'Sagrado de Birmania', 'Oriental', 'Nebelung'
];

// Tamaños para las mascotas
const sizes = ['Pequeño', 'Mediano', 'Grande'];

// Generar usuarios de prueba
const generateUsers = async (count = 20) => {
  const users = [];
  const password = await bcrypt.hash('123456', 10);

  // Crear administradores
  for (let i = 0; i < 2; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `admin${i+1}@adoptme.com`;
    
    users.push(new User({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role: 'admin'
    }));
  }

  // Crear usuarios regulares
  for (let i = 0; i < count - 2; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `user${i+1}@adoptme.com`;
    
    users.push(new User({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role: 'user'
    }));
  }

  // Guardar usuarios en lotes para mejorar el rendimiento
  const savedUsers = [];
  while (users.length > 0) {
    const batch = users.splice(0, 20);
    const savedBatch = await User.insertMany(batch);
    savedUsers.push(...savedBatch);
    console.log(`Guardado lote de ${savedBatch.length} usuarios`);
  }
  
  return savedUsers;
};

// Generar mascotas de prueba
const generatePets = async () => {
  const pets = [];
  const petNames = [
    'Max', 'Bella', 'Luna', 'Charlie', 'Lucy', 'Cooper', 'Lola', 'Rocky',
    'Milo', 'Sadie', 'Teddy', 'Chloe', 'Bear', 'Zoe', 'Duke', 'Stella'
  ];

  // Obtener usuarios para asignar como dueños
  const users = await User.find({}, '_id');
  
  // Generar 50 perros
  for (let i = 0; i < 50; i++) {
    const age = Math.floor(Math.random() * 15) + 1; // 1-15 años
    const gender = Math.random() > 0.5 ? 'Macho' : 'Hembra';
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const breed = dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    
    pets.push(new Pet({
      name: petNames[Math.floor(Math.random() * petNames.length)],
      species: 'Perro',
      breed,
      age,
      gender,
      size,
      description: `Hermoso perro de raza ${breed} de ${age} años. ${gender.toLowerCase()} muy cariñoso y juguetón.`,
      status: 'Disponible',
      image: `https://source.unsplash.com/random/400x400/?dog,${breed.split(' ').join(',')}&${i}`
    }));
  }
  
  // Generar 50 gatos
  for (let i = 0; i < 50; i++) {
    const age = Math.floor(Math.random() * 18) + 1; // 1-18 años
    const gender = Math.random() > 0.5 ? 'Macho' : 'Hembra';
    const size = sizes[Math.floor(Math.random() * 2)]; // Solo pequeño o mediano para gatos
    const breed = catBreeds[Math.floor(Math.random() * catBreeds.length)];
    
    pets.push(new Pet({
      name: petNames[Math.floor(Math.random() * petNames.length)],
      species: 'Gato',
      breed,
      age,
      gender,
      size,
      description: `Hermoso gato de raza ${breed} de ${age} años. ${gender.toLowerCase()} muy cariñoso y tranquilo.`,
      status: 'Disponible',
      image: `https://source.unsplash.com/random/400x400/?cat,${breed.split(' ').join(',')}&${i}`
    }));
  }

  // Guardar mascotas en lotes
  const savedPets = [];
  while (pets.length > 0) {
    const batch = pets.splice(0, 20);
    const savedBatch = await Pet.insertMany(batch);
    savedPets.push(...savedBatch);
    console.log(`Guardado lote de ${savedBatch.length} mascotas`);
  }
  
  return savedPets;
};

// Generar 10 adopciones de prueba
const generateAdoptions = async () => {
  const adoptions = [];
  const statuses = ['pending', 'approved', 'rejected'];
  
  // Obtener usuarios y mascotas no adoptadas
  const users = await User.find({ role: 'user' }, '_id first_name last_name email');
  const availablePets = await Pet.find({ status: 'Disponible' }, '_id name species breed');
  
  // Tomar hasta 10 mascotas disponibles para adopción
  const petsToAdopt = availablePets.slice(0, 10);
  
  console.log(`\nGenerando ${petsToAdopt.length} adopciones de prueba...`);
  
  for (const pet of petsToAdopt) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const isApproved = randomStatus === 'approved';
    
    // Actualizar el estado de la mascota según la adopción
    await Pet.findByIdAndUpdate(pet._id, { 
      status: isApproved ? 'Adoptado' : 'Disponible' 
    });
    
    // Crear la adopción
    const adoption = new Adoption({
      owner: randomUser._id,
      pet: pet._id,
      status: randomStatus,
      adoptionDate: new Date(),
      notes: `Solicitud de adopción para ${pet.name} (${pet.species} - ${pet.breed})`
    });
    
    // Agregar la mascota al array de mascotas del usuario si fue aprobada
    if (isApproved) {
      await User.findByIdAndUpdate(randomUser._id, {
        $addToSet: { pets: pet._id }
      });
    }
    
    await adoption.save();
    adoptions.push(adoption);
    
    console.log(`Adopción creada: ${randomUser.first_name} ${randomUser.last_name} -> ${pet.name} (${pet.species}) - Estado: ${randomStatus}`);
  }
  
  console.log(`\n¡Se crearon ${adoptions.length} adopciones de prueba exitosamente!`);
  return adoptions;
};

// Función principal
const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Limpiar colecciones
    console.log('Limpiando colecciones...');
    await User.deleteMany({});
    await Pet.deleteMany({});
    
    // Generar datos
    console.log('Generando 20 usuarios (2 admin, 18 usuarios normales)...');
    await generateUsers();
    
    console.log('Generando 100 mascotas (50 perros y 50 gatos)...');
    await generatePets();
    
    // Generar 10 adopciones de prueba
    console.log('Generando 10 adopciones de prueba...');
    await generateAdoptions();
    
    console.log('¡Datos de prueba generados exitosamente!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error al generar datos de prueba:', error);
    process.exit(1);
  }
};

// Ejecutar el script
seedDatabase();
