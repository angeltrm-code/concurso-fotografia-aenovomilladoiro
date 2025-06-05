import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';

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

// Puerto por defecto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando na porta ${PORT}`);
}); 