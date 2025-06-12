import React, { useState, useEffect } from "react";
import AvisoBasesPDF from "./AvisoBasesPDF";
import TarjetasBases from "./TarjetasBases";
import "../styles/components/BasesCertame.css";

const BasesCertame = () => {
  const [bases, setBases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBases = async () => {
      try {
        const res = await fetch("/api/bases");
        const data = await res.json();
        setBases(data);
      } catch (err) {
        setError("Non se puideron cargar as bases.");
      } finally {
        setLoading(false);
      }
    };
    fetchBases();
  }, []);

  if (loading) return <div>Cargando bases...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="contenedor-aviso">
        <AvisoBasesPDF />
      </div>
      <div className="contenedor-bases">
        <TarjetasBases secciones={bases} />
      </div>
    </>
  );
};

export default BasesCertame; 