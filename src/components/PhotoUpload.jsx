import React, { useState } from "react";
import "../styles/components/PhotoUpload.css";

const OBLIGATORIO = <span style={{ color: '#e53e3e' }}>*</span>;

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    nifnie: "",
    direccion: "",
    titulo: "",
    descripcion: "",
    foto: null,
    autorizacion: null,
    persoasRecoñecibles: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, foto: "O arquivo non pode superar os 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, foto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.foto) {
        setErrors((prev) => ({ ...prev, foto: "" }));
      }
    }
  };

  const handleAutorizacionChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, autorizacion: file }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "O nome é obrigatorio";
    if (!formData.apellidos) newErrors.apellidos = "Os apelidos son obrigatorios";
    if (!formData.nifnie) newErrors.nifnie = "O NIF/NIE é obrigatorio";
    if (!formData.direccion) newErrors.direccion = "O enderezo é obrigatorio";
    if (!formData.email) newErrors.email = "O email é obrigatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "O email non é válido";
    if (!formData.telefono) newErrors.telefono = "O teléfono é obrigatorio";
    if (!formData.titulo) newErrors.titulo = "O título é obrigatorio";
    if (!formData.descripcion) newErrors.descripcion = "A descrición é obrigatoria";
    if (!formData.foto) newErrors.foto = "A imaxe é obrigatoria";
    if (formData.persoasRecoñecibles && !formData.autorizacion) newErrors.autorizacion = "Debes achegar a autorización";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSummary(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apelidos', formData.apellidos);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telefono', formData.telefono);
      formDataToSend.append('nif', formData.nifnie);
      formDataToSend.append('enderezo', formData.direccion);
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('foto', formData.foto);
      if (formData.autorizacion) {
        formDataToSend.append('autorizacion', formData.autorizacion);
      }

      const response = await fetch('http://localhost:3001/api/participar', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar o formulario');
      }

      alert("Formulario enviado con éxito!");
      setShowSummary(false);
      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        telefono: "",
        nifnie: "",
        direccion: "",
        titulo: "",
        descripcion: "",
        foto: null,
        autorizacion: null,
        persoasRecoñecibles: false,
      });
      setImagePreview(null);
    } catch (error) {
      alert(error.message || 'Erro ao enviar o formulario');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nueva función para eliminar la imagen
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, foto: null }));
    setImagePreview(null);
  };

  // Función para abrir la modal
  const openModal = () => setShowModal(true);

  // Función para cerrar la modal
  const closeModal = () => setShowModal(false);

  if (showSummary) {
    return (
      <div className="form-section">
        <div className="form-card">
          <h3 className="form-title">Confirma os teus datos</h3>
          <div style={{ width: '100%' }}>
            <div className="form-group"><b>Nome:</b> {formData.nombre}</div>
            <div className="form-group"><b>Apelidos:</b> {formData.apellidos}</div>
            <div className="form-group"><b>Email:</b> {formData.email}</div>
            <div className="form-group"><b>Teléfono:</b> {formData.telefono}</div>
            <div className="form-group"><b>NIF/NIE:</b> {formData.nifnie}</div>
            <div className="form-group"><b>Enderezo:</b> {formData.direccion}</div>
            <div className="form-group"><b>Título:</b> {formData.titulo}</div>
            <div className="form-group"><b>Descrición:</b> {formData.descripcion}</div>
            {imagePreview && (
              <div className="form-group">
                <b>Imaxe:</b><br />
                <img src={imagePreview} alt="Previsualización" style={{ maxHeight: 180, borderRadius: 12, margin: '1rem auto' }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: 24 }}>
            <button 
              onClick={() => setShowSummary(false)} 
              className="form-submit-btn" 
              style={{ background: '#e2e8f0', color: '#2C415E' }}
              disabled={isSubmitting}
            >
              Modificar
            </button>
            <button 
              onClick={handleConfirmSubmit} 
              className="form-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className="form-title">Formulario de participación</h2>
        <div className="form-group">
          <label className="form-label">Nome {OBLIGATORIO}</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" placeholder="O teu nome" />
          {errors.nombre && <div className="form-error">{errors.nombre}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Apelidos {OBLIGATORIO}</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="form-input" placeholder="Os teus apelidos" />
          {errors.apellidos && <div className="form-error">{errors.apellidos}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Email {OBLIGATORIO}</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="O teu email" />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono {OBLIGATORIO}</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="form-input" placeholder="O teu teléfono" />
          {errors.telefono && <div className="form-error">{errors.telefono}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">NIF/NIE {OBLIGATORIO}</label>
          <input type="text" name="nifnie" value={formData.nifnie} onChange={handleChange} className="form-input" placeholder="O teu NIF ou NIE" />
          {errors.nifnie && <div className="form-error">{errors.nifnie}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Enderezo {OBLIGATORIO}</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="form-input" placeholder="O teu enderezo" />
          {errors.direccion && <div className="form-error">{errors.direccion}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Título da imaxe {OBLIGATORIO}</label>
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} className="form-input" placeholder="Título para a túa fotografía" />
          {errors.titulo && <div className="form-error">{errors.titulo}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Descrición da imaxe {OBLIGATORIO}</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4" className="form-textarea" placeholder="Describe brevemente a túa fotografía"></textarea>
          {errors.descripcion && <div className="form-error">{errors.descripcion}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">¿Aparecen persoas recoñecibles na fotografía? {OBLIGATORIO}</label>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 4 }}>
            <label style={{ fontWeight: 500 }}>
              <input type="checkbox" name="persoasRecoñecibles" checked={formData.persoasRecoñecibles} onChange={handleChange} /> Si
            </label>
            <label style={{ fontWeight: 500 }}>
              <input type="checkbox" name="persoasRecoñecibles" checked={!formData.persoasRecoñecibles} onChange={() => setFormData((prev) => ({ ...prev, persoasRecoñecibles: false, autorizacion: null }))} /> Non
            </label>
          </div>
        </div>
        {formData.persoasRecoñecibles && (
          <div className="form-group">
            <label className="form-label">Autorización para persoas recoñecibles (PDF/JPG/PNG) {OBLIGATORIO}</label>
            <input type="file" name="autorizacion" accept=".pdf,image/jpeg,image/jpg,image/png" onChange={handleAutorizacionChange} className="form-input" />
            {errors.autorizacion && <div className="form-error">{errors.autorizacion}</div>}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Imaxe {OBLIGATORIO}</label>
          <div className="form-file-wrapper">
            <label className="form-file-label">
              <input
                type="file"
                name="foto"
                accept="image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="form-file-input"
              />
              <span className="form-file-text">Seleccionar imaxe</span>
            </label>
            {imagePreview && (
              <div className="form-group">
                <label className="form-label">Imaxe seleccionada:</label>
                <div className="image-preview-thumbnail" onClick={openModal}>
                  <img src={imagePreview} alt="Previsualización" className="thumbnail-image" />
                  <div className="remove-image-btn" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}>X</div>
                </div>
                {errors.foto && <div className="form-error">{errors.foto}</div>}
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img src={imagePreview} alt="Previsualización" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload; 