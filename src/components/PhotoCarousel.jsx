import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

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
  <section className="w-full pt-12 pb-8 md:pb-16 bg-neutral-100 text-center">
    <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C415E] mb-8 tracking-tight drop-shadow-sm">Galería de inspiración</h2>
    <div className="max-w-7xl mx-auto px-8">
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
        className="mySwiper mx-auto"
        style={{ minHeight: 650 }}
      >
        {imagenes.map((img, idx) => (
          <SwiperSlide key={idx} className="flex justify-center items-center max-w-[900px]">
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className="rounded-2xl shadow-2xl transition-transform duration-700 w-full h-full max-w-[850px] max-h-[650px] object-cover hover:scale-105 hover:brightness-110"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default PhotoCarousel; 