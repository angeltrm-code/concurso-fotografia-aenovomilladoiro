import React, { useState, useEffect } from "react";
import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaTrophy, FaGavel, FaMapMarkerAlt, FaEnvelopeOpenText, FaDownload } from "react-icons/fa";
import "../styles/components/BasesCertame.css";

const API_URL = 'http://localhost:5000/api/bases';

// Texto por defecto si no hay contenido en localStorage
const BASES_DEFAULT = `BASES DO CERTAME FOTOGRÁFICO 2025

1. PARTICIPANTES
   - Podrán participar todas las personas mayores de 18 años.
   - Cada participante podrá presentar un máximo de 2 fotografías.

2. TEMA
   - El tema será libre.
   - Las fotografías deberán ser inéditas y no haber sido premiadas en otros concursos.

3. FORMATO
   - Las fotografías se presentarán en formato digital.
   - Resolución mínima: 3000x2000 píxeles.
   - Formato: JPG o PNG.

4. PLAZO
   - El plazo de presentación finalizará el 30 de abril de 2025.

5. PREMIOS
   - Primer premio: 300€
   - Segundo premio: 200€
   - Tercer premio: 100€

6. JURADO
   - El jurado estará compuesto por profesionales de la fotografía.
   - Su decisión será inapelable.

7. EXPOSICIÓN
   - Las fotografías premiadas serán expuestas en la sede de la asociación.
   - Se publicarán en la web y redes sociales.`;

// Array de iconos para cada sección
const iconos = [
  <FaUsers className="base-icon" />,
  <FaCamera className="base-icon" />,
  <FaFileImage className="base-icon" />,
  <FaCalendarAlt className="base-icon" />,
  <FaTrophy className="base-icon" />,
  <FaGavel className="base-icon" />,
  <FaMapMarkerAlt className="base-icon" />,
  <FaEnvelopeOpenText className="base-icon" />
];

export default function BasesCertame() {
  const [bases, setBases] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await fetch('/api/bases');
        if (!response.ok) throw new Error('Error al cargar las bases');
        const data = await response.json();
        setBases(data.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBases();
  }, []);

  if (loading) return <div>Cargando bases...</div>;
  if (error) return <div>Error: {error}</div>;

  // Dividir las bases en secciones por doble salto de línea
  const secciones = bases.split(/\n\n+/).filter(Boolean);

  return (
    <section className="bases-section">
      <h2 className="base-title-section">Bases do Certame</h2>
      <div className="bases-btn-container">
        <a href="/api/bases/pdf" download="bases-concurso.pdf" className="download-button">
          <FaDownload /> Descargar PDF
        </a>
      </div>
      <div className="bases-cards-container">
        {secciones.map((seccion, idx) => {
          // Primer salto de línea separa título y contenido
          const [titulo, ...resto] = seccion.split('\n');
          const descripcion = resto.join('\n');
          return (
            <div className="base-card" key={idx}>
              {iconos[idx % iconos.length]}
              <h3 className="base-title">{titulo.replace(/^\d+\.\s*/, "")}</h3>
              <p className="base-text">{descripcion}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
} 