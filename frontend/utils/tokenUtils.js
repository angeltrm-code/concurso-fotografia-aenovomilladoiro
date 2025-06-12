// Utilidades para manejo del token de administrador
export const getToken = () => {
    return localStorage.getItem('adminToken');
};

export const setToken = (token) => {
    localStorage.setItem('adminToken', token);
};

export const removeToken = () => {
    localStorage.removeItem('adminToken');
};

export const isAuthenticated = () => {
    return !!getToken();
};

// Función helper para hacer peticiones autenticadas
export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    if (!token) {
        throw new Error('No hay token de autenticación');
    }
    
    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': 'Bearer ' + token
        }
    });
    
    if (res.status === 401 || res.status === 403) {
        removeToken();
        throw new Error('No autorizado');
    }
    
    return res;
}; 