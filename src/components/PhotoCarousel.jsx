import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import '../styles/components/PhotoCarousel.css';

const imagenes = [
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

const PhotoCarousel = () => (
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
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default PhotoCarousel; 