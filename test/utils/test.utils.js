import { faker } from '@faker-js/faker/locale/es';

export const generateUserData = (overrides = {}) => {
  // Crear un objeto con los valores por defecto
  const defaultUser = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'Coder123!',
    role: 'user',
    phone: faker.phone.number(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode()
    }
  };

  // Combinar los valores por defecto con los sobrescritos
  return {
    ...defaultUser,
    ...overrides,
    // Para el campo address, necesitamos combinarlo manualmente
    address: {
      ...defaultUser.address,
      ...(overrides.address || {})
    }
  };
};

export const generatePetData = (overrides = {}) => {
  const species = faker.helpers.arrayElement(['Perro', 'Gato', 'Conejo', 'Otro']);
  
  // Campos obligatorios según el modelo
  const defaultPet = {
    name: species === 'Perro' ? faker.animal.dog() : 
          species === 'Gato' ? faker.animal.cat() :
          species === 'Conejo' ? 'Conejo' : 'Mascota',
    species: species,
    breed: species === 'Perro' ? faker.animal.dog() : 
           species === 'Gato' ? faker.animal.cat() :
           species === 'Conejo' ? `${faker.color.human()} ${faker.animal.rabbit()}` : 'Mestizo',
    age: faker.number.int({ min: 0, max: 15 }),
    gender: faker.helpers.arrayElement(['Macho', 'Hembra', 'Desconocido']),
    size: faker.helpers.arrayElement(['Pequeño', 'Mediano', 'Grande']),
    description: faker.lorem.paragraph(),
    status: 'Disponible',
    image: faker.image.url({ width: 400, height: 400 }),
    location: {
      city: faker.location.city(),
      state: faker.location.state()
    },
    owner: null,
    isAdopted: false
  };

  // Combinar con los valores sobrescritos, teniendo cuidado con los objetos anidados
  return {
    ...defaultPet,
    ...overrides,
    location: {
      ...defaultPet.location,
      ...(overrides.location || {})
    }
  };
};

export const generateAdoptionData = (petId, userId, overrides = {}) => ({
  pet: petId,
  user: userId,
  status: 'pending',
  notes: faker.lorem.sentence(),
  ...overrides
});

export const loginTestUser = async (request, userData) => {
  // Registrar usuario de prueba
  await request
    .post('/api/sessions/register')
    .send(userData);

  // Iniciar sesión
  const loginRes = await request
    .post('/api/sessions/login')
    .send({
      email: userData.email,
      password: userData.password
    });

  return {
    token: loginRes.body.token,
    user: loginRes.body.user
  };
};

export const createTestPet = async (request, token, petData = {}) => {
  const pet = generatePetData(petData);
  const res = await request
    .post('/api/pets')
    .set('Authorization', `Bearer ${token}`)
    .send(pet);
  return res.body;
};

export const createTestAdoption = async (request, token, petId, adoptionData = {}) => {
  const adoption = generateAdoptionData(petId, null, adoptionData);
  const res = await request
    .post('/api/adoptions')
    .set('Authorization', `Bearer ${token}`)
    .send(adoption);
  return res.body;
};
