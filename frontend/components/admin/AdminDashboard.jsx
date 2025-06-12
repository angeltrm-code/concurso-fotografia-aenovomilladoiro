import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarruselAdminPanel from './CarruselAdminPanel';
import EditorBasesPanel from './EditorBasesPanel';
import AdminBasesPDFPanel from './AdminBasesPDFPanel';
import { getToken, removeToken, fetchWithAuth } from '../../utils/tokenUtils';
import '../../styles/components/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [participantsError, setParticipantsError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = getToken();
            if (!token) {
                navigate('/admin/login');
                return;
            }
            try {
                await fetchWithAuth('/api/bases');
                setIsLoggedIn(true);
            } catch (err) {
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkToken();
    }, [navigate]);

    const handleLogout = () => {
        removeToken();
        navigate('/admin/login');
    };

    if (loading) return <div className="admin-dashboard-loading">Cargando panel de administración...</div>;
    if (!isLoggedIn) return null;

    return (
        <main className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-header-content">
                    <h1 className="admin-title">Panel de Administración</h1>
                    <div className="admin-user-info">
                        <button onClick={handleLogout} className="admin-logout-button">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
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
                    <AdminBasesPDFPanel />
                    <EditorBasesPanel />
                </div>
            </section>
        </main>
    );
};

export default AdminDashboard; 