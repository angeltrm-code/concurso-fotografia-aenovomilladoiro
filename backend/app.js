import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer'; // Aunque multer se usa en routes.js, a veces se importa aquí
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Simular __dirname y __filename en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import routes from './routes.js'; // Importar las rutas
import { performBackup, limpiarBackupsAntiguos } from './utils/backup.js';

const app = express();

// Configuración de Middlewares
app.use(helmet()); // Seguridad
app.use(cors()); // Permitir peticiones desde otros orígenes (ajustar en producción)
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos (si los hay)

// Rate limiting para prevenir flood
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por IP
    message: {
        success: false,
        message: 'Demasiados intentos. Por favor, espera 15 minutos.'
    }
});

// Aplicar rate limiting solo a la ruta de participación
app.use('/api/participar', limiter);

// Usar las rutas definidas
app.use('/api', routes); // Montar las rutas bajo /api

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta non atopada'
    });
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: err.message
    });
});

// Configuración de la copia de seguridad automática (cada 24 horas)
// setInterval(performBackup, 24 * 60 * 60 * 1000);
// setInterval(limpiarBackupsAntiguos, 25 * 60 * 60 * 1000);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor backend escoitando no porto ${PORT}`);
}); 