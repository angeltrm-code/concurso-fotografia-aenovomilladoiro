// =============================
//  BACKEND EXPRESS PARA CONCURSO DE FOTOGRAFÍA
// =============================
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { enviarParticipacionOrganizador, enviarConfirmacionParticipante } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Habilitar CORS para aceptar peticiones del frontend
app.use(cors());

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Carpeta uploads creada.');
}

// Configuración de Multer para guardar archivos con nombre único
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Endpoint para recibir la participación
app.post('/api/participar', upload.single('foto'), async (req, res) => {
  const { nombre, email, titulo } = req.body;
  const file = req.file;

  if (!nombre || !email || !titulo || !file) {
    return res.status(400).json({ mensaje: 'Faltan datos obrigatorios ou a imaxe.' });
  }

  const participacion = {
    nombre,
    email,
    titulo,
    archivo: file.filename,
    fecha: new Date().toISOString()
  };

  guardarParticipacion(participacion);

  console.log('--- Nova participación recibida ---');
  console.log(participacion);
  console.log('-------------------------------------');

  // Envío de emails automáticos
  const archivoPath = file.path;
  const archivoNombre = file.filename;
  try {
    await enviarParticipacionOrganizador({
      nombre,
      email,
      titulo,
      archivoPath,
      archivoNombre,
    });
    await enviarConfirmacionParticipante({
      nombre,
      email,
      titulo,
      archivoPath,
    });
    console.log('Emails enviados correctamente.');
  } catch (err) {
    console.error('Erro ao enviar emails:', err);
  }

  res.json({ mensaje: 'Fotografía recibida con éxito!' });
});

// Endpoint para obtener todas las participaciones
app.get('/api/participaciones', (req, res) => {
  try {
    if (!fs.existsSync(participacionesPath)) {
      return res.json([]);
    }
    const contenido = fs.readFileSync(participacionesPath, 'utf-8');
    const lista = JSON.parse(contenido);
    res.json(lista);
  } catch (e) {
    console.error('Error leyendo participaciones.json:', e);
    res.status(500).json({ mensaje: 'Error al leer las participaciones.' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
}); 