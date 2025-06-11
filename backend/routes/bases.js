import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basesFilePath = path.join(__dirname, '..', 'data', 'bases.json');

const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public'));
    },
    filename: (req, file, cb) => {
        cb(null, 'bases.pdf');
    }
});
const pdfUpload = multer({
    storage: pdfStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Solo se permite PDF'));
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Función auxiliar para leer el archivo de bases
function readBases() {
    if (!fs.existsSync(basesFilePath)) {
        fs.writeFileSync(basesFilePath, '[]', 'utf8');
    }
    const data = fs.readFileSync(basesFilePath, 'utf8');
    return JSON.parse(data);
}

// Función auxiliar para escribir en el archivo de bases
function writeBases(bases) {
    fs.writeFileSync(basesFilePath, JSON.stringify(bases, null, 2), 'utf8');
}

// Función para generar un nuevo ID incremental
function generateId(bases) {
    if (bases.length === 0) return 1;
    return Math.max(...bases.map(b => b.id)) + 1;
}

// GET /api/bases - Obtener todas las secciones
router.get('/', (req, res) => {
    try {
        const bases = readBases();
        res.json(bases);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer las bases.' });
    }
});

// POST /api/bases - Añadir nueva sección
router.post('/', (req, res) => {
    const { titulo, contido, icon } = req.body;
    if (!titulo || !contido) {
        return res.status(400).json({ error: 'Faltan campos requeridos: titulo y contido.' });
    }
    try {
        const bases = readBases();
        const id = generateId(bases);
        const nueva = { id, titulo, contido, icon: icon || null };
        bases.push(nueva);
        writeBases(bases);
        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la nueva sección.' });
    }
});

// PUT /api/bases/:id - Editar sección
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, contido, icon } = req.body;
    if (!titulo || !contido) {
        return res.status(400).json({ error: 'Faltan campos requeridos: titulo y contido.' });
    }
    try {
        const bases = readBases();
        const idx = bases.findIndex(b => b.id === parseInt(id));
        if (idx === -1) {
            return res.status(404).json({ error: 'Sección no encontrada.' });
        }
        bases[idx] = { ...bases[idx], id: parseInt(id), titulo, contido, icon: icon || bases[idx].icon || null };
        writeBases(bases);
        res.json(bases[idx]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la sección.' });
    }
});

// DELETE /api/bases/:id - Eliminar sección
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    try {
        const bases = readBases();
        const idx = bases.findIndex(b => b.id === parseInt(id));
        if (idx === -1) {
            return res.status(404).json({ error: 'Sección no encontrada.' });
        }
        const eliminada = bases.splice(idx, 1)[0];
        writeBases(bases);
        res.json({ message: 'Sección eliminada', eliminada });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la sección.' });
    }
});

// PUT /api/bases/orden - Reordenar todas las secciones
router.put('/orden', (req, res) => {
    const { bases: newBases } = req.body;
    if (!Array.isArray(newBases)) {
        return res.status(400).json({ error: 'Se debe enviar un array de bases.' });
    }
    try {
        // Validar que cada base tenga id, titulo y contido
        for (const b of newBases) {
            if (!b.id || !b.titulo || !b.contido) {
                return res.status(400).json({ error: 'Cada base debe tener id, titulo y contido.' });
            }
        }
        writeBases(newBases);
        res.json({ message: 'Orden actualizado', bases: newBases });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el orden.' });
    }
});

// Subir nuevo PDF de bases
router.post('/pdf', pdfUpload.single('pdf'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo PDF.' });
    res.json({ message: 'PDF subido correctamente.' });
});

// Eliminar el PDF de bases
router.delete('/pdf', (req, res) => {
    const pdfPath = path.join(__dirname, '..', 'public', 'bases.pdf');
    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'No existe el PDF.' });
    }
    fs.unlinkSync(pdfPath);
    res.json({ message: 'PDF eliminado correctamente.' });
});

// Servir el PDF de las bases
router.get('/pdf', (req, res) => {
    const pdfPath = path.join(__dirname, '..', 'public', 'bases.pdf');
    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'No existe el PDF.' });
    }
    res.sendFile(pdfPath);
});

export default router; 