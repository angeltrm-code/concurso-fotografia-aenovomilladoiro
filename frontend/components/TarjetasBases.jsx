import React from "react";
import "../styles/components/BasesCertame.css";

const TarjetasBases = ({ secciones }) => (
  <div className="tarjetas-grid">
    {secciones.map((seccion, idx) => (
      <div
        className="tarjeta-base"
        key={idx}
        style={{ animationDelay: `${idx * 100}ms` }}
      >
        <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#2C415E', marginBottom: 10 }}>
          {seccion.titulo}
        </div>
        <div style={{ color: '#222', fontSize: '1rem', lineHeight: 1.6 }}>
          {seccion.contido}
        </div>
      </div>
    ))}
  </div>
);

export default TarjetasBases; 