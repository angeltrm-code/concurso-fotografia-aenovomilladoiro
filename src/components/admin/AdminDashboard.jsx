import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarruselAdminPanel from './CarruselAdminPanel';
import EditorBasesPanel from './EditorBasesPanel';
import '../../styles/components/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [participantsError, setParticipantsError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkLogin = () => {
            const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
            if (!loggedIn) {
                navigate('/admin/login');
            } else {
                setIsLoggedIn(true);
                setTimeout(() => {
                   setParticipantsError('Error simulado al cargar participantes');
                }, 1500);
            }
        };
        checkLogin();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        navigate('/admin/login');
    };

    if (!isLoggedIn) return null;

    return (
        <main className="admin-dashboard">
            <header className="admin-header">
                <h1 className="admin-title">Panel de Administración</h1>
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                </button>
            </header>

            <section className="admin-section">
                <h2 className="admin-subtitle">Xestión de Participantes</h2>
                <div className="admin-card">
                    <div className="admin-card-content">
                         {participantsError ? (
                            <div className="error-msg">
                                Error al cargar los participantes: {participantsError}
                            </div>
                        ) : (
                            <p>Funcionalidad de gestión de participantes en desarrollo...</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="admin-section">
                 <h2 className="admin-subtitle">Xestión da Galería de Imaxes</h2>
                <div className="admin-card">
                     <CarruselAdminPanel />
                </div>
            </section>

            <section className="admin-section">
                <h2 className="admin-subtitle">Edición das Bases do Certame</h2>
                <div className="admin-card">
                    <EditorBasesPanel />
                </div>
            </section>
        </main>
    );
};

export default AdminDashboard; 