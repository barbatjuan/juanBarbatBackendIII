import errorDictionary from './errorDictionary.js';

class CustomError extends Error {
  constructor(errorKey, details = {}) {
    const error = errorDictionary[errorKey] || errorDictionary.UNKNOWN_ERROR;
    super(error.message);
    this.name = 'CustomError';
    this.code = error.code;
    this.status = error.status;
    this.details = details;
  }
}

const errorHandler = (err, req, res, next) => {
  req.logger.error(`[${new Date().toISOString()}] Error: ${err.message}\n${err.stack}`);

  // Si es un error de validación de express-validator
  if (err.message === 'Datos de entrada inválidos' && err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      errors: err.details || []
    });
  }

  // Si es un error de validación de mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }

  // Si es un error de duplicado de MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        code: 3002, // Código de error de duplicado
        message: 'Registro duplicado',
        details: {
          field: Object.keys(err.keyPattern)[0],
          value: err.keyValue[Object.keys(err.keyPattern)[0]]
        }
      }
    });
  }

  // Si es un error personalizado
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.details || []
    });
  }

  // Para cualquier otro tipo de error
  res.status(500).json({
    success: false,
    error: {
      code: 9999,
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? err.message : {}
    }
  });
};

export { CustomError, errorHandler };
