import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUsername, isAuthenticated } from '../utils/auth';
import ParticipantesPanel from '../components/admin/ParticipantesPanel';
import CarruselAdminPanel from '../components/admin/CarruselAdminPanel';
import EditorBasesPanel from '../components/admin/EditorBasesPanel';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const username = getUsername();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/admin/login', { state: { from: '/admin' } });
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Función para formatear el nombre de usuario
    const formatUsername = (name) => {
        if (!name) return '';
        // Capitalizar primera letra y añadir tilde si es necesario
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        return formattedName === 'Salome' ? 'Salomé' : formattedName;
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1>Panel de Administración</h1>
                    <div className="admin-user-info">
                        <span className="admin-welcome">Bienvenida {formatUsername(username)}</span>
                        <button onClick={handleLogout} className="admin-logout-button">
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="admin-main">
                <section className="admin-section">
                    <h2 className="admin-section-title">Participantes</h2>
                    <div className="admin-card">
                        <ParticipantesPanel />
                    </div>
                </section>

                <section className="admin-section">
                    <h2 className="admin-section-title">Carrusel de Imágenes</h2>
                    <div className="admin-card">
                        <CarruselAdminPanel />
                    </div>
                </section>

                <section className="admin-section">
                    <h2 className="admin-section-title">Bases do Certame</h2>
                    <div className="admin-card">
                        <EditorBasesPanel />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard; 