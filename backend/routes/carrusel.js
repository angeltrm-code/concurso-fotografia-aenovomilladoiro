import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'carrusel');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const files = fs.readdirSync(path.join(__dirname, '..', 'uploads', 'carrusel'));
        const numbers = files
            .map(f => parseInt(f.match(/\d+/)?.[0] || '0'))
            .filter(n => !isNaN(n));
        const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
        const ext = path.extname(file.originalname);
        cb(null, `slide${nextNumber}${ext}`);
    }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Obtener todas las imágenes
router.get('/imagenes', (req, res) => {
    try {
        const carruselDir = path.join(__dirname, '..', 'uploads', 'carrusel');
        if (!fs.existsSync(carruselDir)) {
            return res.json([]);
        }

        const files = fs.readdirSync(carruselDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => ({
                nombre: file,
                url: `/carrusel/${file}`
            }));

        res.json(images);
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        res.status(500).json({ error: 'Error al obtener las imágenes' });
    }
});

// Subir una nueva imagen
router.post('/subir', upload.single('imagen'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
        }

        res.json({
            mensaje: 'Imagen subida correctamente',
            imagen: {
                nombre: req.file.filename,
                url: `/carrusel/${req.file.filename}`
            }
        });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

// Eliminar una imagen
router.delete('/eliminar/:nombre', (req, res) => {
    try {
        const { nombre } = req.params;
        const filePath = path.join(__dirname, '..', 'uploads', 'carrusel', nombre);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Imagen no encontrada' });
        }

        fs.unlinkSync(filePath);
        res.json({ mensaje: 'Imagen eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
});

export default router; 