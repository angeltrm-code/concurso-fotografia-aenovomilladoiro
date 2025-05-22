import React from "react";

const Header = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm w-full">
    <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
      {/* Contenedor del logo */}
      <div className="flex items-center" id="header-logo-container">
        <a href="/" className="flex items-center">
          <img src="/LogoAENM.png" alt="Logo AE Novo Milladoiro" className="h-12 w-auto" />
        </a>
      </div>
      {/* Contenedor de los botones */}
      <div className="flex items-center" id="header-menu-container">
        <nav className="flex items-center gap-10">
          <a href="#" className="font-semibold text-[#2C415E] hover:text-[#FF5614] transition-colors">Inicio</a>
          <a href="#asociacion" className="font-semibold text-[#2C415E] hover:text-[#FF5614] transition-colors">Asociación</a>
          <a href="#contacto" className="font-semibold text-[#2C415E] hover:text-[#FF5614] transition-colors">Contacto</a>
        </nav>
      </div>
    </div>
  </header>
);

export default Header; 