import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../../utils/tokenUtils';
import { API_ENDPOINTS, handleApiError } from '../../config/apiConfig';
import '../../styles/components/admin/CarruselAdminPanel.css';

const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024;

const CarruselAdminPanel = () => {
    const [images, setImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        cargarImagenes();
    }, [navigate]);

    useEffect(() => {
        if (selectedFiles.length > 0) {
            const urls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviews(urls);
            return () => urls.forEach(url => URL.revokeObjectURL(url));
        } else {
            setPreviews([]);
        }
    }, [selectedFiles]);

    const cargarImagenes = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(API_ENDPOINTS.CARRUSEL.IMAGENES);
            const data = await res.json();
            setImages(data);
        } catch (err) {
            setError(handleApiError(err, navigate));
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setError(null);
        const files = Array.from(event.target.files);
        if (files.length > MAX_FILES) {
            setError(`Solo puedes seleccionar hasta ${MAX_FILES} imágenes a la vez.`);
            return;
        }
        for (let file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen.');
                return;
            }
            if (file.size > MAX_SIZE) {
                setError('Cada imagen no debe superar los 5MB.');
                return;
            }
        }
        setSelectedFiles(files);
    };

    const handleRemovePreview = (idx) => {
        const newFiles = selectedFiles.filter((_, i) => i !== idx);
        setSelectedFiles(newFiles);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        setError(null);
        const files = Array.from(event.dataTransfer.files);
        if (files.length > MAX_FILES) {
            setError(`Solo puedes seleccionar hasta ${MAX_FILES} imágenes a la vez.`);
            return;
        }
        for (let file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Solo se permiten archivos de imagen.');
                return;
            }
            if (file.size > MAX_SIZE) {
                setError('Cada imagen no debe superar los 5MB.');
                return;
            }
        }
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Selecciona al menos una imagen.');
            return;
        }
        setError(null);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('imagenes', file));
        try {
            const res = await fetchWithAuth('/api/carrusel/subir', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) {
                throw new Error('Error al subir las imágenes');
            }
            const data = await res.json();
            setSuccess('Imágenes subidas correctamente');
            setSelectedFiles([]);
            setPreviews([]);
            cargarImagenes();
        } catch (err) {
            setError('Error al subir las imágenes');
        }
    };

    const handleDelete = async (nombre) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
            return;
        }
        try {
            const res = await fetchWithAuth(`/api/carrusel/eliminar/${nombre}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                throw new Error('Error al eliminar la imagen');
            }
            setSuccess('Imagen eliminada correctamente');
            cargarImagenes();
        } catch (err) {
            setError('Error al eliminar la imagen');
        }
    };

    return (
        <div className="carrusel-admin-panel">
            <h2>Administrar Carrusel</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <div
                className={`subida-container ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="subida-inputs">
                    <input
                        type="file"
                        className="file-input"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={selectedFiles.length >= MAX_FILES}
                    />
                    <button
                        className="btn-subir"
                        onClick={handleUpload}
                        disabled={selectedFiles.length === 0}
                    >
                        Subir imágenes
                    </button>
                </div>
                {previews.length > 0 && (
                    <div className="preview-list" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                        {previews.map((url, idx) => (
                            <div key={idx} className="preview-container" style={{ position: 'relative', width: 120, height: 80 }}>
                                <img src={url} alt={`preview-${idx}`} className="preview-image" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
                                <button
                                    className="btn-eliminar"
                                    style={{ position: 'absolute', top: 2, right: 2, background: '#FF6700', color: '#fff', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={() => handleRemovePreview(idx)}
                                    aria-label="Eliminar imagen"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="galeria-container">
                <div className="galeria-title">Imágenes del Carrusel</div>
                <div className="image-count">Total: {images.length}</div>
                {loading ? (
                    <div className="galeria-empty">Cargando imágenes...</div>
                ) : images.length === 0 ? (
                    <div className="galeria-empty">No hay imágenes en el carrusel</div>
                ) : (
                    <div className="galeria-grid">
                        {images.map((image) => (
                            <div key={image.nombre} className="galeria-item">
                                <div className="galeria-image-container">
                                    <img
                                        src={`http://localhost:3000${image.url}`}
                                        alt={image.nombre}
                                        className="galeria-image"
                                    />
                                    <button
                                        className="btn-eliminar"
                                        onClick={() => handleDelete(image.nombre)}
                                        aria-label="Eliminar imagen"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="galeria-image-name">{image.nombre}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarruselAdminPanel; 