# XI Certame de Fotografía Comercial AE Novo Milladoiro

Página web para la participación en el XI Certame de Fotografía Comercial do Parque Empresarial do Milladoiro, integrada visualmente con la web oficial de la Asociación de Empresarios Novo Milladoiro.

## Enlace al repositorio
https://github.com/angeltrm-code/concurso-fotografia-aenovomilladoiro

## Instrucciones de desarrollo

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

La web estará disponible en `http://localhost:5173`.

## Estructura del proyecto

- `/public`: Archivos públicos y estáticos
- `/src/components/PhotoUpload.jsx`: Componente principal del formulario de participación
- `/src/App.jsx`: Página principal y estructura general
- `/src/index.css`: Estilos base con TailwindCSS

## Componente `PhotoUpload`

Formulario para la participación en el certame. Incluye los siguientes campos:
- Nome e apelidos
- NIF ou NIE
- Enderezo (dirección postal)
- Correo electrónico
- Teléfono de contacto
- Título da fotografía (en galego)
- Subida de 1 única imaxe (JPG/JPEG, alta resolución)
- Checkbox de aceptación das bases

**Restricciones:**
- Solo se puede subir una imagen
- Formatos permitidos: `.jpg` o `.jpeg`
- El botón de envío se desactiva si falta algún campo requerido

**Comportamiento:**
- Previsualización de la imagen seleccionada
- Al enviar, muestra un resumen de los datos y la imagen (modo confirmación)
- Muestra los datos por consola (modo desarrollo)
- Simula el envío (la entrega real será por email a `foto@aenovomilladoiro.com`)

## Pendiente para futuras fases
- Integración real del envío de la imagen
- Validación estricta de los campos
- Subida de autorización firmada si aparecen personas identificables
- Carta de cesión de imagen

---

© Asociación de Empresarios Novo Milladoiro 2025
