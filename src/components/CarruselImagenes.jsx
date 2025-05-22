import React, { useState, useEffect } from "react";

const CarruselImagenes = ({ imagenes }) => {
  const [actual, setActual] = useState(0);
  const total = imagenes.length;

  // Cambio automático cada 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const irA = (idx) => setActual(idx);
  const anterior = () => setActual((prev) => (prev - 1 + total) % total);
  const siguiente = () => setActual((prev) => (prev + 1) % total);

  return (
    <div className="relative max-w-6xl mx-auto px-4 select-none group">
      <div className="overflow-hidden rounded-xl shadow-md h-[320px] md:h-[500px] bg-gray-200">
        {imagenes.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              idx === actual ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            draggable={false}
          />
        ))}
        {/* Overlay degradado para posible texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent rounded-xl pointer-events-none"></div>
      </div>
      {/* Flechas navegación */}
      <button
        onClick={anterior}
        className="hidden md:flex absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C415E] shadow-lg rounded-full p-2 transition-all border border-gray-200 group-hover:flex z-20"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={siguiente}
        className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2C415E] shadow-lg rounded-full p-2 transition-all border border-gray-200 group-hover:flex z-20"
        aria-label="Siguiente"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {imagenes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => irA(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
              idx === actual ? "bg-[#FF5614] scale-125 shadow-lg" : "bg-white/70 hover:bg-[#FF5614]/70"
            }`}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarruselImagenes; 