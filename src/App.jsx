import { useState, useEffect } from "react";
import PhotoUpload from "./components/PhotoUpload";

const images = [
  "/slide1.jpg",
  "/slide2.jpg",
  "/slide3.jpg",
  "/slide4.jpg"
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
      {/* Hero section con carrusel y header superpuesto */}
      <div className="relative bg-gray-900">
        {/* Header superpuesto */}
        <header className="absolute top-0 left-0 right-0 z-50 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img src="/LogoAENM.png" alt="AEPEM" className="h-12" />
                <span className="text-xl font-bold ml-2 text-white">
                  AEPEM
                </span>
              </a>

              <nav className="hidden md:flex items-center space-x-1">
                <a 
                  href="https://aenovomilladoiro.com/noticias" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Noticias
                </a>
                <a 
                  href="https://aenovomilladoiro.com/directorio" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Directorio
                </a>
                <a 
                  href="https://aenovomilladoiro.com/axudas" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Axudas
                </a>
                <a 
                  href="https://aenovomilladoiro.com/servizos" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Servizos
                </a>
                <a 
                  href="https://aenovomilladoiro.com/hazte-socio" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Hazte Socio
                </a>
                <a 
                  href="https://aenovomilladoiro.com/contacto" 
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Contacto
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Carrusel */}
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden">
            <div className="relative h-[600px]">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImage ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-4xl mx-auto px-4 w-full">
                  <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                      XI Certame de Fotografía Comercial AE Novo Milladoiro
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200">
                      Captura a esencia do noso parque empresarial
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* Contenido principal */}
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
