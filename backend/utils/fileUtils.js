import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea la carpeta uploads si no existe
async function crearCarpetaUploads() {
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  try {
    await fsPromises.mkdir(uploadsPath, { recursive: true });
  } catch (err) {
    // Si ya existe, no hacer nada
    if (err.code !== 'EEXIST') throw err;
  }
}

// Guarda una participación en participaciones.json
async function guardarParticipacion(datos) {
  const dataDir = path.join(__dirname, '..', 'data');
  const filePath = path.join(dataDir, 'participaciones.json');
  try {
    await fsPromises.mkdir(dataDir, { recursive: true });
    let participaciones = [];
    try {
      const contenido = await fsPromises.readFile(filePath, 'utf-8');
      participaciones = JSON.parse(contenido);
    } catch (err) {
      // Si el archivo no existe, empezamos con un array vacío
      if (err.code !== 'ENOENT') throw err;
    }
    participaciones.push(datos);
    await fsPromises.writeFile(filePath, JSON.stringify(participaciones, null, 2), 'utf-8');
  } catch (err) {
    throw err;
  }
}

export {
  crearCarpetaUploads,
  guardarParticipacion
}; 