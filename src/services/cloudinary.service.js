import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { AppError } from '../utils/AppError.js';

// Configurar Cloudinary con las credenciales del entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Usar HTTPS
});

/**
 * Convierte un buffer a un stream de lectura
 * @param {Buffer} buffer - Buffer a convertir
 * @returns {Readable} Stream de lectura
 */
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

/**
 * Sube un archivo a Cloudinary desde un buffer
 * @param {Object} file - Objeto con buffer y nombre del archivo
 * @param {string} folder - Carpeta en Cloudinary donde se guardará el archivo
 * @returns {Promise<Object>} Objeto con la información del archivo subido
 */
const uploadToCloudinary = (file, folder = 'misc') => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new AppError('No se proporcionó un archivo válido', 400));
    }

    const { buffer, originalname } = file;
    
    // Configuración de opciones para Cloudinary
    const uploadOptions = {
      folder: `adoptme/${folder}`,
      resource_type: 'auto',
      public_id: originalname.replace(/\.[^/.]+$/, ''), // Elimina la extensión
      overwrite: true,
      unique_filename: false
    };

    // Crear el stream de carga
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('Error en la subida a Cloudinary:', error);
          return reject(new AppError('Error al subir el archivo a Cloudinary', 500));
        }
        resolve(result);
      }
    );

    // Manejar errores en el stream de carga
    uploadStream.on('error', (error) => {
      console.error('Error en el stream de carga:', error);
      reject(new AppError('Error al cargar el archivo', 500));
    });

    try {
      // Crear un stream de lectura desde el buffer
      const bufferStream = bufferToStream(buffer);
      
      // Manejar errores en el stream de lectura
      bufferStream.on('error', (error) => {
        console.error('Error al leer el buffer:', error);
        uploadStream.end();
        reject(new AppError('Error al procesar el archivo', 500));
      });

      // Conectar el stream de lectura al de carga
      bufferStream.pipe(uploadStream);
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      uploadStream.end();
      reject(new AppError('Error al procesar el archivo', 500));
    }
  });
};

/**
 * Elimina un archivo de Cloudinary
 * @param {string} publicId - ID público del archivo en Cloudinary
 * @returns {Promise<Object>} Resultado de la eliminación
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const destroyAsync = promisify(cloudinary.uploader.destroy);
    return await destroyAsync(publicId);
  } catch (error) {
    console.error('Error al eliminar de Cloudinary:', error);
    throw new AppError('Error al eliminar el archivo', 500);
  }
};

export { uploadToCloudinary, deleteFromCloudinary };
