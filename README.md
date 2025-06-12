# XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro

## Estructura del Proyecto

```
.
├── frontend/           # Aplicación React + Vite
│   ├── src/           # Código fuente del frontend
│   ├── public/        # Archivos estáticos
│   └── package.json   # Dependencias del frontend
├── backend/           # API Node.js + Express
│   ├── routes/        # Rutas de la API
│   ├── services/      # Servicios (email, etc)
│   ├── utils/         # Utilidades
│   └── package.json   # Dependencias del backend
└── package.json       # Scripts comunes y configuración
```

## Requisitos

- Node.js >= 18
- npm >= 9

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd concurso-fotografia-aenovomilladoiro
```

2. Instalar dependencias:
```bash
npm run install:all
```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` en la carpeta backend
   - Ajustar las variables según sea necesario

## Desarrollo

Para iniciar el entorno de desarrollo:

```bash
npm run dev
```

Esto iniciará:
- Frontend en http://localhost:5173
- Backend en http://localhost:3000

## Scripts Disponibles

- `npm run dev` - Inicia frontend y backend en modo desarrollo
- `npm run dev:frontend` - Solo frontend en modo desarrollo
- `npm run dev:backend` - Solo backend en modo desarrollo
- `npm run build` - Construye el frontend para producción
- `npm start` - Inicia el backend en modo producción
- `npm run lint` - Ejecuta el linter en frontend y backend

## Estructura de Carpetas

### Frontend
- `src/components/` - Componentes React
- `src/pages/` - Páginas principales
- `src/utils/` - Utilidades y helpers
- `src/styles/` - Estilos CSS
- `src/config/` - Configuración (API, etc)

### Backend
- `routes/` - Definición de rutas API
- `services/` - Servicios (email, etc)
- `utils/` - Utilidades y helpers
- `middleware/` - Middlewares de Express
- `data/` - Datos estáticos (bases, etc)

## Documentación API

Ver `backend/API_README.md` para la documentación completa de la API.

Este backend gestiona las participaciones del XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro. Permite recibir datos y fotos de los participantes, guardar los archivos y registrar todas las participaciones, además de enviar correos automáticos de confirmación y notificación.

## 🚀 Instalación y primer uso

1. Clona el repositorio o copia los archivos en tu máquina.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   SMTP_HOST=aenovomilladoiro-com.correoseguro.dinaserver.com
   SMTP_PORT=465
   SMTP_USER=foto@aenovomilladoiro.com
   SMTP_PASS=AnxoToribio&2025
   ORGANIZER_EMAIL=foto@aenovomilladoiro.com
   PORT=3000
   ```

## ▶️ Cómo arrancar el backend

```bash
node backend/app.js
```

El servidor escuchará por defecto en el puerto 3000 (o el que definas en la variable de entorno `PORT`).

## 📤 Endpoint POST `/api/participar`

- **Método:** POST
- **Tipo de datos:** `multipart/form-data`
- **Campos requeridos:**
  - `nombre` (texto)
  - `apelidos` (texto)
  - `nif` (texto)
  - `email` (texto)
  - `titulo` (texto)
  - `foto` (archivo imagen JPG/JPEG, máx. 5MB)
- **Campos opcionales:**
  - `enderezo` (texto)
  - `telefono` (texto)
  - `descripcion` (texto)
- **¿Qué hace?**
  - Guarda la imagen en la carpeta `/uploads` (se crea automáticamente si no existe), renombrada de forma segura.
  - Registra los datos de la participación en el archivo `participaciones.json` junto con la fecha y la IP.
  - Envía un email de confirmación al participante.
  - Envía un email a la organización con los datos y la foto adjunta.
  - Devuelve un mensaje de confirmación o error.

## 📥 Endpoint GET `/api/participaciones`

- **Método:** GET
- **¿Qué hace?**
  - Devuelve un array con todas las participaciones registradas en `participaciones.json`.
  - Cada participación incluye: nombre, email, título, nombre del archivo, fecha e IP.
  - Si no hay participaciones, devuelve `[]`.
  - Si ocurre un error de lectura, devuelve error 500.

## 📂 Estructura de carpetas y archivos

```
/backend
  |-- app.js           # Punto de entrada del backend
  |-- routes.js        # Rutas principales
  |-- services/
      |-- emailService.js
  |-- utils/
      |-- utils.js
      |-- validators.js
/uploads/              # Carpeta donde se guardan las imágenes subidas
/participaciones.json   # Archivo donde se registran todas las participaciones
```

## 🧪 Cómo probar el sistema

### Con Postman o similar
1. Haz una petición POST a `http://localhost:3000/api/participar`.
2. En el body, selecciona `form-data` y añade los campos requeridos y la foto.
3. Envía la petición. Deberías recibir `{ "success": true, "message": "Participación recibida correctamente" }`.

### Desde el frontend
- Configura tu formulario para enviar los datos como `multipart/form-data` al endpoint `http://localhost:3000/api/participar`.
- Puedes consultar todas las participaciones con una petición GET a `http://localhost:3000/api/participaciones`.

## 🔐 Seguridad y validaciones
- Validación estricta de campos con Zod.
- Sanitización de inputs para evitar XSS.
- Solo se aceptan imágenes JPG/JPEG de hasta 5MB.
- Rate limiting: máximo 5 participaciones por IP cada 15 minutos.
- Headers de seguridad con Helmet.

## ✉️ Variables de entorno necesarias

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Credenciales SMTP para el envío de correos.
- `ORGANIZER_EMAIL`: Correo de la organización que recibirá las participaciones.
- `PORT`: Puerto en el que se ejecuta el backend (opcional, por defecto 3000).

---

© Asociación de Empresarios Novo Milladoiro 2025
