import React from "react";

const bases = [
  "Poderán participar todas as empresas asociadas á AE Novo Milladoiro.",
  "As fotografías deberán reflectir a actividade comercial e empresarial do Parque Empresarial do Milladoiro.",
  "Imaxes en alta resolución, formato JPG/JPEG.",
  "Prazo: do 10 de outubro ao 9 de novembro de 2025."
];

const TarjetaBases = () => (
  <section className="max-w-3xl mx-auto my-12 px-6 py-8 bg-white border-2 border-[#2C415E] rounded-2xl shadow-xl relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    {/* Detalle superior naranja */}
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-2 rounded-full bg-[#FF5614] shadow-md"></div>
    <h3 className="text-2xl md:text-3xl font-extrabold text-[#2C415E] text-center mb-6 tracking-tight">Bases do XI Certame de Fotografía</h3>
    <ul className="space-y-4 mb-8">
      {bases.map((base, idx) => (
        <li key={idx} className="flex items-start gap-3 text-lg text-[#232323] font-medium">
          <span className="mt-1 w-3 h-3 rounded-full bg-[#FF5614] flex-shrink-0 shadow"></span>
          <span>{base}</span>
        </li>
      ))}
    </ul>
    <div className="flex justify-center">
      <a
        href="/Bases.%20Cert%20F.%20XI.pdf"
        download
        className="inline-flex items-center gap-2 bg-[#FF5614] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Descargar bases completas
      </a>
    </div>
  </section>
);

export default TarjetaBases; 