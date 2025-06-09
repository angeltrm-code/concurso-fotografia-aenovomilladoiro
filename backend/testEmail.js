import dotenv from 'dotenv';
dotenv.config();

import { sendConfirmationEmail } from './services/emailService.js'; // ajusta la ruta si es distinta

(async () => {
  try {
    console.log('🚀 Enviando correo de prueba...');

    await sendConfirmationEmail({
      to: 'angeltori90@gmail.com', // ← Cámbialo por tu email real de prueba
      nombre: 'Ángel (Correo de prueba)',
    });

    console.log('✅ Correo enviado con éxito');
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message);
  }
})();
