import { sendConfirmationEmail } from '../services/emailService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar dotenv
dotenv.config();

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Datos de prueba
const testData = {
  to: process.env.TEST_EMAIL || 'angeltori90@gmail.com',
  nombre: 'Usuario de Prueba'
};

// Mostrar configuración SMTP
console.log('Configuración SMTP:');
console.log('Host:', process.env.EMAIL_HOST);
console.log('Puerto:', process.env.EMAIL_PORT);
console.log('Usuario:', process.env.EMAIL_USER);
console.log('Destinatario:', testData.to);

// Validar destinatario
if (!testData.to) {
  console.error('❌ TEST_EMAIL no definido. Añádelo al .env.');
  process.exit(1);
}

// Intentar enviar el email
try {
  const result = await sendConfirmationEmail(testData);
  console.log('✅ Email enviado correctamente:', result);
} catch (error) {
  console.error('❌ Error al enviar el email:', error);
  process.exit(1);
}
