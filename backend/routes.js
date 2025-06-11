import express from 'express';
import multer from 'multer';
import path from 'path';
import { sendConfirmationEmail, sendParticipacionToOrganizacion } from './services/emailService.js';
import { guardarParticipacion, crearCarpetaUploads } from './utils/fileUtils.js';
import { participacionSchema, sanitizeText, validateImageFile, generateSafeFilename } from './utils/validators.js';
import participacionesRoutes from './routes/participaciones.js';
import carruselRoutes from './routes/carrusel.js';
import basesRoutes from './routes/bases.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import adminRoutes from './routes/admin.js';
import { verifyToken } from './authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Montar rutas del carrusel y bases
router.use('/carrusel', carruselRoutes);
router.use('/bases', basesRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Configuración de multer para subir fotos
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        await crearCarpetaUploads();
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, generateSafeFilename(file.originalname));
    }
});

// Filtro para aceptar solo imágenes jpg/jpeg
const fileFilter = (req, file, cb) => {
    const validation = validateImageFile(file);
    if (validation.isValid) {
        cb(null, true);
    } else {
        cb(new Error(validation.errors.join(', ')), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

// Middleware para sanitizar los datos del formulario
const sanitizeFormData = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeText(req.body[key]);
            }
        });
    }
    next();
};

// Ruta para procesar la participación
router.post('/participar', upload.single('foto'), sanitizeFormData, async (req, res) => {
    try {
        console.error('[/api/participar] Inicio del manejador de ruta');
        const {
            nombre,
            apelidos,
            nif,
            enderezo,
            email,
            telefono,
            titulo,
            descripcion
        } = req.body;

        const file = req.file;

        // Validar campos requeridos y formato
        console.error('[/api/participar] Antes de validación con Zod');
        try {
            await participacionSchema.parseAsync(req.body);
        } catch (error) {
            console.error('[/api/participar] Error de validación con Zod:', error);
            return res.status(400).json({
                success: false,
                message: 'Erro de validación: ' + error.errors.map(e => e.message).join(', ')
            });
        }

        // Validar archivo
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'É obrigatorio enviar unha imaxe'
            });
        }

        // Preparar datos de la participación
        const participacion = {
            nombre,
            apelidos,
            nif,
            enderezo,
            email,
            telefono,
            titulo,
            descripcion,
            archivo: file.filename,
            ip: req.ip // Guardar IP para auditoría
        };

        // Guardar en JSON
        console.error('[/api/participar] Antes de guardar participación');
        await guardarParticipacion(participacion);

        // Enviar emails
        console.error('[/api/participar] Antes de enviar email de confirmación');
        await sendConfirmationEmail({
            to: email,
            nombre
        });

        console.error('[/api/participar] Antes de enviar email a la organización');
        await sendParticipacionToOrganizacion({
            datos: participacion,
            imagePath: file.path
        });

        console.error('[/api/participar] Antes de enviar respuesta exitosa');
        res.status(200).json({
            success: true,
            message: 'Participación recibida correctamente'
        });

    } catch (error) {
        console.error('[/api/participar] Error general en el catch:', error);
        
        // Si es un error de multer, devolver mensaje específico
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'A imaxe non pode ser maior de 5MB'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro ao procesar a participación'
        });
    }
});

// Usar rutas de participaciones
router.use('/participaciones', participacionesRoutes);

// Configuración de Multer para el carrusel
const carruselStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/carrusel/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const carruselUpload = multer({ 
  storage: carruselStorage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Solo se permiten imágenes JPG, JPEG y PNG'));
    }
    cb(null, true);
  }
});

// Rutas del carrusel
router.get('/api/carrusel', (req, res) => {
  const carruselDir = path.join(__dirname, 'data/carrusel');
  fs.readdir(carruselDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el directorio del carrusel' });
    }
    const images = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    res.json(images);
  });
});

router.post('/api/carrusel', carruselUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
  }
  res.json({ 
    message: 'Imagen subida correctamente',
    filename: req.file.filename
  });
});

// Endpoint para descargar el PDF de las bases
router.get('/api/bases/pdf', (req, res) => {
  const pdfPath = path.join(__dirname, 'public/bases.pdf');
  res.download(pdfPath, 'bases-concurso.pdf');
});

router.use('/admin', adminRoutes);

export default router; 