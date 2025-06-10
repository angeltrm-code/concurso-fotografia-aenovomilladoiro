// Credenciales de prueba
const DEMO_CREDENTIALS = {
    username: 'salome',
    password: 'certame2025'
};

// Función para verificar credenciales y generar token
export const login = (username, password) => {
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Simulamos un token JWT (en producción usar una librería como jsonwebtoken)
        const token = btoa(JSON.stringify({ username, timestamp: Date.now() }));
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username);
        return true;
    }
    return false;
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        // Verificar que el token no haya expirado (24 horas)
        const decoded = JSON.parse(atob(token));
        const tokenAge = Date.now() - decoded.timestamp;
        if (tokenAge > 24 * 60 * 60 * 1000) {
            logout();
            return false;
        }
        return true;
    } catch {
        logout();
        return false;
    }
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
};

// Función para obtener el nombre de usuario actual
export const getUsername = () => {
    return localStorage.getItem('username');
};

export const getToken = () => {
    return localStorage.getItem('adminToken');
}; 