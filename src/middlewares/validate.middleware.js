import { validationResult } from 'express-validator';
import { CustomError } from '../utils/errors/errorHandler.js';

/**
 * Middleware para validar los datos de entrada con express-validator
 * @param {Array} validations - Array de validaciones de express-validator
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Ejecutar validaciones
    await Promise.all(validations.map(validation => validation.run(req)));

    // Obtener resultados de la validación
    const errors = validationResult(req);
    
    // Si hay errores, devolverlos
    if (!errors.isEmpty()) {
      const errorDetails = errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }));
      
      const error = new CustomError('VALIDATION_ERROR', { details: errorDetails });
      return next(error);
    }
    
    next();
  };
};

/**
 * Middleware para validar el ID de MongoDB
 */
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    // Verificar si el ID es un ObjectId válido de MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return next(new AppError(`ID inválido: ${id}`, 400));
    }
    
    next();
  };
};
