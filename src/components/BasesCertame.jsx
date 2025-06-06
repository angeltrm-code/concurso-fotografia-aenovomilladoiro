import React, { useState, useEffect } from "react";
import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaGavel, FaTrophy, FaMapMarkerAlt, FaEnvelopeOpenText } from "react-icons/fa";
import "../styles/components/BasesCertame.css";

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
  <FaMapMarkerAlt className="base-icon" />
];

export default function BasesCertame() {
  const [basesContenido, setBasesContenido] = useState([]);

  useEffect(() => {
    // Obtener contenido de localStorage o usar el texto por defecto
    const contenidoGuardado = localStorage.getItem('basesCertame') || BASES_DEFAULT;
    
    // Dividir el contenido en secciones
    const secciones = contenidoGuardado.split('\n\n').filter(seccion => seccion.trim());
    
    // Procesar cada sección
    const basesProcesadas = secciones.map((seccion, index) => {
      const lineas = seccion.split('\n');
      const titulo = lineas[0].trim();
      const descripcion = lineas.slice(1).map(line => line.trim()).join('\n');
      
      return {
        icono: iconos[index % iconos.length],
        titulo: titulo.replace(/^\d+\.\s*/, ''), // Eliminar números al inicio
        descripcion: descripcion
      };
    });

    setBasesContenido(basesProcesadas);
  }, []);

  return (
    <section className="bases-section">
      <h2 className="base-title-section">Bases do XI Certame de Fotografía</h2>
      <p className="base-intro-text">
        O obxectivo do certame é promover a creatividade e a visión positiva do Parque Empresarial do Milladoiro a través da fotografía. Consulta as bases completas para detalles legais, dereitos e condicións específicas.
      </p>
      <div className="bases-cards-container">
        {basesContenido.map((base, idx) => (
          <div className="base-card" key={idx}>
            {base.icono}
            <h3 className="base-title">{base.titulo}</h3>
            <p className="base-text">{base.descripcion}</p>
          </div>
        ))}
      </div>
      <div className="bases-btn-container">
        <a
          href="/Bases.%20Cert%20F.%20XI.pdf"
          download
          className="download-button"
        >
          Descargar bases completas
        </a>
      </div>
    </section>
  );
} 