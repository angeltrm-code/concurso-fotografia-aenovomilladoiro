import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/tokenUtils';
import { API_ENDPOINTS, handleApiError } from '../../config/apiConfig';
import '../../styles/components/admin/EditorBasesPanel.css';
import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaTrophy, FaGavel, FaMapMarkerAlt, FaEnvelopeOpenText, FaBuilding, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaBook, FaStar, FaClipboardList, FaEdit, FaInfoCircle, FaLock, FaGlobe, FaUserShield } from 'react-icons/fa';

const ICONS = [
  { name: 'FaUsers', icon: <FaUsers color="#2C415E" size={28} /> },
  { name: 'FaCamera', icon: <FaCamera color="#2C415E" size={28} /> },
  { name: 'FaFileImage', icon: <FaFileImage color="#2C415E" size={28} /> },
  { name: 'FaCalendarAlt', icon: <FaCalendarAlt color="#2C415E" size={28} /> },
  { name: 'FaTrophy', icon: <FaTrophy color="#2C415E" size={28} /> },
  { name: 'FaGavel', icon: <FaGavel color="#2C415E" size={28} /> },
  { name: 'FaMapMarkerAlt', icon: <FaMapMarkerAlt color="#2C415E" size={28} /> },
  { name: 'FaEnvelopeOpenText', icon: <FaEnvelopeOpenText color="#2C415E" size={28} /> },
  { name: 'FaBuilding', icon: <FaBuilding color="#2C415E" size={28} /> },
  { name: 'FaLightbulb', icon: <FaLightbulb color="#2C415E" size={28} /> },
  { name: 'FaCheckCircle', icon: <FaCheckCircle color="#2C415E" size={28} /> },
  { name: 'FaExclamationTriangle', icon: <FaExclamationTriangle color="#2C415E" size={28} /> },
  { name: 'FaBook', icon: <FaBook color="#2C415E" size={28} /> },
  { name: 'FaStar', icon: <FaStar color="#2C415E" size={28} /> },
  { name: 'FaClipboardList', icon: <FaClipboardList color="#2C415E" size={28} /> },
  { name: 'FaEdit', icon: <FaEdit color="#2C415E" size={28} /> },
  { name: 'FaInfoCircle', icon: <FaInfoCircle color="#2C415E" size={28} /> },
  { name: 'FaLock', icon: <FaLock color="#2C415E" size={28} /> },
  { name: 'FaGlobe', icon: <FaGlobe color="#2C415E" size={28} /> },
  { name: 'FaUserShield', icon: <FaUserShield color="#2C415E" size={28} /> },
];

const EditorBasesPanel = () => {
    const [bases, setBases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editStates, setEditStates] = useState({});
    const [newSection, setNewSection] = useState({ titulo: '', contido: '' });
    const navigate = useNavigate();
    const movingRefs = useRef({});

    useEffect(() => {
        fetchBases();
    }, [navigate]);

    const fetchBases = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.BASES.BASE);
            const data = await res.json();
            setBases(data);
        } catch (err) {
            setError(handleApiError(err, navigate));
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (id, field, value) => {
        setBases(bases => bases.map(b => b.id === id ? { ...b, [field]: value } : b));
        setEditStates(states => ({ ...states, [id]: true }));
    };

    const handleSave = async (id) => {
        setError(null);
        setSuccess(null);
        const base = bases.find(b => b.id === id);
        if (!base.titulo.trim() || !base.contido.trim()) {
            setError('Título y contenido no pueden estar vacíos.');
            return;
        }
        try {
            const res = await fetchWithAuth(`${API_ENDPOINTS.BASES.BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: base.titulo, contido: base.contido })
            });
            if (!res.ok) throw new Error('Error al guardar la sección.');
            setSuccess('Sección guardada correctamente.');
            setEditStates(states => ({ ...states, [id]: false }));
        } catch (err) {
            setError(handleApiError(err, navigate));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta sección?')) return;
        setError(null);
        setSuccess(null);
        try {
            const res = await fetchWithAuth(`${API_ENDPOINTS.BASES.BASE}/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Error al eliminar la sección.');
            setSuccess('Sección eliminada correctamente.');
            setBases(bases => bases.filter(b => b.id !== id));
        } catch (err) {
            setError(handleApiError(err, navigate));
        }
    };

    // Reordenar tarjetas y guardar automáticamente
    const moveBase = async (fromIdx, toIdx) => {
        if (toIdx < 0 || toIdx >= bases.length) return;
        const newBases = [...bases];
        const [moved] = newBases.splice(fromIdx, 1);
        newBases.splice(toIdx, 0, moved);
        setBases(newBases);
        // Animación visual
        const movedId = moved.id;
        movingRefs.current[movedId] = true;
        setTimeout(() => {
            movingRefs.current[movedId] = false;
            setBases(b => [...b]);
        }, 350);
        // Validación antes de enviar
        for (const b of newBases) {
            if (!b.id || !b.titulo || !b.contido || !b.titulo.trim() || !b.contido.trim()) {
                setError('No se puede reordenar: todas las bases deben tener título y contenido.');
                return;
            }
        }
        try {
            await fetchWithAuth(`${API_ENDPOINTS.BASES.BASE}/orden`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bases: newBases })
            });
        } catch (err) {
            setError('Error al guardar el nuevo orden.');
        }
    };

    const handleNewChange = (field, value) => {
        setNewSection(sec => ({ ...sec, [field]: value }));
    };

    const handleAddNew = async () => {
        setError(null);
        setSuccess(null);
        if (!newSection.titulo.trim() || !newSection.contido.trim()) {
            setError('Título y contenido no pueden estar vacíos.');
            return;
        }
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.BASES.BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSection)
            });
            if (!res.ok) throw new Error('Error al añadir la sección.');
            setSuccess('Sección añadida correctamente.');
            setNewSection({ titulo: '', contido: '' });
            fetchBases();
        } catch (err) {
            setError(handleApiError(err, navigate));
        }
    };

    const handleIconSelect = async (id, iconName) => {
        setBases(bases => bases.map(b => b.id === id ? { ...b, icon: iconName } : b));
        try {
            const base = bases.find(b => b.id === id);
            await fetchWithAuth(`${API_ENDPOINTS.BASES.BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: base.titulo, contido: base.contido, icon: iconName })
            });
        } catch (err) {
            setError('Error al guardar el icono.');
        }
    };

    return (
        <div className="editor-bases-panel">
            <h2>Edición das Bases do Certame</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            {loading ? (
                <div className="galeria-empty">Cargando secciones...</div>
            ) : (
                <div className="editor-bases-sections">
                    {bases.map((base, idx) => (
                        <div key={base.id} className={`bases-section-card admin-card${movingRefs.current[base.id] ? ' moving' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                                <input
                                    className="bases-section-title-input"
                                    value={base.titulo}
                                    onChange={e => handleEditChange(base.id, 'titulo', e.target.value)}
                                    placeholder="Título de la sección"
                                    style={{ flex: 1 }}
                                />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn-mover"
                                        onClick={() => moveBase(idx, idx - 1)}
                                        disabled={idx === 0}
                                        title="Mover arriba"
                                    >↑</button>
                                    <button
                                        className="btn-mover"
                                        onClick={() => moveBase(idx, idx + 1)}
                                        disabled={idx === bases.length - 1}
                                        title="Mover abajo"
                                    >↓</button>
                                </div>
                            </div>
                            <div className="icon-gallery">
                                {ICONS.map(({ name, icon }) => (
                                    <button
                                        key={name}
                                        className={`icon-btn${base.icon === name ? ' selected' : ''}`}
                                        onClick={() => handleIconSelect(base.id, name)}
                                        type="button"
                                        title={name.replace('Fa', '')}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="bases-section-content-input"
                                value={base.contido}
                                onChange={e => handleEditChange(base.id, 'contido', e.target.value)}
                                placeholder="Contenido de la sección"
                                rows={4}
                            />
                            <div className="bases-section-actions">
                                <button
                                    className="btn-guardar"
                                    onClick={() => handleSave(base.id)}
                                    disabled={!editStates[base.id]}
                                >
                                    Guardar
                                </button>
                                <button
                                    className="btn-eliminar"
                                    onClick={() => handleDelete(base.id)}
                                    title="Eliminar sección"
                                >🗑️</button>
                            </div>
                        </div>
                    ))}
                    <div className="bases-section-card admin-card nueva-seccion">
                        <input
                            className="bases-section-title-input"
                            value={newSection.titulo}
                            onChange={e => handleNewChange('titulo', e.target.value)}
                            placeholder="Nuevo título de sección"
                        />
                        <textarea
                            className="bases-section-content-input"
                            value={newSection.contido}
                            onChange={e => handleNewChange('contido', e.target.value)}
                            placeholder="Nuevo contenido de sección"
                            rows={3}
                        />
                        <div className="bases-section-actions">
                            <button
                                className="btn-guardar"
                                onClick={handleAddNew}
                            >
                                Añadir sección
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditorBasesPanel; 