import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import '../styles/components/PhotoCarousel.css';

// Imágenes por defecto
const IMAGENES_DEFAULT = [
    '/slide1.jpg',
    '/slide2.jpg',
    '/slide3.jpg',
    '/slide4.jpg',
    '/slide5.jpg',
    '/slide6.jpg',
    '/slide7.jpg',
    '/slide8.jpeg',
    '/slide9.jpg',
    '/slide10.jpg',
];

const PhotoCarousel = () => {
    const [imagenes, setImagenes] = useState(IMAGENES_DEFAULT);

    useEffect(() => {
        // Intentar obtener las imágenes del localStorage
        const imagenesGuardadas = localStorage.getItem('carruselImages');
        
        if (imagenesGuardadas) {
            try {
                const imagenesArray = JSON.parse(imagenesGuardadas);
                // Solo actualizar si hay imágenes válidas
                if (Array.isArray(imagenesArray) && imagenesArray.length > 0) {
                    setImagenes(imagenesArray);
                }
            } catch (error) {
                console.error('Error al cargar las imágenes del carrusel:', error);
                // Si hay error, mantener las imágenes por defecto
                setImagenes(IMAGENES_DEFAULT);
            }
        }
    }, []);

    return (
        <section className="photo-carousel">
            <h2 className="photo-carousel-title">Galería de inspiración</h2>
            <div className="photo-carousel-container">
                <Swiper
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    loop={true}
                    speed={3000}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    coverflowEffect={{
                        rotate: 45,
                        stretch: 0,
                        depth: 300,
                        modifier: 3,
                        slideShadows: true,
                    }}
                    modules={[EffectCoverflow, Autoplay]}
                    className="photo-carousel-swiper"
                    style={{ minHeight: 650 }}
                >
                    {imagenes.map((img, idx) => (
                        <SwiperSlide key={idx} className="photo-carousel-slide">
                            <img
                                src={img}
                                alt={`Slide ${idx + 1}`}
                                className="photo-carousel-image"
                                draggable={false}
                                onError={(e) => {
                                    // Si la imagen falla al cargar, mostrar una imagen por defecto
                                    e.target.src = IMAGENES_DEFAULT[0];
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default PhotoCarousel; 