import { expect } from 'chai';
import mongoose from 'mongoose';

describe('MongoDB Connection Test', () => {
  before(async () => {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/adoptme-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  after(async () => {
    // Cerrar la conexión
    await mongoose.connection.close();
  });

  it('should connect to MongoDB', () => {
    expect(mongoose.connection.readyState).to.equal(1); // 1 = connected
  });

  it('should be able to perform a simple query', async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    expect(collections).to.be.an('array');
  });
});
