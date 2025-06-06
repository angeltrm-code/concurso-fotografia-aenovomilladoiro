import React, { useState, useEffect } from 'react';
import '../../styles/components/admin/EditorBasesPanel.css';

// Definición de las secciones de las bases y sus claves en localStorage
const BASES_SECTIONS = [
    { key: 'bases.participantes', title: '1. PARTICIPANTES' },
    { key: 'bases.tema', title: '2. TEMA' },
    { key: 'bases.formato', title: '3. FORMATO' },
    { key: 'bases.plazo', title: '4. PLAZO' },
    { key: 'bases.premios', title: '5. PREMIOS' },
    { key: 'bases.jurado', title: '6. JURADO' },
    { key: 'bases.exposicion', title: '7. EXPOSICIÓN' },
];

// Texto por defecto para cada sección si no hay nada guardado
const BASES_DEFAULT_CONTENT = {
    'bases.participantes': `- Podrán participar todas las personas mayores de 18 años.\n- Cada participante podrá presentar un máximo de 2 fotografías.`, // Usar \n para saltos de línea en el string
    'bases.tema': `- El tema será libre.\n- Las fotografías deberán ser inéditas y no haber sido premiadas en otros concursos.`,
    'bases.formato': `- Las fotografías se presentarán en formato digital.\n- Resolución mínima: 3000x2000 píxeles.\n- Formato: JPG o PNG.`,
    'bases.plazo': `- El plazo de presentación finalizará el 30 de abril de 2025.`,
    'bases.premios': `- Primer premio: 300€\n- Segundo premio: 200€\n- Tercer premio: 100€`,
    'bases.jurado': `- El jurado estará compuesto por profesionales de la fotografía.\n- Su decisión será inapelable.`,
    'bases.exposicion': `- Las fotografías premiadas serán expuestas en la sede de la asociación.\n- Se publicarán en la web y redes sociales.`,
};

const EditorBasesPanel = () => {
    const [secciones, setSecciones] = useState({});
    const [mensajes, setMensajes] = useState({});
    const [ultimaModificacion, setUltimaModificacion] = useState({});

    // Cargar contenido y última modificación al montar el componente
    useEffect(() => {
        const loadedSections = {};
        const loadedModificacion = {};
        BASES_SECTIONS.forEach(section => {
            const savedContent = localStorage.getItem(section.key);
            if (savedContent !== null) {
                loadedSections[section.key] = savedContent;
            } else {
                loadedSections[section.key] = BASES_DEFAULT_CONTENT[section.key] || '';
            }
            const savedModificacion = localStorage.getItem(`${section.key}.modificacion`);
            if (savedModificacion) {
                loadedModificacion[section.key] = savedModificacion;
            }
        });
        setSecciones(loadedSections);
        setUltimaModificacion(loadedModificacion);
    }, []);

    // Manejar cambio en un textarea
    const handleChange = (key, value) => {
        setSecciones(prev => ({ ...prev, [key]: value }));
    };

    // Función para guardar cambios de una sección
    const handleGuardar = (key) => {
        try {
            localStorage.setItem(key, secciones[key]);
            const now = new Date().toLocaleString();
            localStorage.setItem(`${key}.modificacion`, now);
            setUltimaModificacion(prev => ({ ...prev, [key]: now }));
            setMensajes(prev => ({ ...prev, [key]: { text: 'Gardado!', type: 'success' } }));

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                setMensajes(prev => ({ ...prev, [key]: null }));
            }, 3000);
        } catch (error) {
            console.error('Error al guardar sección:', key, error);
            setMensajes(prev => ({ ...prev, [key]: { text: 'Erro ao gardar.', type: 'error' } }));
             setTimeout(() => {
                setMensajes(prev => ({ ...prev, [key]: null }));
            }, 3000);
        }
    };

    return (
        <div className="editor-bases-panel">
             {/* Título general del panel, ya dentro de admin-card en AdminDashboard */}
            {/* <h2 className="admin-card-title">Edición das bases do certame</h2> */}
            
            <div className="editor-bases-sections">
                {BASES_SECTIONS.map(section => (
                    <div key={section.key} className="bases-section-card admin-card">
                        <h3 className="bases-section-title">{section.title}</h3>
                        <textarea
                            value={secciones[section.key] || ''}
                            onChange={(e) => handleChange(section.key, e.target.value)}
                            className="textarea-bases"
                            placeholder={`Escribe aquí el contenido para ${section.title}...`}
                        />
                         <div className="bases-section-actions">
                            <button
                                onClick={() => handleGuardar(section.key)}
                                className="btn-gardar"
                            >
                                Gardar
                            </button>
                            {ultimaModificacion[section.key] && (
                                <span className="ultima-modificacion">
                                    Última modificación: {ultimaModificacion[section.key]}
                                </span>
                            )}
                            {mensajes[section.key] && (
                                <span className={`mensaje-seccion ${mensajes[section.key].type === 'success' ? 'success' : 'error'}`}>
                                    {mensajes[section.key].text}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EditorBasesPanel; 