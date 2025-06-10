import React, { useState } from "react";

// Componente de formulario para participar en el certamen de fotografía
const FormularioParticipacion = () => {
  const [form, setForm] = useState({ nombre: "", email: "", titulo: "", foto: null });
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio en el input de archivo
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, foto: e.target.files[0] }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (!form.nombre || !form.email || !form.titulo || !form.foto) {
      setError("Por favor, completa todos los campos y selecciona una foto.");
      return;
    }
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("email", form.email);
      formData.append("titulo", form.titulo);
      formData.append("foto", form.foto);

      const res = await fetch("http://localhost:3001/api/participar", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje || "¡Participación enviada con éxito!");
        setForm({ nombre: "", email: "", titulo: "", foto: null });
        e.target.reset();
      } else {
        setError(data.mensaje || "Error al enviar la participación.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      maxWidth: 400,
      margin: "2rem 0.75rem",
      padding: "2rem 1.5rem",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 2px 16px 0 rgba(44,65,94,0.10)",
      display: "flex",
      flexDirection: "column",
      gap: "1.2rem"
    }}>
      <h2 style={{ textAlign: "center", color: "#2C415E", fontWeight: 800, fontSize: "1.5rem" }}>Participa no certame</h2>
      <label style={{ fontWeight: 600 }}>Nombre
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "1.5px solid #d1d5db", marginTop: 4 }}
          required
        />
      </label>
      <label style={{ fontWeight: 600 }}>Email
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "1.5px solid #d1d5db", marginTop: 4 }}
          required
        />
      </label>
      <label style={{ fontWeight: 600 }}>Título de la foto
        <input
          type="text"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          style={{ width: "100%", padding: "0.6rem", borderRadius: 8, border: "1.5px solid #d1d5db", marginTop: 4 }}
          required
        />
      </label>
      <label style={{ fontWeight: 600 }}>Fotografía
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: 4 }}
          required
        />
      </label>
      <button
        type="submit"
        disabled={enviando}
        style={{
          background: enviando ? "#b0b7c3" : "#2C415E",
          color: "#fff",
          padding: "0.9rem 2.5rem",
          borderRadius: 9999,
          fontWeight: 700,
          fontSize: "1.1rem",
          border: "none",
          cursor: enviando ? "not-allowed" : "pointer",
          marginTop: 8
        }}
      >
        {enviando ? "Enviando..." : "Enviar participación"}
      </button>
      {mensaje && <div style={{ color: "#2C415E", fontWeight: 600, textAlign: "center" }}>{mensaje}</div>}
      {error && <div style={{ color: "#e53e3e", fontWeight: 600, textAlign: "center" }}>{error}</div>}
    </form>
  );
};

export default FormularioParticipacion; 