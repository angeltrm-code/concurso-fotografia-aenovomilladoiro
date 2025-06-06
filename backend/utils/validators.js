import { z } from 'zod';

// Esquema de validación para los datos del formulario
const participacionSchema = z.object({
    nombre: z.string()
        .min(2, 'O nome debe ter polo menos 2 caracteres')
        .max(50, 'O nome non pode ter máis de 50 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/, 'O nome só pode conter letras, espazos e guións'),
    
    apelidos: z.string()
        .min(2, 'Os apelidos deben ter polo menos 2 caracteres')
        .max(100, 'Os apelidos non poden ter máis de 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/, 'Os apelidos só poden conter letras, espazos e guións'),
    
    nif: z.string()
        .min(8, 'O NIF/NIE debe ter polo menos 8 caracteres')
        .max(9, 'O NIF/NIE non pode ter máis de 9 caracteres')
        .regex(/^[0-9A-Z][0-9]{7}[0-9A-Z]$/, 'Formato de NIF/NIE inválido'),
    
    email: z.string()
        .email('Email inválido')
        .max(100, 'O email non pode ter máis de 100 caracteres'),
    
    telefono: z.string()
        .regex(/^[0-9]{9}$/, 'O teléfono debe ter 9 díxitos')
        .optional(),
    
    enderezo: z.string()
        .max(200, 'O enderezo non pode ter máis de 200 caracteres')
        .optional(),
    
    titulo: z.string()
        .min(3, 'O título debe ter polo menos 3 caracteres')
        .max(100, 'O título non pode ter máis de 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,!?-]+$/, 'O título contén caracteres non permitidos'),
    
    descripcion: z.string()
        .max(500, 'A descrición non pode ter máis de 500 caracteres')
        .optional()
});

// Función para sanitizar texto (eliminar caracteres potencialmente peligrosos)
const sanitizeText = (text) => {
    if (!text) return '';
    return text
        .replace(/[<>]/g, '') // Eliminar < y > para prevenir XSS
        .replace(/javascript:/gi, '') // Eliminar javascript: URLs
        .trim();
};

// Función para validar el archivo de imagen
const validateImageFile = (file) => {
    const errors = [];
    
    // Validar tipo MIME
    if (!['image/jpeg', 'image/jpg'].includes(file.mimetype)) {
        errors.push('Só se aceptan imaxes en formato JPG/JPEG');
    }
    
    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
        errors.push('A imaxe non pode ser maior de 5MB');
    }
    
    // Validar dimensiones mínimas (opcional)
    // Esto requeriría procesar la imagen, podríamos añadirlo si es necesario
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Función para generar un nombre de archivo seguro
const generateSafeFilename = (originalName) => {
    const timestamp = Date.now();
    const sanitizedName = originalName
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, '_') // Reemplazar caracteres no alfanuméricos
        .replace(/_{2,}/g, '_') // Reemplazar múltiples guiones bajos por uno solo
        .substring(0, 50); // Limitar longitud
    
    return `${timestamp}-${sanitizedName}`;
};

export {
    participacionSchema,
    sanitizeText,
    validateImageFile,
    generateSafeFilename
}; 