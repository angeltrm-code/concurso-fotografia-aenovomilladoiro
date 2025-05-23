# XI Certame de Fotografía - Backend Express

Este backend gestiona las participaciones del XI Certame de Fotografía. Permite recibir datos y fotos de los participantes, guardar los archivos y registrar todas las participaciones.

## 🚀 Instalación

1. Clona el repositorio o copia los archivos en tu máquina.
2. Instala las dependencias:
   ```bash
   npm install
   ```

## ▶️ Cómo arrancar el servidor

```bash
node server.js
```

El servidor escuchará por defecto en el puerto 4000 (o el que definas en la variable de entorno `PORT`).

## 📤 Endpoint POST `/api/participar`

- **Método:** POST
- **Tipo de datos:** `multipart/form-data`
- **Campos requeridos:**
  - `nombre` (texto)
  - `email` (texto)
  - `titulo` (texto)
  - `foto` (archivo imagen)
- **¿Qué hace?**
  - Guarda la imagen en la carpeta `/uploads` (se crea automáticamente si no existe), renombrada con la fecha y el nombre original.
  - Registra los datos de la participación en el archivo `participaciones.json` junto con la fecha de recepción.
  - Devuelve un mensaje de confirmación al cliente.

## 📥 Endpoint GET `/api/participaciones`

- **Método:** GET
- **¿Qué hace?**
  - Devuelve un array con todas las participaciones registradas en `participaciones.json`.
  - Cada participación incluye: nombre, email, título, nombre del archivo y fecha.
  - Si no hay participaciones, devuelve `[]`.
  - Si ocurre un error de lectura, devuelve error 500.

## 📂 Estructura de archivos generados

- `/uploads/` — Carpeta donde se guardan las imágenes subidas.
- `participaciones.json` — Archivo donde se registran todas las participaciones en formato JSON.

## 🧪 Cómo probarlo

### Con Postman o similar
1. Haz una petición POST a `http://localhost:4000/api/participar`.
2. En el body, selecciona `form-data` y añade los campos:
   - `nombre`: tu nombre
   - `email`: tu email
   - `titulo`: título de la foto
   - `foto`: selecciona un archivo de imagen
3. Envía la petición. Deberías recibir `{ "mensaje": "Fotografía recibida con éxito!" }`.

### Desde el frontend
- Configura tu formulario para enviar los datos como `multipart/form-data` al endpoint `http://localhost:4000/api/participar`.
- Puedes consultar todas las participaciones con una petición GET a `http://localhost:4000/api/participaciones`.

## ✉️ Configuración de envío de emails automáticos

Este backend pode enviar un correo ao organizador do certame (co arquivo adxunto) e unha confirmación ao participante tras recibir a súa participación.

1. Instala as dependencias necesarias:
   ```bash
   npm install nodemailer dotenv
   ```
2. Crea un arquivo `.env` na raíz do proxecto co seguinte contido (exemplo):
   ```env
   SMTP_HOST=smtp.tu-servidor.com
   SMTP_PORT=465
   SMTP_USER=usuario@dominio.com
   SMTP_PASS=contrasinal
   EMAIL_ORIGEN=usuario@dominio.com
   EMAIL_DESTINO=correooficial@dominio.com
   ```
   - **EMAIL_DESTINO**: será o correo oficial do certame (podes cambialo cando o teñas definitivo).
   - **EMAIL_ORIGEN**: debe ser unha conta válida do servidor SMTP.

3. O sistema enviará:
   - Un email ao organizador co arquivo da foto adxunto e os datos do participante.
   - Un email de confirmación ao participante agradecendo a súa participación.

> **Nota:** Se usas Gmail, debes crear unha contrasinal de aplicación e activar o acceso a apps menos seguras.

---

© Asociación de Empresarios Novo Milladoiro 2025
