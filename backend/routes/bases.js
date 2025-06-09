import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basesFilePath = path.join(__dirname, '..', 'data', 'bases.txt');

// Ruta para obtener el contenido de las bases
router.get('/', (req, res) => {
    try {
        if (fs.existsSync(basesFilePath)) {
            const content = fs.readFileSync(basesFilePath, 'utf8');
            res.json({ content });
        } else {
            res.status(404).json({ error: 'Archivo de bases no encontrado.' });
        }
    } catch (error) {
        console.error('Error al leer el archivo de bases:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener las bases.' });
    }
});

// Ruta para actualizar el contenido de las bases
router.post('/', (req, res) => {
    try {
        const { content } = req.body;
        if (typeof content !== 'string') {
            return res.status(400).json({ error: 'El contenido debe ser una cadena de texto.' });
        }
        fs.writeFileSync(basesFilePath, content, 'utf8');
        res.json({ message: 'Bases actualizadas correctamente.' });
    } catch (error) {
        console.error('Error al escribir en el archivo de bases:', error);
        res.status(500).json({ error: 'Error interno del servidor al actualizar las bases.' });
    }
});

export default router; 