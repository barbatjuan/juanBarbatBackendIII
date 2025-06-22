import mongoose from 'mongoose';

const TEST_DB_URI = 'mongodb://localhost:27017/adoptme-test';

async function testConnection() {
  try {
    await mongoose.connect(TEST_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Colecciones en la base de datos:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Verificar si la colección de usuarios existe
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      console.log('\n👥 La colección de usuarios existe');
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`📊 Número de usuarios: ${userCount}`);
    } else {
      console.log('\n❌ La colección de usuarios no existe');
    }
    
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
  }
}

testConnection();
