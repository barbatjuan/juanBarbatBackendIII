const errorDictionary = {
  // Errores de autenticación (10XX)
  AUTH_ERROR: {
    code: 1001,
    message: 'Error de autenticación',
    status: 401
  },
  INVALID_CREDENTIALS: {
    code: 1002,
    message: 'Credenciales inválidas',
    status: 401
  },
  INVALID_TOKEN: {
    code: 1003,
    message: 'Token inválido o expirado',
    status: 401
  },
  NOT_AUTHENTICATED: {
    code: 1004,
    message: 'No autenticado',
    status: 401
  },
  NOT_AUTHORIZED: {
    code: 1005,
    message: 'No autorizado',
    status: 403
  },

  // Errores de validación (20XX)
  VALIDATION_ERROR: {
    code: 2001,
    message: 'Error de validación',
    status: 400
  },
  MISSING_FIELDS: {
    code: 2002,
    message: 'Faltan campos requeridos',
    status: 400
  },
  INVALID_EMAIL: {
    code: 2003,
    message: 'Formato de email inválido',
    status: 400
  },
  INVALID_PASSWORD: {
    code: 2004,
    message: 'La contraseña debe tener al menos 8 caracteres',
    status: 400
  },

  // Errores de base de datos (30XX)
  DATABASE_ERROR: {
    code: 3001,
    message: 'Error de base de datos',
    status: 500
  },
  DUPLICATE_KEY: {
    code: 3002,
    message: 'Registro duplicado',
    status: 400
  },
  NOT_FOUND: {
    code: 3003,
    message: 'Recurso no encontrado',
    status: 404
  },

  // Errores de negocio (40XX)
  USER_ALREADY_EXISTS: {
    code: 4001,
    message: 'El usuario ya existe',
    status: 400
  },
  PET_NOT_AVAILABLE: {
    code: 4002,
    message: 'La mascota no está disponible para adopción',
    status: 400
  },
  ADOPTION_ALREADY_EXISTS: {
    code: 4003,
    message: 'Ya existe una solicitud de adopción para esta mascota',
    status: 400
  }
};

export default errorDictionary;
