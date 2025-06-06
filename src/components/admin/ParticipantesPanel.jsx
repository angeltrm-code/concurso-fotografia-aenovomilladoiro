import React, { useState, useEffect } from 'react';
import '../../styles/components/admin/ParticipantesPanel.css';

const ParticipantesPanel = () => {
    const [participantes, setParticipantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipantes = async () => {
            try {
                const response = await fetch('/api/participaciones');
                if (!response.ok) {
                    throw new Error('Error al cargar las participaciones');
                }
                const data = await response.json();
                setParticipantes(data.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipantes();
    }, []);

    if (loading) {
        return <div className="participantes-loading">Cargando participantes...</div>;
    }

    if (error) {
        return <div className="participantes-error">Error: {error}</div>;
    }

    if (participantes.length === 0) {
        return <div className="participantes-empty">No hay participaciones registradas aún.</div>;
    }

    return (
        <div className="participantes-panel">
            <h2>Lista de Participantes</h2>
            <div className="tabla-participantes-container">
                <table className="tabla-participantes">
                    <thead>
                        <tr>
                            <th>Participante</th>
                            <th>Email</th>
                            <th>Título</th>
                            <th>Fotografía</th>
                            <th>Autorización</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantes.map((participante, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="participante-info">
                                        <span className="participante-nombre">
                                            {participante.nombre} {participante.apelidos}
                                        </span>
                                        <span className="participante-nif">NIF: {participante.nif}</span>
                                    </div>
                                </td>
                                <td>
                                    <a href={`mailto:${participante.email}`} className="participante-email">
                                        {participante.email}
                                    </a>
                                </td>
                                <td>
                                    <div className="participante-titulo">
                                        <strong>{participante.titulo}</strong>
                                        {participante.descripcion && (
                                            <p className="participante-descripcion">{participante.descripcion}</p>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {participante.foto && (
                                        <div className="foto-container">
                                            <img
                                                src={participante.foto}
                                                alt={`Fotografía de ${participante.titulo}`}
                                                className="foto-miniatura"
                                            />
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {participante.autorizacion && (
                                        <a
                                            href={participante.autorizacion}
                                            download
                                            className="descarga-btn"
                                        >
                                            Descargar
                                        </a>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParticipantesPanel; 