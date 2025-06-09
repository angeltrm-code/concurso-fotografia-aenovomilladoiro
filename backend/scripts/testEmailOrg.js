import { sendParticipacionToOrganizacion } from '../services/emailService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Datos de prueba
const testData = {
    datos: {
        nombre: 'Usuario',
        apelidos: 'de Prueba',
        nif: '12345678A',
        enderezo: 'Calle de Prueba, 1',
        email: process.env.TEST_EMAIL || 'test@example.com',
        telefono: '666666666',
        titulo: 'Fotografía de Prueba',
        descripcion: 'Esta es una descripción de prueba para el email a la organización.'
    },
    imagePath: path.join(__dirname, '..', 'test', 'test-image.jpg')
};

console.log('Iniciando prueba de envío de email a la organización...');
console.log('Configuración SMTP:');
console.log(`- Host: ${process.env.EMAIL_HOST}`);
console.log(`- Puerto: ${process.env.EMAIL_PORT}`);
console.log(`- Usuario: ${process.env.EMAIL_USER}`);
console.log(`- From: ${process.env.EMAIL_FROM}`);
console.log(`- To: ${process.env.EMAIL_TO}`);

try {
    const result = await sendParticipacionToOrganizacion(testData);
    console.log('✅ Email enviado correctamente');
    console.log('MessageId:', result.messageId);
    console.log('Preview URL:', result.preview);
} catch (error) {
    console.error('❌ Error al enviar el email:');
    console.error(error);
    process.exit(1);
} 