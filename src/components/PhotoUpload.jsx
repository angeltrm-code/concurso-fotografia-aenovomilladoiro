import React, { useState } from "react";

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
    imagen: null,
    autorizacion: null,
    persoasRecoñecibles: false,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

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
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, imagen: "O arquivo non pode superar os 10MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      if (errors.imagen) {
        setErrors((prev) => ({ ...prev, imagen: "" }));
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
    if (!formData.imagen) newErrors.imagen = "A imaxe é obrigatoria";
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

  const handleConfirmSubmit = () => {
    console.log("Datos enviados:", formData);
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
      imagen: null,
      autorizacion: null,
      persoasRecoñecibles: false,
    });
    setPreview(null);
  };

  // Nueva función para eliminar la imagen
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imagen: null }));
    setPreview(null);
  };

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
            {preview && (
              <div className="form-group">
                <b>Imaxe:</b><br />
                <img src={preview} alt="Previsualización" style={{ maxHeight: 180, borderRadius: 12, margin: '1rem auto' }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => setShowSummary(false)} className="form-submit-btn" style={{ background: '#e2e8f0', color: '#2C415E' }}>Modificar</button>
            <button onClick={handleConfirmSubmit} className="form-submit-btn">Confirmar</button>
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
              Seleccionar arquivo
              <input
                type="file"
                name="imagen"
                onChange={handleImageChange}
                accept="image/*"
                className="form-file-input"
              />
            </label>
            <span className="form-file-name">
              {formData.imagen ? formData.imagen.name : "Ningún arquivo seleccionado"}
            </span>
          </div>
          {errors.imagen && <div className="form-error">{errors.imagen}</div>}
          {preview && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={preview} alt="Previsualización" style={{ maxHeight: 180, borderRadius: 12, margin: '0 auto', boxShadow: '0 2px 8px 0 rgba(44,65,94,0.10)' }} />
              <button
                type="button"
                onClick={handleRemoveImage}
                style={{
                  marginTop: 16,
                  background: '#e53e3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '0.6rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(44,65,94,0.10)',
                  transition: 'background 0.2s',
                  outline: 'none',
                  display: 'block',
                }}
              >
                Eliminar imaxe
              </button>
            </div>
          )}
          <div style={{ color: '#2C415E', fontWeight: 500, marginTop: 10, textAlign: 'center', fontSize: '0.98rem' }}>
            O nome do arquivo da imaxe debe coincidir co título da fotografía.
          </div>
        </div>
        <button type="submit" className="form-submit-btn">Enviar participación</button>
      </form>
    </div>
  );
};

export default PhotoUpload; 