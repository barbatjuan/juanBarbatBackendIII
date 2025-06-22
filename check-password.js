import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from './src/dao/models/User.js';

// Configuración de rutas y entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/adoptme';

async function checkPassword() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conectado a MongoDB');
    
    // Buscar el usuario admin1@adoptme.com
    const user = await User.findOne({ email: 'admin1@adoptme.com' });
    
    if (!user) {
      console.log('Usuario admin1@adoptme.com no encontrado');
      return;
    }
    
    console.log('Usuario encontrado:');
    console.log({
      email: user.email,
      password: user.password, // Mostrar el hash de la contraseña
      role: user.role,
    });
    
    // Verificar la contraseña directamente con bcrypt
    const passwordToCheck = '123456';
    const isMatch = await bcrypt.compare(passwordToCheck, user.password);
    
    console.log(`\nVerificando contraseña: ${passwordToCheck}`);
    console.log('¿La contraseña es válida?', isMatch);
    
    if (!isMatch) {
      console.log('\nPosibles causas:');
      console.log('1. La contraseña no coincide con el hash almacenado');
      console.log('2. El hash podría estar corrupto o en un formato diferente');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkPassword();
