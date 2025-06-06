import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../utils/auth';
import ParticipantesPanel from '../components/admin/ParticipantesPanel';
import CarruselAdminPanel from '../components/admin/CarruselAdminPanel';
import EditorBasesPanel from '../components/admin/EditorBasesPanel';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const username = getUsername();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard-header">
                <h1>Panel de Administración</h1>
                <div className="admin-dashboard-user">
                    <span>Benvida, {username}</span>
                    <button onClick={handleLogout} className="admin-logout-button">
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <div className="admin-dashboard-content">
                <ParticipantesPanel />
                <CarruselAdminPanel />
                <EditorBasesPanel />

                <div className="admin-section">
                    <h2>Bases do Certame</h2>
                    <p>Aquí se podrán editar las bases del certamen...</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 