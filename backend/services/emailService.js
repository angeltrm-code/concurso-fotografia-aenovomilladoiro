import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración del transporter para Dinahosting
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: process.env.EMAIL_SECURE === 'true', // true si usas puerto 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo de confirmación al participante
 * @param {Object} params - Parámetros del correo
 * @param {string} params.to - Email del participante
 * @param {string} params.nombre - Nombre del participante
 */
const sendConfirmationEmail = async ({ to, nombre }) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject: 'Confirmación de recepción da túa fotografía',
        html: `
            Bo día, <strong>${nombre}</strong>!<br><br>
            Confirmamos que recibimos correctamente a túa participación no XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro.<br><br>
            Agradecemos moito o teu interese e desexámosche moita sorte no concurso.<br><br>
            Un saúdo cordial,<br>
            A organización do certame
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📤 Correo de confirmación enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error ao enviar o correo de confirmación:', error);
        throw error;
    }
};

/**
 * Envía un correo a la organización con los datos de la participación
 * @param {Object} params - Parámetros del correo
 * @param {Object} params.datos - Datos del participante
 * @param {string} params.imagePath - Ruta de la imagen adjunta
 */
const sendParticipacionToOrganizacion = async ({ datos, imagePath }) => {
    const {
        nombre,
        apelidos,
        nif,
        enderezo,
        email,
        telefono,
        titulo,
        descripcion
    } = datos;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'Nova participación recibida',
        text: `
Nova participación recibida no XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro:

Nome: ${nombre}
Apelidos: ${apelidos}
NIF/NIE: ${nif}
Enderezo: ${enderezo}
Email: ${email}
Teléfono: ${telefono}
Título da foto: ${titulo}
Descrición: ${descripcion}
        `,
        attachments: [
            {
                filename: 'foto.jpg',
                path: imagePath
            }
        ]
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📤 Correo á organización enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Error ao enviar o correo á organización:', error);
        throw error;
    }
};

export {
    sendConfirmationEmail,
    sendParticipacionToOrganizacion
};
