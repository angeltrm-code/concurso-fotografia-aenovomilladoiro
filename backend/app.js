import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import { performBackup, limpiarBackupsAntiguos } from './utils/backup.js';
import initializeDirectories from './utils/initDirectories.js';
import { crearCarpetaUploads } from './utils/fileUtils.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar variables de entorno críticas
const requiredEnvVars = ['ADMIN_USER', 'ADMIN_PASS_HASH', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Error: Faltan las siguientes variables de entorno requeridas:');
    missingEnvVars.forEach(varName => console.error(`- ${varName}`));
    process.exit(1);
}

// Simular __dirname y __filename en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar directorios necesarios
initializeDirectories();
crearCarpetaUploads().catch(console.error);

const app = express();

// Configuración de Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Seguridad
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Permitir peticiones desde otros orígenes
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));
app.use('/carrusel', express.static(path.join(__dirname, process.env.CARRUSEL_DIR || 'uploads/carrusel')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rate limiting para prevenir flood
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos por defecto
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 100 intentos por ventana
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
    console.log(`404 - Ruta no encontrada: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: 'Ruta non atopada'
    });
});

// Manejador de errores general
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
    });
});

// Configuración de la copia de seguridad automática
if (process.env.NODE_ENV === 'production') {
    setInterval(performBackup, parseInt(process.env.BACKUP_INTERVAL) || 24 * 60 * 60 * 1000);
    setInterval(limpiarBackupsAntiguos, (parseInt(process.env.BACKUP_INTERVAL) || 24 * 60 * 60 * 1000) + 60 * 60 * 1000);
}

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor backend escoitando no porto ${PORT}`);
    console.log(`URLs disponibles:`);
    console.log(`- API: http://localhost:${PORT}/api`);
    console.log(`- Carrusel: http://localhost:${PORT}/api/carrusel`);
    console.log(`- Bases: http://localhost:${PORT}/api/bases`);
});

// Manejar errores del servidor
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya está en uso. Por favor, usa otro puerto.`);
        process.exit(1);
    } else {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
});

export default app;
