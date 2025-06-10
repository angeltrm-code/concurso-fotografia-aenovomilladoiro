import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import '../../styles/components/CarruselAdminPanel.css';

const API_URL = 'http://localhost:5000/api/carrusel';

const CarruselAdminPanel = () => {
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const fetchWithAuth = async (url, options = {}) => {
        const token = getToken();
        const res = await fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                'Authorization': 'Bearer ' + token
            }
        });
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
            throw new Error('No autorizado');
        }
        return res;
    };

    useEffect(() => {
        cargarImagenes();
    }, [navigate]);

    const cargarImagenes = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth('/api/carrusel/imagenes');
            const data = await res.json();
            setImages(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecciona un archivo de imagen válido');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
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
        const file = event.dataTransfer.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecciona un archivo de imagen válido');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe superar los 5MB');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Por favor, selecciona una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('imagen', selectedFile);

        try {
            const res = await fetchWithAuth('/api/carrusel/subir', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Error al subir la imagen');
            }

            const data = await res.json();
            setSuccess('Imagen subida correctamente');
            setSelectedFile(null);
            setPreviewUrl(null);
            cargarImagenes();
        } catch (err) {
            console.error('Error:', err);
            setError('Error al subir la imagen');
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
            console.error('Error:', err);
            setError('Error al eliminar la imagen');
        }
    };

    return (
        <div className="carrusel-admin">
            <h2>Administrar Carrusel</h2>

            {error && (
                <div className="message error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="message success-message">
                    {success}
                </div>
            )}

            <div
                className={`upload-section ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="file-input-container">
                    <label className="file-input-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Arrastra una imagen o haz clic para seleccionar</span>
                        <input
                            type="file"
                            className="file-input"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </label>

                    {previewUrl && (
                        <div className="preview-container">
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="preview-image"
                            />
                        </div>
                    )}

                    <button
                        className="upload-button"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        Subir Imagen
                    </button>
                </div>
            </div>

            <div className="gallery-section">
                <h3>Imágenes del Carrusel</h3>
                {loading ? (
                    <div className="message">Cargando imágenes...</div>
                ) : images.length === 0 ? (
                    <div className="message">No hay imágenes en el carrusel</div>
                ) : (
                    <div className="gallery-grid">
                        {images.map((image) => (
                            <div key={image.nombre} className="gallery-item">
                                <img
                                    src={`http://localhost:5000${image.url}`}
                                    alt={image.nombre}
                                    className="gallery-image"
                                />
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(image.nombre)}
                                    aria-label="Eliminar imagen"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarruselAdminPanel; 