import { sendParticipacionToOrganizacion } from '../services/emailService.js';
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
  nombre: 'Usuario de Prueba',
  apelidos: 'Apellido de Prueba',
  email: process.env.TEST_EMAIL || 'angeltori90@gmail.com',
  nif: '12345678A',
  titulo: 'Foto de Prueba para Organización',
  descripcion: 'Esta é unha descrición de proba para a organización',
  enderezo: 'Calle de Prueba, 123',
  telefono: '123456789'
};

// Ruta de la imagen de prueba
const testImagePath = path.join(__dirname, '../test/test-image.jpg');

// Mostrar configuración SMTP
console.log('Configuración SMTP:');
console.log('Host:', process.env.EMAIL_HOST);
console.log('Puerto:', process.env.EMAIL_PORT);
console.log('Usuario:', process.env.EMAIL_USER);
console.log('Destinatario:', process.env.EMAIL_TO);

// Validación básica
if (!testData.email || !testImagePath) {
  console.error('❌ Faltan datos de prueba para enviar el correo.');
  process.exit(1);
}

// Intentar enviar el email
try {
  const result = await sendParticipacionToOrganizacion({
    datos: testData,
    imagePath: testImagePath
  });
  console.log('✅ Email enviado correctamente a la organización:', result);
} catch (error) {
  console.error('❌ Error al enviar el email a la organización:', error);
  process.exit(1);
}
