// Definición de los esquemas para Swagger/OpenAPI
export const schemas = {
  User: {
    type: 'object',
    required: ['first_name', 'last_name', 'email', 'role'],
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del usuario',
        example: '60f7b1b3b3f3b3b3b3b3b3b3b'
      },
      first_name: {
        type: 'string',
        description: 'Nombre del usuario',
        example: 'Juan'
      },
      last_name: {
        type: 'string',
        description: 'Apellido del usuario',
        example: 'Pérez'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com'
      },
      password: {
        type: 'string',
        description: 'Contraseña del usuario (hasheada)',
        writeOnly: true,
        example: '$2b$10$example...'
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        default: 'user',
        description: 'Rol del usuario',
        example: 'user'
      },
      pets: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60f7b1b3b3f3b3b3b3b3b3c'
            }
          }
        }
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de creación del usuario',
        example: '2023-07-20T12:00:00.000Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de última actualización del usuario',
        example: '2023-07-20T12:00:00.000Z'
      },
      __v: {
        type: 'number',
        description: 'Versión del documento',
        example: 0
      }
    }
  },
  Pet: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único de la mascota',
        example: '60f7b1b3b3f3b3b3b3b3b3c'
      },
      name: {
        type: 'string',
        example: 'Firulais',
        description: 'Nombre de la mascota'
      },
      specie: {
        type: 'string',
        example: 'Perro',
        description: 'Especie de la mascota',
        enum: ['Perro', 'Gato', 'Conejo', 'Otro']
      },
      birthDate: {
        type: 'string',
        format: 'date',
        example: '2020-01-01',
        description: 'Fecha de nacimiento de la mascota (YYYY-MM-DD)'
      },
      description: {
        type: 'string',
        example: 'Muy juguetón y cariñoso',
        description: 'Descripción de la mascota'
      },
      image: {
        type: 'string',
        format: 'uri',
        example: 'https://example.com/pet.jpg',
        description: 'URL de la imagen de la mascota'
      }
    }
  },
  Adoption: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único de la adopción',
        example: '60f7b1b3b3f3b3b3b3b3b3d'
      },
      pet: {
        $ref: '#/components/schemas/Pet'
      },
      user: {
        $ref: '#/components/schemas/User'
      },
      status: {
        type: 'string',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        description: 'Estado de la solicitud de adopción',
        example: 'pending'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de creación de la solicitud',
        example: '2023-07-20T12:00:00.000Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de última actualización',
        example: '2023-07-20T12:00:00.000Z'
      }
    }
  }
};

export const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Ingrese el token JWT en el formato: Bearer <token>'
  }
};
