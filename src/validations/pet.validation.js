import { body, param } from 'express-validator';

// Esquema de validación para crear una mascota
export const createPetSchema = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
  body('species')
    .isIn(['Perro', 'Gato', 'Conejo', 'Otro']).withMessage('Especie no válida'),
    
  body('breed')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('La raza no puede tener más de 50 caracteres'),
    
  body('age')
    .isInt({ min: 0, max: 30 }).withMessage('La edad debe ser un número entre 0 y 30'),
    
  body('gender')
    .isIn(['Macho', 'Hembra', 'Desconocido']).withMessage('Género no válido'),
    
  body('size')
    .isIn(['Pequeño', 'Mediano', 'Grande']).withMessage('Tamaño no válido'),
    
  body('description')
    .trim()
    .notEmpty().withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
    
  body('status')
    .optional()
    .isIn(['Disponible', 'Reservado', 'Adoptado']).withMessage('Estado no válido')
];

// Esquema de validación para actualizar una mascota
export const updatePetSchema = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/).withMessage('ID de mascota no válido'),
    
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    
  body('species')
    .optional()
    .isIn(['Perro', 'Gato', 'Conejo', 'Otro']).withMessage('Especie no válida'),
    
  body('breed')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('La raza no puede tener más de 50 caracteres'),
    
  body('age')
    .optional()
    .isInt({ min: 0, max: 30 }).withMessage('La edad debe ser un número entre 0 y 30'),
    
  body('gender')
    .optional()
    .isIn(['Macho', 'Hembra', 'Desconocido']).withMessage('Género no válido'),
    
  body('size')
    .optional()
    .isIn(['Pequeño', 'Mediano', 'Grande']).withMessage('Tamaño no válido'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
    
  body('status')
    .optional()
    .isIn(['Disponible', 'Reservado', 'Adoptado']).withMessage('Estado no válido')
];
