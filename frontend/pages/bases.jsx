import React from 'react';
import '../styles/pages/bases.css';
import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaTrophy, FaGavel, FaMapMarkerAlt, FaEnvelopeOpenText, FaBuilding, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaBook, FaStar, FaClipboardList, FaEdit, FaInfoCircle, FaLock, FaGlobe, FaUserShield } from 'react-icons/fa';

const ICONS = {
  FaUsers: <FaUsers color="#2C415E" size={32} />, FaCamera: <FaCamera color="#2C415E" size={32} />, FaFileImage: <FaFileImage color="#2C415E" size={32} />, FaCalendarAlt: <FaCalendarAlt color="#2C415E" size={32} />, FaTrophy: <FaTrophy color="#2C415E" size={32} />, FaGavel: <FaGavel color="#2C415E" size={32} />, FaMapMarkerAlt: <FaMapMarkerAlt color="#2C415E" size={32} />, FaEnvelopeOpenText: <FaEnvelopeOpenText color="#2C415E" size={32} />, FaBuilding: <FaBuilding color="#2C415E" size={32} />, FaLightbulb: <FaLightbulb color="#2C415E" size={32} />, FaCheckCircle: <FaCheckCircle color="#2C415E" size={32} />, FaExclamationTriangle: <FaExclamationTriangle color="#2C415E" size={32} />, FaBook: <FaBook color="#2C415E" size={32} />, FaStar: <FaStar color="#2C415E" size={32} />, FaClipboardList: <FaClipboardList color="#2C415E" size={32} />, FaEdit: <FaEdit color="#2C415E" size={32} />, FaInfoCircle: <FaInfoCircle color="#2C415E" size={32} />, FaLock: <FaLock color="#2C415E" size={32} />, FaGlobe: <FaGlobe color="#2C415E" size={32} />, FaUserShield: <FaUserShield color="#2C415E" size={32} />
};

const Bases = ({ bases }) => {
  return (
    <div className="bases-grid">
      {bases.map(base => (
        <div key={base.id} className="base-card">
          {base.icon && (
            <div className="base-icon" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              {ICONS[base.icon]}
            </div>
          )}
          <h3 className="base-title">{base.titulo}</h3>
          <div className="base-content">{base.contido}</div>
        </div>
      ))}
    </div>
  );
};

export default Bases; 