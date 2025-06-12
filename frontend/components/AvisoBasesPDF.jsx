import React from "react";
import "../styles/components/BasesCertame.css";

const AvisoBasesPDF = () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  if (!backendURL) {
    console.warn(
      "[AvisoBasesPDF] ⚠️ No se ha definido VITE_BACKEND_URL. Usando http://localhost:3000 como fallback."
    );
  }

  const pdfURL = `${backendURL || "http://localhost:3000"}/bases.pdf`;

  return (
    <div className="aviso-bases">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>⚠️</span>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#92400E' }}>
          Atención: Consulta as bases completas do certame
        </span>
      </div>
      <div style={{ color: '#78350F', marginBottom: 14 }}>
        A seguinte información é un resumo. Para evitar malentendidos ou erros na túa participación, descarga e revisa o PDF oficial coas bases completas do concurso.
      </div>
      <a
        href={pdfURL}
        target="_blank"
        rel="noopener noreferrer"
        className="aviso-bases-btn"
      >
        Descargar bases en PDF
      </a>
    </div>
  );
};

export default AvisoBasesPDF;
