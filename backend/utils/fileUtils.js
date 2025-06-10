import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea la carpeta uploads si no existe
export const crearCarpetaUploads = async () => {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Directorio uploads creado');
  }
  return uploadsDir;
};

// Guarda una participación en participaciones.json
export const guardarParticipacion = async (participacion) => {
  const dataDir = path.join(__dirname, '..', 'data');
  const participacionesPath = path.join(dataDir, 'participaciones.json');
  
  try {
    let participaciones = [];
    if (fs.existsSync(participacionesPath)) {
      const contenido = await fs.promises.readFile(participacionesPath, 'utf8');
      participaciones = JSON.parse(contenido);
    }
    
    participaciones.push({
      ...participacion,
      fecha: new Date().toISOString()
    });
    
    await fs.promises.writeFile(participacionesPath, JSON.stringify(participaciones, null, 2));
    return true;
  } catch (error) {
    console.error('Error al guardar la participación:', error);
    return false;
  }
}; 