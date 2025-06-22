/**
 * Clase personalizada para manejar errores en la aplicación
 * @extends Error
 */
class AppError extends Error {
    /**
     * Crea una nueva instancia de AppError
     * @param {string} message - Mensaje de error descriptivo
     * @param {number} statusCode - Código de estado HTTP
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Captura el stack trace sin incluir el constructor en el stack
        Error.captureStackTrace(this, this.constructor);
    }
}

export { AppError };

// Ejemplo de uso:
// throw new AppError('Mensaje de error personalizado', 400);
