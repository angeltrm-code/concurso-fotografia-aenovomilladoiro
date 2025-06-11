# Documentación Técnica de la API

## Autenticación

### POST /api/admin/login
Autenticación de administrador mediante JWT.

**Request Body:**
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "token": "string"
}
```

## Carrusel

### GET /api/carrusel/imagenes
Obtiene la lista de imágenes del carrusel.

**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
[
    {
        "id": "string",
        "url": "string",
        "order": "number"
    }
]
```

### POST /api/carrusel/upload
Sube una nueva imagen al carrusel.

**Headers:**
- Authorization: Bearer {token}
- Content-Type: multipart/form-data

**Request Body:**
- file: File (imagen)

### DELETE /api/carrusel/:id
Elimina una imagen del carrusel.

**Headers:**
- Authorization: Bearer {token}

## Bases

### GET /api/bases/content
Obtiene el contenido de las bases del certamen.

**Headers:**
- Authorization: Bearer {token}

**Response:**
```json
{
    "content": "string"
}
```

### PUT /api/bases
Actualiza el contenido de las bases.

**Headers:**
- Authorization: Bearer {token}
- Content-Type: application/json

**Request Body:**
```json
{
    "content": "string"
}
```

## Participaciones

### POST /api/participaciones/submit
Envía una nueva participación al certamen.

**Request Body:**
```json
{
    "nombre": "string",
    "email": "string",
    "telefono": "string",
    "titulo": "string",
    "descripcion": "string",
    "imagen": File
}
```

## Códigos de Error

- 400: Bad Request - Datos de entrada inválidos
- 401: Unauthorized - Token no proporcionado o inválido
- 403: Forbidden - Token expirado
- 404: Not Found - Recurso no encontrado
- 500: Internal Server Error - Error del servidor 