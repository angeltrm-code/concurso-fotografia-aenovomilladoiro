const fs = require('fs').promises;
const path = require('path');

// Crea la carpeta uploads si no existe
async function crearCarpetaUploads() {
  const uploadsPath = path.join(__dirname, 'uploads');
  try {
    await fs.mkdir(uploadsPath, { recursive: true });
  } catch (err) {
    // Si ya existe, no hacer nada
    if (err.code !== 'EEXIST') throw err;
  }
}

// Guarda una participación en participaciones.json
async function guardarParticipacion(datos) {
  const dataDir = path.join(__dirname, '../../data');
  const filePath = path.join(dataDir, 'participaciones.json');
  try {
    await fs.mkdir(dataDir, { recursive: true });
    let participaciones = [];
    try {
      const contenido = await fs.readFile(filePath, 'utf-8');
      participaciones = JSON.parse(contenido);
    } catch (err) {
      // Si el archivo no existe, empezamos con un array vacío
      if (err.code !== 'ENOENT') throw err;
    }
    participaciones.push(datos);
    await fs.writeFile(filePath, JSON.stringify(participaciones, null, 2), 'utf-8');
  } catch (err) {
    throw err;
  }
}

module.exports = {
  crearCarpetaUploads,
  guardarParticipacion
}; 