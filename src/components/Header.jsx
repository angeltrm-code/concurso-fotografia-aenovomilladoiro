import React from "react";
import "../App.css";

// Componente Header: barra superior fija con logo y navegación principal
const Header = () => (
  <header className="header">
    <div className="header-container">
      {/* Logo de la asociación */}
      <div className="header-logo">
        <a href="/">
          <img src="/LogoAENM.png" alt="Logo AE Novo Milladoiro" />
        </a>
      </div>
      {/* Navegación principal */}
      <nav className="header-nav">
        <ul className="header-nav-list">
          <li><a href="#" className="header-nav-link">Inicio</a></li>
          <li><a href="#asociacion" className="header-nav-link">Asociación</a></li>
          <li><a href="#contacto" className="header-nav-link">Contacto</a></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header; 