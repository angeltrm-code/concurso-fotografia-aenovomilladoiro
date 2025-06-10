import React, { useState, useEffect } from 'react';
import '../styles/components/PhotoCarousel.css';

const PhotoCarousel = () => {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarImagenes = async () => {
            try {
                const response = await fetch('/api/carrusel/imagenes');
                if (!response.ok) throw new Error('Error al cargar las imágenes');
                const data = await response.json();
                setImagenes(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        cargarImagenes();
    }, []);

    if (loading) return <div className="carousel-loading">Cargando imágenes...</div>;
    if (error) return <div className="carousel-error">Error al cargar las imágenes: {error}</div>;
    if (!imagenes.length) return <div className="carousel-empty">No hay imágenes en el carrusel.</div>;

    return (
        <div className="photo-carousel">
            {imagenes.map((img, idx) => (
                <div className="carousel-slide" key={idx}>
                    <img src={img.url} alt={img.nombre} className="carousel-image" />
                </div>
            ))}
        </div>
    );
};

export default PhotoCarousel; 