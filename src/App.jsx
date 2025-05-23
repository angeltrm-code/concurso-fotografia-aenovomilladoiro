import { useState, useEffect } from "react";
import PhotoUpload from "./components/PhotoUpload";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import BasesCertame from "./components/BasesCertame";
import Footer from "./components/Footer";

// Componente principal de la aplicación
// Estructura: Header fijo, contenido principal (carrusel, bases, formulario), Footer independiente
const images = [
  "/slide1.jpg",
  "/slide2.jpg",
  "/slide3.jpg",
  "/slide4.jpg",
  "/slide5.jpg",
  "/slide6.jpg"
];

function App() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Rotación automática de imágenes del carrusel
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Contenedor principal: fondo degradado y fuente personalizada */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-montserrat">
        {/* Header fijo en la parte superior */}
        <Header />
        {/* Contenido principal */}
        <main className="flex-1 pt-32 md:pt-36">
          {/* Carrusel de fotos */}
          <section className="carousel-section">
            <PhotoCarousel />
          </section>
          {/* Sección de bases del certamen */}
          <BasesCertame />
          {/* Formulario de participación */}
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 py-16">
              {/* Descripción y formulario */}
              <section className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2c415e]/10 to-[#2c415e]/5 rounded-3xl transform -skew-y-2"></div>
                <div className="relative">
                  <div className="max-w-xl mx-auto">
                    <PhotoUpload />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      {/* Footer independiente fuera del contenedor principal */}
      <Footer />
    </>
  );
}

export default App;
