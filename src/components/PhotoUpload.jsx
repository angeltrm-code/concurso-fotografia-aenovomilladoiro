import React, { useState } from "react";

const OBLIGATORIO = <span className="text-red-500">*</span>;

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    empresa: "",
    titulo: "",
    descripcion: "",
    imagen: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empieza a escribir
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
      // Limpiar error cuando se sube una imagen válida
      if (errors.imagen) {
        setErrors((prev) => ({ ...prev, imagen: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "O nome é obrigatorio";
    if (!formData.apellidos) newErrors.apellidos = "Os apelidos son obrigatorios";
    if (!formData.email) newErrors.email = "O email é obrigatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "O email non é válido";
    if (!formData.telefono) newErrors.telefono = "O teléfono é obrigatorio";
    if (!formData.empresa) newErrors.empresa = "A empresa é obrigatoria";
    if (!formData.titulo) newErrors.titulo = "O título é obrigatorio";
    if (!formData.descripcion) newErrors.descripcion = "A descrición é obrigatoria";
    if (!formData.imagen) newErrors.imagen = "A imaxe é obrigatoria";
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
      empresa: "",
      titulo: "",
      descripcion: "",
      imagen: null,
    });
    setPreview(null);
  };

  if (showSummary) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/20">
        <h3 className="text-2xl font-bold text-[#2c415e] mb-6 text-center">Confirma os teus datos</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="mt-1">{formData.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Apelidos</p>
              <p className="mt-1">{formData.apellidos}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              <p className="mt-1">{formData.telefono}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Empresa</p>
              <p className="mt-1">{formData.empresa}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Título</p>
              <p className="mt-1">{formData.titulo}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Descrición</p>
            <p className="mt-1">{formData.descripcion}</p>
          </div>
          {preview && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Imaxe</p>
              <img src={preview} alt="Previsualización" className="rounded-lg shadow-md max-h-64 mx-auto" />
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowSummary(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Modificar
          </button>
          <button
            onClick={handleConfirmSubmit}
            className="px-4 py-2 bg-[#2c415e] text-white rounded-lg text-sm font-medium hover:bg-[#1e2d3f] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome {OBLIGATORIO}
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.nombre ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="O teu nome"
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apelidos {OBLIGATORIO}
          </label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.apellidos ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="Os teus apelidos"
          />
          {errors.apellidos && <p className="mt-1 text-xs text-red-500">{errors.apellidos}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email {OBLIGATORIO}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.email ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="O teu email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Teléfono {OBLIGATORIO}
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.telefono ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="O teu teléfono"
          />
          {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Empresa {OBLIGATORIO}
          </label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.empresa ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="Nome da empresa"
          />
          {errors.empresa && <p className="mt-1 text-xs text-red-500">{errors.empresa}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título da imaxe {OBLIGATORIO}
          </label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={`mt-1 w-full rounded-lg border ${
              errors.titulo ? 'border-red-300' : 'border-gray-300/50'
            } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
            placeholder="Título para a túa fotografía"
          />
          {errors.titulo && <p className="mt-1 text-xs text-red-500">{errors.titulo}</p>}
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Descrición da imaxe {OBLIGATORIO}
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="4"
          className={`mt-1 w-full rounded-lg border ${
            errors.descripcion ? 'border-red-300' : 'border-gray-300/50'
          } px-3 py-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-[#2c415e] focus:border-[#2c415e]`}
          placeholder="Describe brevemente a túa fotografía"
        ></textarea>
        {errors.descripcion && <p className="mt-1 text-xs text-red-500">{errors.descripcion}</p>}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">
          Imaxe {OBLIGATORIO}
        </label>
        <div className="mt-2">
          <div 
            className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
              errors.imagen ? 'border-red-300 bg-red-50/50' : 'border-gray-300/50 hover:border-[#2c415e]'
            } transition-colors cursor-pointer bg-white/50 backdrop-blur-sm`}
            onClick={() => document.querySelector('input[name="imagen"]').click()}
          >
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-[#2c415e] hover:text-[#1e2d3f] focus-within:outline-none">
                  <span>Sube unha imaxe</span>
                  <input
                    type="file"
                    name="imagen"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">ou arrastra e solta</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF ata 10MB</p>
            </div>
          </div>
        </div>
        {errors.imagen && <p className="mt-1 text-xs text-red-500">{errors.imagen}</p>}
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Previsualización" className="max-h-64 rounded-lg mx-auto" />
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 bg-[#2c415e] text-white rounded-lg text-sm font-medium hover:bg-[#1e2d3f] transition-colors"
        >
          <span>Enviar participación</span>
          <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default PhotoUpload; 