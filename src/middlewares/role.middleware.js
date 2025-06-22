import { AppError } from '../utils/AppError.js';

/**
 * Middleware para verificar el rol del usuario
 * @param {...string} roles - Roles permitidos
 * @returns {Function} Middleware de verificación de roles
 */
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return next(new AppError('No autorizado - Usuario no autenticado', 401));
    }

    // Verificar si el usuario tiene uno de los roles permitidos
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('No tienes permiso para realizar esta acción', 403)
      );
    }

    next();
  };
};

/**
 * Middleware para verificar si el usuario es el propietario del recurso o es admin
 * @param {string} modelName - Nombre del modelo (opcional, para mensajes de error)
 * @param {string} idParam - Nombre del parámetro que contiene el ID del recurso
 * @returns {Function} Middleware de verificación de propiedad
 */
export const checkOwnership = (modelName = 'recurso', idParam = 'id') => {
  return (req, res, next) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return next(new AppError('No autorizado - Usuario no autenticado', 401));
    }

    // Si el usuario es admin, permitir la acción
    if (req.user.role === 'admin') {
      return next();
    }

    // Obtener el ID del recurso de los parámetros de la ruta
    const resourceId = req.params[idParam];
    
    // Verificar si el ID del recurso coincide con el ID del usuario
    if (resourceId !== req.user.id) {
      return next(
        new AppError(`No tienes permiso para modificar este ${modelName}`, 403)
      );
    }

    next();
  };
};
