import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuración de Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // límite de 5MB por archivo
    }
});

// Ruta para obtener todas las participaciones
router.get('/', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const filePath = path.join(dataDir, 'participaciones.json');
        
        try {
            const contenido = await fsPromises.readFile(filePath, 'utf-8');
            const participaciones = JSON.parse(contenido);
            res.json({
                success: true,
                data: participaciones
            });
        } catch (err) {
            if (err.code === 'ENOENT') {
                res.json({
                    success: true,
                    data: []
                });
            } else {
                throw err;
            }
        }
    } catch (error) {
        console.error('Error al obtener participaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener participaciones'
        });
    }
});

// Ruta para procesar el formulario de participación
router.post('/api/participar', upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'autorizacion', maxCount: 1 }
]), async (req, res) => {
    try {
        // Validar que se haya subido al menos la foto
        if (!req.files || !req.files.foto) {
            return res.status(400).json({
                success: false,
                message: 'Es obligatorio subir una foto'
            });
        }

        // Extraer datos del formulario
        const {
            nombre,
            apelidos,
            email,
            telefono,
            nif,
            enderezo,
            titulo,
            descripcion
        } = req.body;

        // Validar campos obligatorios
        const camposObligatorios = ['nombre', 'apelidos', 'email', 'telefono', 'nif', 'titulo'];
        const camposFaltantes = camposObligatorios.filter(campo => !req.body[campo]);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`
            });
        }

        // Preparar respuesta con los datos recibidos
        const respuesta = {
            success: true,
            data: {
                // Datos del formulario
                nombre,
                apelidos,
                email,
                telefono,
                nif,
                enderezo,
                titulo,
                descripcion,
                // Metadatos de los archivos
                archivos: {
                    foto: {
                        nombre: req.files.foto[0].originalname,
                        tipo: req.files.foto[0].mimetype,
                        tamaño: req.files.foto[0].size
                    }
                }
            }
        };

        // Añadir datos de autorización si existe
        if (req.files.autorizacion) {
            respuesta.data.archivos.autorizacion = {
                nombre: req.files.autorizacion[0].originalname,
                tipo: req.files.autorizacion[0].mimetype,
                tamaño: req.files.autorizacion[0].size
            };
        }

        res.json(respuesta);

    } catch (error) {
        console.error('Error al procesar la participación:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la participación'
        });
    }
});

export default router; 