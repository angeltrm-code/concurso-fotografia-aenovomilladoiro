import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config/apiConfig';

const AdminBasesPDFPanel = ({ onPDFChange }) => {
  const [pdfExists, setPdfExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  const checkPDF = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_ENDPOINTS.BASES.BASE}/pdf`, { method: 'HEAD' });
      setPdfExists(res.status === 200);
      if (onPDFChange) onPDFChange(res.status === 200);
    } catch {
      setPdfExists(false);
      if (onPDFChange) onPDFChange(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkPDF(); }, []);

  const handleUpload = async (e) => {
    setError(null); setSuccess(null);
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setError('Selecciona un archivo PDF válido.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const res = await fetch(`${API_ENDPOINTS.BASES.BASE}/pdf`, {
        method: 'POST', body: formData
      });
      if (!res.ok) throw new Error('Error al subir el PDF');
      setSuccess('PDF subido correctamente.');
      checkPDF();
    } catch {
      setError('Error al subir el PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setError(null); setSuccess(null);
    if (!window.confirm('¿Seguro que deseas eliminar el PDF actual?')) return;
    try {
      const res = await fetch(`${API_ENDPOINTS.BASES.BASE}/pdf`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar el PDF');
      setSuccess('PDF eliminado correctamente.');
      checkPDF();
    } catch {
      setError('Error al eliminar el PDF.');
    }
  };

  return (
    <div className="admin-bases-pdf-panel card-separada">
      <h3 className="pdf-panel-title">Gestión del PDF de las Bases</h3>
      {loading ? <div>Cargando estado del PDF...</div> : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            {pdfExists ? (
              <span style={{ color: 'green', fontWeight: 600 }}>PDF disponible para descarga pública.</span>
            ) : (
              <span style={{ color: 'red', fontWeight: 600 }}>No hay PDF subido.</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input type="file" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
            <button onClick={handleDelete} disabled={!pdfExists || uploading} className="btn-eliminar">Eliminar PDF</button>
          </div>
        </>
      )}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default AdminBasesPDFPanel; 