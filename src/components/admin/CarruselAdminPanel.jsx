import React, { useState, useEffect } from 'react';
import '../../styles/components/admin/CarruselAdminPanel.css';

const CarruselAdminPanel = () => {
    // Estado para las imágenes actuales (simuladas)
    const [imagenes, setImagenes] = useState(() => {
        // Cargar imágenes desde localStorage al inicializar
        const savedImages = localStorage.getItem('carruselImages');
        if (savedImages) {
            try {
                return JSON.parse(savedImages);
            } catch (error) {
                console.error('Error al parsear imágenes del carrusel desde localStorage:', error);
                return []; // Retorna un array vacío si hay un error al parsear
            }
        } else {
            // Imágenes por defecto si no hay nada en localStorage
            return [
                '/slide1.jpg',
                '/slide2.jpg',
                '/slide3.jpg',
                '/slide4.jpg',
                '/slide5.jpg',
                '/slide6.jpg'
            ];
        }
    });

    // Estado para la previsualización de la nueva imagen
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Efecto para guardar las imágenes en localStorage cada vez que cambian
    useEffect(() => {
        try {
            localStorage.setItem('carruselImages', JSON.stringify(imagenes));
        } catch (error) {
            console.error('Error al guardar imágenes del carrusel en localStorage:', error);
        }
    }, [imagenes]); // Dependencia: guarda cuando el estado `imagenes` cambia

    // Función para manejar la selección de archivo
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Crear URL para previsualización
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // Función para simular la subida de imagen
    const handleUpload = () => {
        if (previewUrl) {
            setIsUploading(true);
            
            // Simular delay de subida
            setTimeout(() => {
                setImagenes(prev => [...prev, previewUrl]);
                setPreviewUrl(null);
                setIsUploading(false);
                // Limpiar el input file
                const fileInput = document.getElementById('fileInput');
                if (fileInput) {
                    fileInput.value = '';
                }
            }, 1000);
        }
    };

    // Función para eliminar una imagen
    const handleDelete = (index) => {
        setImagenes(prev => prev.filter((_, i) => i !== index));
    };

    // Limpiar URLs de previsualización al desmontar
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="carrusel-admin-panel">
            {/* Título general del panel, ya dentro de admin-card en AdminDashboard */}
            {/* <h2>Xestión do carrusel</h2> */}
            
            {/* Sección de subida */}
            <div className="subida-container">
                <div className="subida-inputs">
                    <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!previewUrl || isUploading}
                        className="btn-subir"
                    >
                        {isUploading ? 'Subindo...' : 'Subir imaxe'}
                    </button>
                </div>
                
                {/* Previsualización de la nueva imagen */}
                {previewUrl && (
                    <div className="preview-container">
                        <img src={previewUrl} alt="Previsualización" className="preview-image" />
                    </div>
                )}
            </div>

            {/* Galería de imágenes */}
            <div className="galeria-container">
                 {/* Contador de imágenes */}
                 <p className="image-count">Imágenes cargadas: {imagenes.length}</p>

                {imagenes.length === 0 ? (
                    <div className="galeria-empty">
                        Non hai imaxes no carrusel
                    </div>
                ) : (
                     <div className="carrusel-scroll-area">
                        <div className="galeria">
                            {imagenes.map((imagen, index) => (
                                <div key={index} className="miniatura-container">
                                    <img
                                        src={imagen}
                                        alt={`Imaxe do carrusel ${index + 1}`}
                                        className="miniatura-carrusel"
                                    />
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="btn-eliminar"
                                        title="Eliminar imaxe"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarruselAdminPanel; 