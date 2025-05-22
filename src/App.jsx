import { useState, useEffect } from "react";
import PhotoUpload from "./components/PhotoUpload";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import TarjetaBases from "./components/TarjetaBases";

const images = [
  "/slide1.jpg",
  "/slide2.jpg",
  "/slide3.jpg",
  "/slide4.jpg",
  "/slide5.jpg",
  "/slide6.jpg"
];

const basesDelConcurso = [
  {
    title: "Participantes",
    description: "Poderán participar todas as empresas asociadas á AE Novo Milladoiro"
  },
  {
    title: "Temática",
    description: "As fotografías deberán reflectir a actividade comercial e empresarial do Parque Empresarial do Milladoiro"
  },
  {
    title: "Formato",
    description: "Imaxes en alta resolución, formato JPG/JPEG"
  },
  {
    title: "Prazo",
    description: "Do 10 de outubro ao 9 de novembro de 2025"
  }
];

function App() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-montserrat">
      <Header />
      <main className="flex-1 pt-8 md:pt-12">
        <PhotoCarousel />
        <TarjetaBases />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Descripción */}
            <section className="mb-16">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-lg text-gray-700">
                  O obxectivo deste certame é promover a creatividade e visibilizar a actividade comercial do Parque Empresarial do Milladoiro a través da fotografía. Cada participante poderá presentar unha única imaxe que reflicta a vida e dinamismo do noso entorno empresarial.
                </p>
              </div>
            </section>

            {/* Bases del concurso */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-[#2c415e] text-center mb-8">Bases do concurso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {basesDelConcurso.map((base, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-white/20">
                    <h3 className="text-lg font-semibold text-[#2c415e] mb-2">{base.title}</h3>
                    <p className="text-gray-600 text-sm">{base.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <a
                  href="/Bases. Cert F. XI.pdf"
                  download
                  className="inline-flex items-center px-5 py-2.5 bg-[#2c415e] text-white rounded-lg font-medium hover:bg-[#1e2d3f] transition-colors text-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar bases completas
                </a>
              </div>
            </section>

            {/* Formulario */}
            <section className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2c415e]/10 to-[#2c415e]/5 rounded-3xl transform -skew-y-2"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold text-[#2c415e] text-center mb-8">Formulario de participación</h2>
                <div className="max-w-xl mx-auto">
                  <PhotoUpload />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-[#2c415e] py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <img src="/Logos-AENMI-300x75.png" alt="Logos institucionales" className="h-16" />
        </div>
      </footer>
    </div>
  );
}

export default App;
