import React from "react";
import "../styles/components/Footer.css";

// Componente Footer: pie de página independiente con fondo azul y logos institucionales centrados
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <img src="/Logos-AENMI-300x75.png" alt="Logo AE Novo Milladoiro" className="footer-logo" />
        <p className="footer-text">&copy; {new Date().getFullYear()} AE Novo Milladoiro. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer; 