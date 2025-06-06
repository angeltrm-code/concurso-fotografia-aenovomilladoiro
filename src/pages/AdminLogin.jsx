import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import '../styles/pages/AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (login(username, password)) {
            navigate('/admin');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h1>Acceso Administración</h1>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    {error && <div className="admin-login-error">{error}</div>}
                    
                    <div className="admin-login-field">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-login-field">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="admin-login-button">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin; 