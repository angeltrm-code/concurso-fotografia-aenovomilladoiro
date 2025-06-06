import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/admin/AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Credenciales hardcodeadas
        if (username === 'salome' && password === 'aenovomilladoiro2024') {
            localStorage.setItem('adminLoggedIn', 'true');
            navigate('/admin');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Acceso Administración</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Usuario"
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="form-input"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-login">
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin; 