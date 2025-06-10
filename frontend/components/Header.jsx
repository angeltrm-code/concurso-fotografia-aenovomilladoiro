import React from "react";
import "../styles/components/Header.css";

// Componente Header: barra superior fija con logo y navegación principal
const Header = () => {
  // Función para manejar el scroll suave al inicio
  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo de la asociación */}
        <div className="header-logo">
          <a href="/">
            <img src="/LogoAENM-2025.png" alt="Logo AE Novo Milladoiro" />
          </a>
        </div>
        {/* Navegación principal */}
        <nav className="header-nav">
          <ul className="header-nav-list">
            <li><a href="#" className="header-nav-link" onClick={handleScrollToTop}>Inicio</a></li>
            <li><a href="/admin" className="header-nav-link">Área privada</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 