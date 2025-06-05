const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const { performBackup, limpiarBackupsAntiguos } = require('./utils/backup');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configuración de seguridad básica
app.use(helmet());

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

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Configurar las rutas
app.use('/api', routes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Función para programar el backup
async function scheduleBackup() {
    try {
        // Limpiar backups antiguos al inicio
        await limpiarBackupsAntiguos();
        
        // Realizar backup inicial
        const lastBackup = await performBackup();
        console.log('Backup inicial completado:', lastBackup);

        // Programar backup cada 24 horas
        setInterval(async () => {
            try {
                const backupTimestamp = await performBackup();
                console.log('Backup programado completado:', backupTimestamp);
            } catch (error) {
                console.error('Error en backup programado:', error);
            }
        }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
    } catch (error) {
        console.error('Error al iniciar el sistema de backup:', error);
    }
}

// Puerto por defecto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    // Iniciar el sistema de backup
    scheduleBackup();
}); 