import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PARTICIPACIONES_PATH = path.join(__dirname, 'participaciones.json');

/**
 * Guarda una nueva participación en el archivo JSON
 * @param {Object} participacion - Datos de la participación
 * @returns {Promise<void>}
 */
export const guardarParticipacion = async (participacion) => {
    try {
        // Crear el archivo si no existe
        if (!fs.existsSync(PARTICIPACIONES_PATH)) {
            await fs.promises.writeFile(PARTICIPACIONES_PATH, JSON.stringify([], null, 2));
        }

        // Leer participaciones existentes
        const contenido = await fs.promises.readFile(PARTICIPACIONES_PATH, 'utf-8');
        const participaciones = JSON.parse(contenido);

        // Añadir nueva participación con timestamp
        participaciones.push({
            ...participacion,
            fecha: new Date().toISOString()
        });

        // Guardar actualizado
        await fs.promises.writeFile(
            PARTICIPACIONES_PATH,
            JSON.stringify(participaciones, null, 2)
        );
    } catch (error) {
        console.error('Error ao gardar a participación:', error);
        throw error;
    }
};

/**
 * Crea la carpeta de uploads si no existe
 * @returns {Promise<void>}
 */
export const crearCarpetaUploads = async () => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        await fs.promises.mkdir(uploadsDir);
        console.log('Carpeta uploads creada.');
    }
}; 