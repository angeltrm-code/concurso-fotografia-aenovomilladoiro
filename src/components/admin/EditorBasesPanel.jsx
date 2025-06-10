import React, { useState, useEffect } from 'react';
import '../../styles/components/admin/EditorBasesPanel.css';

const API_URL = 'http://localhost:5000/api/bases'; // Nueva URL del API para las bases

const EditorBasesPanel = () => {
    const [basesContent, setBasesContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchBases = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('Error al cargar las bases.');
                }
                const data = await response.json();
                setBasesContent(data.content);
            } catch (err) {
                console.error('Error al obtener las bases:', err);
                setError('No se pudieron cargar las bases.');
            } finally {
                setLoading(false);
            }
        };

        fetchBases();
    }, []);

    const handleChange = (e) => {
        setBasesContent(e.target.value);
    };

    const handleGuardar = async () => {
        setSuccessMessage(null);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: basesContent }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar las bases.');
            }

            setSuccessMessage('Bases actualizadas correctamente.');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error('Error al guardar las bases:', err);
            setError('No se pudieron guardar las bases.');
            setTimeout(() => setError(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="editor-bases-panel">
                <p>Cargando bases...</p>
            </div>
        );
    }

    return (
        <div className="editor-bases-panel">
            <h2>Edición de Bases del Certamen</h2>

            {error && <div className="message error-message">{error}</div>}
            {successMessage && <div className="message success-message">{successMessage}</div>}

            <div className="editor-bases-sections">
                <div className="bases-section-card admin-card">
                    <h3 className="bases-section-title">Contenido Completo de las Bases</h3>
                    <textarea
                        value={basesContent}
                        onChange={handleChange}
                        className="textarea-bases"
                        placeholder="Escribe aquí el contenido completo de las bases..."
                        rows="20"
                    />
                    <div className="bases-section-actions">
                        <button
                            onClick={handleGuardar}
                            className="btn-gardar"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorBasesPanel; 