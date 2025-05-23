const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true para 465, false para outros
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function enviarParticipacionOrganizador({ nombre, email, titulo, archivoPath, archivoNombre }) {
  const mailOptions = {
    from: process.env.EMAIL_ORIGEN,
    to: process.env.EMAIL_DESTINO,
    subject: `Nova participación: ${titulo}`,
    text: `Recibiuse unha nova participación no certame:\n\nNome: ${nombre}\nEmail: ${email}\nTítulo: ${titulo}\n\nA foto vai adxunta.`,
    attachments: [
      {
        filename: archivoNombre,
        path: archivoPath,
      },
    ],
  };
  return transporter.sendMail(mailOptions);
}

async function enviarConfirmacionParticipante({ nombre, email, titulo, archivoPath }) {
  // Rutas absolutas a los logos en /public
  const logoAENM = path.join(__dirname, 'public', 'LogoAENM.png');
  const logosInstitucionais = path.join(__dirname, 'public', 'Logos-AENMI-300x75.png');

  const html = `
    <div style="font-family: Montserrat, Arial, sans-serif; background: #f8fafc; padding: 2rem; color: #2C415E;">
      <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 16px 0 rgba(44,65,94,0.10); padding: 2rem 1.5rem;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <img src="cid:logoAENM" alt="Logo AE Novo Milladoiro" style="height: 60px; margin-bottom: 1rem;" />
        </div>
        <h2 style="text-align: center; font-size: 1.4rem; font-weight: 800; margin-bottom: 1.2rem;">Hola, ${nombre}!</h2>
        <p style="font-size: 1.08rem; text-align: center; margin-bottom: 1.2rem;">Confirmamos que recibimos correctamente a túa participación no <b>XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro</b>.</p>
        <div style="background: #f1f5f9; border-radius: 12px; padding: 1rem; margin-bottom: 1.2rem;">
          <b>Título da fotografía:</b><br />
          <span style="font-size: 1.1rem; color: #232323;">${titulo}</span>
        </div>
        <div style="text-align: center; margin-bottom: 1.2rem;">
          <img src="cid:fotoParticipante" alt="Previsualización da foto" style="max-width: 100%; max-height: 220px; border-radius: 12px; box-shadow: 0 2px 8px 0 rgba(44,65,94,0.10);" />
        </div>
        <p style="font-size: 1.05rem; text-align: center; margin-bottom: 1.5rem;">Moitas grazas por participar e moita sorte!<br />
        <span style="font-size: 0.98rem; color: #444;">Se tes dúbidas, podes responder a este correo.</span></p>
        <div style="text-align: center; margin-top: 2rem;">
          <img src="cid:logosInstitucionais" alt="Logos institucionais" style="height: 48px; margin: 0 auto;" />
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_ORIGEN,
    to: email,
    subject: 'Confirmación de participación no XI Certame de Fotografía',
    html,
    attachments: [
      {
        filename: 'foto.jpg',
        path: archivoPath,
        cid: 'fotoParticipante',
      },
      {
        filename: 'LogoAENM.png',
        path: logoAENM,
        cid: 'logoAENM',
      },
      {
        filename: 'Logos-AENMI-300x75.png',
        path: logosInstitucionais,
        cid: 'logosInstitucionais',
      },
    ],
  };
  return transporter.sendMail(mailOptions);
}

module.exports = {
  enviarParticipacionOrganizador,
  enviarConfirmacionParticipante,
}; 