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

async function checkUser() {
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
      role: user.role,
      createdAt: user.createdAt
    });
    
    // Verificar contraseña
    const isValid = await bcrypt.compare('123456', user.password);
    console.log('¿Es la contraseña 123456 válida?', isValid);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkUser();
