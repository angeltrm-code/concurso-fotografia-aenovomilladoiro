import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import '../styles/components/PhotoCarousel.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
        const imgs = Array.isArray(data) ? data : data.imagenes;
        setImagenes(imgs || []);
      } catch (err) {
        setError('Non se puideron cargar as imaxes.');
      } finally {
        setLoading(false);
      }
    };
    cargarImagenes();
  }, []);

  const renderContent = () => {
    if (loading) return 'Cargando imaxes...';
    if (error) return error;
    if (!imagenes.length) return 'Non hai imaxes no carrusel.';
    return null;
  };

  const statusMessage = renderContent();

  return (
    <div className="w-full bg-[#2C415E] pt-24 pb-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" style={{
        background: 'linear-gradient(to right, #2C415E, transparent 15%, transparent 65%, #2C415E)',
      }} />
      <div className="max-w-7xl mx-auto relative z-20">
        {statusMessage ? (
          <div className="text-center text-white text-lg font-montserrat">{statusMessage}</div>
        ) : (
          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            speed={2500}
            coverflowEffect={{
              rotate: 50,
              stretch: -50,
              depth: 250,
              modifier: 1,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="mySwiper"
          >
            {imagenes.map((img, idx) => {
              const nombre = typeof img === 'string' ? img : img.nombre;
              const url = typeof img === 'string' ? `/carrusel/${img}` : img.url;
              return (
                <SwiperSlide key={nombre} className="flex justify-center items-center">
                  <img
                    src={API_BASE_URL + url}
                    alt={nombre}
                    className="rounded-2xl transition-all duration-1000 ease-in-out"
                    style={{
                      width: '100%',
                      maxWidth: 1000,
                      height: 700,
                      objectFit: 'cover',
                      filter: 'drop-shadow(0 15px 60px rgba(0, 0, 0, 0.25))',
                    }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default PhotoCarousel;
