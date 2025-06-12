import React, { useState, useEffect } from "react";
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
    dataNacemento: "",
    autorizacionTutor: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [codigoRexistro, setCodigoRexistro] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [charCounts, setCharCounts] = useState({
    titulo: 0,
    descripcion: 0
  });

  // Validación en tiempo real
  useEffect(() => {
    const newErrors = {};
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "O email non é válido";
    }
    if (formData.telefono && !/^[0-9]{9}$/.test(formData.telefono)) {
      newErrors.telefono = "O teléfono debe ter 9 díxitos";
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [formData.email, formData.telefono]);

  // Actualizar contadores de caracteres
  useEffect(() => {
    setCharCounts({
      titulo: formData.titulo.length,
      descripcion: formData.descripcion.length
    });
  }, [formData.titulo, formData.descripcion]);

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

  const handleDataNacementoChange = (e) => {
    setFormData((prev) => ({ ...prev, dataNacemento: e.target.value }));
    if (errors.dataNacemento) {
      setErrors((prev) => ({ ...prev, dataNacemento: "" }));
    }
  };

  const handleAutorizacionTutorChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, autorizacionTutor: file }));
  };

  function calcularIdade(fecha) {
    if (!fecha) return null;
    const hoy = new Date();
    const nac = new Date(fecha);
    let idade = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
      idade--;
    }
    return idade;
  }

  const idade = calcularIdade(formData.dataNacemento);

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
    if (!formData.dataNacemento) newErrors.dataNacemento = "A data de nacemento é obrigatoria";
    if (idade !== null && idade < 18 && !formData.autorizacionTutor) {
      newErrors.autorizacionTutor = "Se a persoa participante é menor de idade, debe achegar unha autorización asinada polo/a titor/a legal.";
    }
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
      formDataToSend.append('dataNacemento', formData.dataNacemento);
      if (formData.autorizacionTutor) {
        formDataToSend.append('autorizacionTutor', formData.autorizacionTutor);
      }

      const response = await fetch('http://localhost:3001/api/participar', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar o formulario');
      }

      setCodigoRexistro(data.codigo);
      setSuccessMessage(data.message);
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
        dataNacemento: "",
        autorizacionTutor: null,
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

  // Componente de breadcrumb
  const Breadcrumb = () => (
    <nav className="breadcrumb" aria-label="Navegación">
      <div className="breadcrumb-item">
        <a href="/" className="breadcrumb-link">Inicio</a>
      </div>
      <div className="breadcrumb-item">
        <span>Participar</span>
      </div>
    </nav>
  );

  // Componente de modal de imagen
  const ImageModal = () => (
    <div className="image-modal" onClick={closeModal}>
      <div className="image-modal-content" onClick={e => e.stopPropagation()}>
        <button className="image-modal-close" onClick={closeModal} aria-label="Cerrar">×</button>
        <img src={imagePreview} alt="Vista previa de la imagen" />
      </div>
    </div>
  );

  if (showSummary) {
    return (
      <div className="form-section">
        <Breadcrumb />
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
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Previsualización" className="image-preview" />
                </div>
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

  if (successMessage && codigoRexistro) {
    return (
      <div className="form-section">
        <Breadcrumb />
        <div className="form-card success-message">
          <h2>Participación enviada</h2>
          <div>{successMessage}</div>
          <div className="code">{codigoRexistro}</div>
          <button 
            className="form-submit-btn" 
            onClick={() => { 
              setCodigoRexistro(null); 
              setSuccessMessage(""); 
            }}
          >
            Nova participación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <Breadcrumb />
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className="form-title">Formulario de participación</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="nombre">Nome {OBLIGATORIO}</label>
          <input 
            type="text" 
            id="nombre"
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="O teu nome"
            aria-required="true"
          />
          {errors.nombre && <div className="form-error" role="alert">{errors.nombre}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="apellidos">Apelidos {OBLIGATORIO}</label>
          <input 
            type="text" 
            id="apellidos"
            name="apellidos" 
            value={formData.apellidos} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="Os teus apelidos"
            aria-required="true"
          />
          {errors.apellidos && <div className="form-error" role="alert">{errors.apellidos}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email {OBLIGATORIO}</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="O teu email"
            aria-required="true"
          />
          {errors.email && <div className="form-error" role="alert">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="telefono">Teléfono {OBLIGATORIO}</label>
          <input 
            type="tel" 
            id="telefono"
            name="telefono" 
            value={formData.telefono} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="O teu teléfono"
            aria-required="true"
          />
          {errors.telefono && <div className="form-error" role="alert">{errors.telefono}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="nifnie">NIF/NIE {OBLIGATORIO}</label>
          <input 
            type="text" 
            id="nifnie"
            name="nifnie" 
            value={formData.nifnie} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="O teu NIF ou NIE"
            aria-required="true"
          />
          {errors.nifnie && <div className="form-error" role="alert">{errors.nifnie}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="direccion">Enderezo {OBLIGATORIO}</label>
          <input 
            type="text" 
            id="direccion"
            name="direccion" 
            value={formData.direccion} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="O teu enderezo"
            aria-required="true"
          />
          {errors.direccion && <div className="form-error" role="alert">{errors.direccion}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="titulo">Título {OBLIGATORIO}</label>
          <input 
            type="text" 
            id="titulo"
            name="titulo" 
            value={formData.titulo} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="Título da fotografía"
            maxLength={100}
            aria-required="true"
          />
          <div className={`char-counter ${charCounts.titulo > 80 ? 'warning' : ''}`}>
            {charCounts.titulo}/100
          </div>
          {errors.titulo && <div className="form-error" role="alert">{errors.titulo}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="descripcion">Descrición {OBLIGATORIO}</label>
          <textarea 
            id="descripcion"
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleChange} 
            className="form-input" 
            placeholder="Descrición da fotografía"
            maxLength={500}
            rows={4}
            aria-required="true"
          />
          <div className={`char-counter ${charCounts.descripcion > 400 ? 'warning' : ''}`}>
            {charCounts.descripcion}/500
          </div>
          {errors.descripcion && <div className="form-error" role="alert">{errors.descripcion}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">¿Aparecen persoas recoñecibles na fotografía? {OBLIGATORIO}</label>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 4 }}>
            <label style={{ fontWeight: 500 }}>
              <input 
                type="checkbox" 
                name="persoasRecoñecibles" 
                checked={formData.persoasRecoñecibles} 
                onChange={handleChange}
                aria-label="Si aparecen persoas recoñecibles"
              /> Si
            </label>
            <label style={{ fontWeight: 500 }}>
              <input 
                type="checkbox" 
                name="persoasRecoñecibles" 
                checked={!formData.persoasRecoñecibles} 
                onChange={() => setFormData((prev) => ({ ...prev, persoasRecoñecibles: false, autorizacion: null }))}
                aria-label="Non aparecen persoas recoñecibles"
              /> Non
            </label>
          </div>
        </div>

        {formData.persoasRecoñecibles && (
          <div className="form-group">
            <label className="form-label" htmlFor="autorizacion">
              Autorización para persoas recoñecibles (PDF/JPG/PNG) {OBLIGATORIO}
            </label>
            <input 
              type="file" 
              id="autorizacion"
              name="autorizacion" 
              accept=".pdf,image/jpeg,image/jpg,image/png" 
              onChange={handleAutorizacionChange} 
              className="form-input"
              aria-required="true"
            />
            {errors.autorizacion && <div className="form-error" role="alert">{errors.autorizacion}</div>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="dataNacemento">Data de nacemento {OBLIGATORIO}</label>
          <input 
            type="date" 
            id="dataNacemento"
            name="dataNacemento" 
            value={formData.dataNacemento} 
            onChange={handleDataNacementoChange} 
            className="form-input" 
            max={new Date().toISOString().split('T')[0]}
            aria-required="true"
          />
          {errors.dataNacemento && <div className="form-error" role="alert">{errors.dataNacemento}</div>}
        </div>

        {idade !== null && idade < 18 && (
          <div className="form-group">
            <label className="form-label" htmlFor="autorizacionTutor">
              Autorización do/a titor/a legal (PDF/JPG/PNG) {OBLIGATORIO}
            </label>
            <input 
              type="file" 
              id="autorizacionTutor"
              name="autorizacionTutor" 
              accept=".pdf,image/jpeg,image/jpg,image/png" 
              onChange={handleAutorizacionTutorChange} 
              className="form-input"
              aria-required="true"
            />
            <div className="form-info" style={{ color: '#2C415E', fontSize: '0.98rem', marginTop: 4 }}>
              Se a persoa participante é menor de idade, debe achegar unha autorización asinada polo/a titor/a legal.
            </div>
            {errors.autorizacionTutor && <div className="form-error" role="alert">{errors.autorizacionTutor}</div>}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="foto">Imaxe {OBLIGATORIO}</label>
          <div className="form-file-wrapper">
            <label className="form-file-label">
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/jpeg,image/jpg"
                onChange={handleImageChange}
                className="form-file-input"
                aria-required="true"
              />
              <span className="form-file-text">Seleccionar imaxe</span>
            </label>
            {imagePreview && (
              <div className="form-group">
                <label className="form-label">Imaxe seleccionada:</label>
                <div className="image-preview-container" onClick={openModal}>
                  <img src={imagePreview} alt="Previsualización" className="image-preview" />
                  <button 
                    className="remove-image-btn" 
                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                    aria-label="Eliminar imaxe"
                  >
                    ×
                  </button>
                </div>
                {errors.foto && <div className="form-error" role="alert">{errors.foto}</div>}
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="form-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar participación'}
        </button>
      </form>

      {showModal && <ImageModal />}
    </div>
  );
};

export default PhotoUpload; 