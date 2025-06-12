import React, { useState, useEffect } from "react";
import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaTrophy, FaGavel, FaMapMarkerAlt, FaEnvelopeOpenText, FaBuilding, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaBook, FaStar, FaClipboardList, FaEdit, FaInfoCircle, FaLock, FaGlobe, FaUserShield, FaDownload } from "react-icons/fa";
import "../styles/components/BasesCertame.css";

const ICONS = {
  FaUsers: <FaUsers className="base-icon" color="#2C415E" size={32} />, FaCamera: <FaCamera className="base-icon" color="#2C415E" size={32} />, FaFileImage: <FaFileImage className="base-icon" color="#2C415E" size={32} />, FaCalendarAlt: <FaCalendarAlt className="base-icon" color="#2C415E" size={32} />, FaTrophy: <FaTrophy className="base-icon" color="#2C415E" size={32} />, FaGavel: <FaGavel className="base-icon" color="#2C415E" size={32} />, FaMapMarkerAlt: <FaMapMarkerAlt className="base-icon" color="#2C415E" size={32} />, FaEnvelopeOpenText: <FaEnvelopeOpenText className="base-icon" color="#2C415E" size={32} />, FaBuilding: <FaBuilding className="base-icon" color="#2C415E" size={32} />, FaLightbulb: <FaLightbulb className="base-icon" color="#2C415E" size={32} />, FaCheckCircle: <FaCheckCircle className="base-icon" color="#2C415E" size={32} />, FaExclamationTriangle: <FaExclamationTriangle className="base-icon" color="#2C415E" size={32} />, FaBook: <FaBook className="base-icon" color="#2C415E" size={32} />, FaStar: <FaStar className="base-icon" color="#2C415E" size={32} />, FaClipboardList: <FaClipboardList className="base-icon" color="#2C415E" size={32} />, FaEdit: <FaEdit className="base-icon" color="#2C415E" size={32} />, FaInfoCircle: <FaInfoCircle className="base-icon" color="#2C415E" size={32} />, FaLock: <FaLock className="base-icon" color="#2C415E" size={32} />, FaGlobe: <FaGlobe className="base-icon" color="#2C415E" size={32} />, FaUserShield: <FaUserShield className="base-icon" color="#2C415E" size={32} />
};

export default function BasesCertame() {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const response = await fetch('/api/bases');
        if (!response.ok) throw new Error('Error al cargar las bases');
        const data = await response.json();
        setBases(data);
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

  return (
    <section className="bases-section">
      <h2 className="base-title-section">Bases do Certame</h2>
      <div className="bases-btn-container">
        <a href="/api/bases/pdf" download="bases-concurso.pdf" className="download-button">
          <FaDownload /> Descargar PDF
        </a>
      </div>
      <div className="bases-cards-container">
        {bases.map((seccion) => (
          <div className="base-card" key={seccion.id}>
            {seccion.icon && ICONS[seccion.icon]}
            <h3 className="base-title">{seccion.titulo}</h3>
            <p className="base-text">{seccion.contido}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 