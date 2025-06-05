import express from 'express';
import routes from './routes.js';

const app = express();

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