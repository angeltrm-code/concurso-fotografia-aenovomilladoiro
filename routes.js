import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendConfirmationEmail, sendParticipacionToOrganizacion } from './emailService.js';
import { guardarParticipacion, crearCarpetaUploads } from './utils.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer para subir fotos
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        await crearCarpetaUploads();
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        // Generar nombre único: timestamp + nombre original
        const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueName);
    }
});

// Filtro para aceptar solo imágenes jpg/jpeg
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Só se aceptan imaxes en formato JPG/JPEG'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

// Ruta para procesar la participación
router.post('/participar', upload.single('foto'), async (req, res) => {
    try {
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

        // Validar campos requeridos
        if (!nombre || !apelidos || !nif || !email || !titulo || !file) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obrigatorios ou a imaxe'
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
            archivo: file.filename
        };

        // Guardar en JSON
        await guardarParticipacion(participacion);

        // Enviar emails
        await sendConfirmationEmail({
            to: email,
            nombre
        });

        await sendParticipacionToOrganizacion({
            datos: participacion,
            imagePath: file.path
        });

        res.status(200).json({
            success: true,
            message: 'Participación recibida correctamente'
        });

    } catch (error) {
        console.error('Error ao procesar a participación:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao procesar a participación'
        });
    }
});

export default router; 