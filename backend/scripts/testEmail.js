import { sendConfirmationEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Datos de prueba
const testData = {
    to: process.env.TEST_EMAIL || 'test@example.com',
    nombre: 'Usuario de Prueba'
};

console.log('Iniciando prueba de envío de email de confirmación...');
console.log('Configuración SMTP:');
console.log(`- Host: ${process.env.EMAIL_HOST}`);
console.log(`- Puerto: ${process.env.EMAIL_PORT}`);
console.log(`- Usuario: ${process.env.EMAIL_USER}`);
console.log(`- From: ${process.env.EMAIL_FROM}`);
console.log(`- To: ${testData.to}`);

try {
    const result = await sendConfirmationEmail(testData);
    console.log('✅ Email enviado correctamente');
    console.log('MessageId:', result.messageId);
    console.log('Preview URL:', result.preview);
} catch (error) {
    console.error('❌ Error al enviar el email:');
    console.error(error);
    process.exit(1);
} 