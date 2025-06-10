import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PhotoUpload from "./components/PhotoUpload";
import Header from "./components/Header";
import PhotoCarousel from "./components/PhotoCarousel";
import BasesCertame from "./components/BasesCertame";
import Footer from "./components/Footer";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { isAuthenticated } from "./utils/auth";
import "./styles/main.css";

// Componente para proteger rutas de administración
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

// Componente principal de la aplicación
// Estructura: Header fijo, contenido principal (carrusel, bases, formulario), Footer independiente
const images = [
  "/slide1.jpg",
  "/slide2.jpg",
  "/slide3.jpg",
  "/slide4.jpg",
  "/slide5.jpg",
  "/slide6.jpg"
];

// Componente para la página principal
const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Rotación automática de imágenes del carrusel
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Contenedor principal: fondo degradado y fuente personalizada */}
      <div className="app-container">
        {/* Header fijo en la parte superior */}
        <Header />
        {/* Contenido principal */}
        <main className="main-content">
          {/* Carrusel de fotos */}
          <section className="carousel-section">
            <PhotoCarousel />
          </section>
          {/* Sección de bases del certamen */}
          <BasesCertame />
          {/* Formulario de participación */}
          <div className="form-section-wrapper">
            <div className="form-section-container">
              {/* Descripción y formulario */}
              <section className="form-section-content">
                <div className="form-section-background"></div>
                <div className="form-section-inner">
                  <div className="form-section-max-width">
                    <PhotoUpload />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      {/* Footer independiente fuera del contenedor principal */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
