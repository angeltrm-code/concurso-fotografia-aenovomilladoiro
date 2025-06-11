import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';

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

const autorizacionsDir = path.join(__dirname, '..', 'autorizacions');
if (!fs.existsSync(autorizacionsDir)) {
    fs.mkdirSync(autorizacionsDir);
}

function xeraCodigoUnico(participacions) {
    let codigo;
    do {
        codigo = 'IMG-' + crypto.randomBytes(4).toString('hex').toUpperCase().slice(0,6);
    } while (participacions.some(p => p.codigo === codigo));
    return codigo;
}

function calcularIdade(dataNacemento) {
    const hoxe = new Date();
    const nac = new Date(dataNacemento);
    let idade = hoxe.getFullYear() - nac.getFullYear();
    const m = hoxe.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoxe.getDate() < nac.getDate())) {
        idade--;
    }
    return idade;
}

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
    { name: 'autorizacion', maxCount: 1 },
    { name: 'autorizacionTutor', maxCount: 1 }
]), async (req, res) => {
    try {
        if (!req.files || !req.files.foto) {
            return res.status(400).json({
                success: false,
                message: 'É obrigatorio subir unha imaxe.'
            });
        }
        const {
            nombre,
            apelidos,
            email,
            telefono,
            nif,
            enderezo,
            titulo,
            descripcion,
            dataNacemento
        } = req.body;
        const camposObligatorios = ['nombre', 'apelidos', 'email', 'telefono', 'nif', 'titulo', 'dataNacemento'];
        const camposFaltantes = camposObligatorios.filter(campo => !req.body[campo]);
        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Faltan campos obrigatorios: ${camposFaltantes.join(', ')}`
            });
        }
        const idade = calcularIdade(dataNacemento);
        if (idade < 18 && (!req.files.autorizacionTutor || req.files.autorizacionTutor.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Se a persoa participante é menor de idade, debe achegar unha autorización asinada polo/a titor/a legal.'
            });
        }
        // Leer participaciones existentes
        const dataDir = path.join(__dirname, '../../data');
        const filePath = path.join(dataDir, 'participaciones.json');
        let participaciones = [];
        try {
            const contenido = await fsPromises.readFile(filePath, 'utf-8');
            participaciones = JSON.parse(contenido);
        } catch (err) { if (err.code !== 'ENOENT') throw err; }
        // Generar código único
        const codigo = xeraCodigoUnico(participaciones);
        // Guardar imagen con nombre IMG-XXXXXX.ext
        const extFoto = path.extname(req.files.foto[0].originalname);
        const nombreFoto = `${codigo}${extFoto}`;
        const fotoPath = path.join(__dirname, '..', 'uploads', 'participantes', nombreFoto);
        if (!fs.existsSync(path.dirname(fotoPath))) fs.mkdirSync(path.dirname(fotoPath), { recursive: true });
        await fsPromises.writeFile(fotoPath, req.files.foto[0].buffer);
        // Guardar autorización tutor si corresponde
        let nombreAutorizacionTutor = null;
        if (idade < 18 && req.files.autorizacionTutor) {
            const extAut = path.extname(req.files.autorizacionTutor[0].originalname);
            nombreAutorizacionTutor = `autorizacion_${codigo}${extAut}`;
            const autPath = path.join(autorizacionsDir, nombreAutorizacionTutor);
            await fsPromises.writeFile(autPath, req.files.autorizacionTutor[0].buffer);
        }
        // Guardar participación
        const nueva = {
            codigo,
            nombre,
            apelidos,
            email,
            telefono,
            nif,
            enderezo,
            titulo,
            descripcion,
            dataNacemento,
            idade,
            foto: nombreFoto,
            autorizacionTutor: nombreAutorizacionTutor
        };
        participaciones.push(nueva);
        await fsPromises.writeFile(filePath, JSON.stringify(participaciones, null, 2), 'utf-8');
        // Respuesta
        res.json({
            success: true,
            codigo,
            message: `Grazas por participar no XI Certame de Fotografía Comercial do Milladoiro. O código de rexistro da túa fotografía é: ${codigo}. Gárdao por se necesitas consultalo máis adiante.`
        });
    } catch (error) {
        console.error('Error ao procesar a participación:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao procesar a participación.'
        });
    }
});

export default router; 