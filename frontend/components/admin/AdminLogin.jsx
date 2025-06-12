import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../utils/tokenUtils';
import { API_ENDPOINTS, handleApiError } from '../../config/apiConfig';
import '../../styles/components/admin/AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error de autenticación');
            setToken(data.token);
            navigate('/admin');
        } catch (err) {
            setError(handleApiError(err, navigate));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Acceso Administración</h1>
                <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                    <div className="form-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Usuario"
                            className="form-input"
                            required
                            autoComplete="username"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group password">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="form-input"
                            required
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Accediendo...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin; 