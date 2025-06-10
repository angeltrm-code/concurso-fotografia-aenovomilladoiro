import React, { useState, useEffect } from 'react';
import '../styles/components/PhotoCarousel.css';

const API_URL = 'http://localhost:5000/api/carrusel';

const PhotoCarousel = () => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarImagenes = async () => {
            try {
                const response = await fetch(`${API_URL}/imagenes`);
                if (!response.ok) {
                    throw new Error('Error al cargar las imágenes');
                }
                const data = await response.json();
                setImages(data);
                setLoading(false);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        cargarImagenes();
    }, []);

    useEffect(() => {
        if (images.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => 
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [images]);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <div className="photo-carousel">
                <div className="carousel-loading">
                    Cargando imágenes...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="photo-carousel">
                <div className="carousel-error">
                    Error al cargar las imágenes: {error}
                </div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="photo-carousel">
                <div className="carousel-empty">
                    No hay imágenes disponibles en el carrusel.
                </div>
            </div>
        );
    }

    return (
        <div className="photo-carousel">
            <div className="carousel-container">
                <div className="carousel-slide">
                    <img
                        src={`http://localhost:5000${images[currentIndex].url}`}
                        alt={`Slide ${currentIndex + 1}`}
                        className="carousel-image"
                    />
                </div>
                <button
                    className="carousel-button prev"
                    onClick={handlePrev}
                    aria-label="Imagen anterior"
                >
                    ‹
                </button>
                <button
                    className="carousel-button next"
                    onClick={handleNext}
                    aria-label="Imagen siguiente"
                >
                    ›
                </button>
            </div>
            <div className="carousel-dots">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                        aria-label={`Ir a imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default PhotoCarousel; 