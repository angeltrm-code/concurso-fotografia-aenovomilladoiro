import { FaUsers, FaCamera, FaFileImage, FaCalendarAlt, FaGavel, FaTrophy, FaMapMarkerAlt, FaEnvelopeOpenText } from "react-icons/fa";
import "../App.css";

const bases = [
  {
    icono: <FaCamera className="base-icon" />, 
    titulo: "Propósito",
    descripcion: "Fomentar a participación cidadá e crear unha estética positiva das empresas e actividades do Parque Empresarial do Milladoiro. Valórase a visión positiva e a presenza humana."
  },
  {
    icono: <FaMapMarkerAlt className="base-icon" />, 
    titulo: "Temática e Lugar",
    descripcion: "Fotografías de temática comercial-empresarial, tomadas exclusivamente nas naves e LOFTS do Parque Empresarial do Milladoiro. Pódense mostrar instalacións, persoal, produtos, eventos ou interiores (con permiso)."
  },
  {
    icono: <FaUsers className="base-icon" />, 
    titulo: "Participantes",
    descripcion: "Pode participar calquera persoa residente en España, sen límite de idade."
  },
  {
    icono: <FaFileImage className="base-icon" />, 
    titulo: "Fotografías",
    descripcion: "Cada participante pode presentar unha única fotografía, orixinal, inédita e actual. Permítense edicións dixitais se manteñen a conexión co parque. Formato JPG/JPEG, alta resolución. Se aparecen persoas recoñecibles, é obrigatoria autorización escrita."
  },
  {
    icono: <FaCalendarAlt className="base-icon" />, 
    titulo: "Prazo de presentación",
    descripcion: "O prazo remata o 9 de novembro de 2025 (ver bases para posibles cambios)."
  },
  {
    icono: <FaEnvelopeOpenText className="base-icon" />, 
    titulo: "Como participar",
    descripcion: "Envia a túa foto (nome do arquivo igual ao título) e os teus datos persoais (Nome, Apelidos, NIF/NIE, dirección, mail, teléfono) ao correo foto@aenovomilladoiro.com. Asunto: Certame fotográfico: 'Título da fotografía'."
  },
  {
    icono: <FaTrophy className="base-icon" />, 
    titulo: "Premios",
    descripcion: "1º premio: 500 € | 2º premio: 400 € | 3º premio: 300 €. Os premios están suxeitos a retencións fiscais."
  },
  {
    icono: <FaGavel className="base-icon" />, 
    titulo: "Xurado e exposición",
    descripcion: "O xurado está formado por expertos e representantes da Asociación e Concello. As obras exporanse na Casa de Cultura e na sede da AEPEM. A gala de entrega será o 18 de decembro de 2025 ás 20:30h."
  }
];

export default function BasesCertame() {
  return (
    <section className="bases-section">
      <h2 className="base-title-section">Bases do XI Certame de Fotografía</h2>
      <p className="base-intro-text">
        O obxectivo do certame é promover a creatividade e a visión positiva do Parque Empresarial do Milladoiro a través da fotografía. Consulta as bases completas para detalles legais, dereitos e condicións específicas.
      </p>
      <div className="bases-cards-container">
        {bases.map((base, idx) => (
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