// Credenciales de prueba
const DEMO_CREDENTIALS = {
    username: 'salome',
    password: 'certame2025'
};

// Función para verificar credenciales
export const login = (username, password) => {
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        return true;
    }
    return false;
};

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return localStorage.getItem('isLoggedIn') === 'true';
};

// Función para obtener el nombre de usuario
export const getUsername = () => {
    return localStorage.getItem('username');
}; 