import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';
import cors from 'cors';
import path from 'path';
import { performBackup, limpiarBackupsAntiguos } from './utils/backup';

const app = express();

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

// Configurar las rutas
app.use('/api', routes);

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
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    // Iniciar el sistema de backup
    scheduleBackup();
}); 