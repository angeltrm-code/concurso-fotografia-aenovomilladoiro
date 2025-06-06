import React from "react";
import "../styles/components/Footer.css";

// Componente Footer: pie de página independiente con fondo azul y logos institucionales centrados
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      {/* Logos institucionales */}
      <img src="/Logos-AENMI-300x75.png" alt="Logos institucionais" className="footer-logo" />
    </div>
  </footer>
);

export default Footer; 