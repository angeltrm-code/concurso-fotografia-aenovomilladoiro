// Configuración centralizada de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    // Autenticación
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    
    // Carrusel
    CARRUSEL: {
        BASE: `${API_BASE_URL}/api/carrusel`,
        IMAGENES: `${API_BASE_URL}/api/carrusel/imagenes`,
        UPLOAD: `${API_BASE_URL}/api/carrusel/upload`,
        DELETE: (id) => `${API_BASE_URL}/api/carrusel/${id}`
    },
    
    // Bases
    BASES: {
        BASE: `${API_BASE_URL}/api/bases`,
        CONTENT: `${API_BASE_URL}/api/bases/content`
    },
    
    // Participaciones
    PARTICIPACIONES: {
        BASE: `${API_BASE_URL}/api/participaciones`,
        SUBMIT: `${API_BASE_URL}/api/participaciones/submit`
    }
};

// Función helper para manejar errores de API
export const handleApiError = (error, navigate) => {
    console.error('Error en petición API:', error);
    
    if (error.message === 'No autorizado' || error.status === 401 || error.status === 403) {
        navigate('/admin/login');
        return 'Sesión expirada. Por favor, vuelva a iniciar sesión.';
    }
    
    return error.message || 'Ha ocurrido un error inesperado';
}; 