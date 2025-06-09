import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDirectoryIfNotExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directorio creado: ${dirPath}`);
    }
};

const initializeDirectories = () => {
    const baseDir = path.join(__dirname, '..');
    
    // Crear directorio de uploads
    const uploadsDir = path.join(baseDir, 'uploads');
    createDirectoryIfNotExists(uploadsDir);
    
    // Crear directorio de carrusel dentro de uploads
    const carruselDir = path.join(uploadsDir, 'carrusel');
    createDirectoryIfNotExists(carruselDir);
    
    // Crear directorio public para archivos estáticos
    const publicDir = path.join(baseDir, 'public');
    createDirectoryIfNotExists(publicDir);
    
    // Crear directorio de imágenes dentro de public
    const publicImagesDir = path.join(publicDir, 'images');
    createDirectoryIfNotExists(publicImagesDir);
    
    // Crear directorio de carrusel dentro de public/images
    const publicCarruselDir = path.join(publicImagesDir, 'carrusel');
    createDirectoryIfNotExists(publicCarruselDir);

    // Crear directorio de datos
    const dataDir = path.join(baseDir, 'data');
    createDirectoryIfNotExists(dataDir);

    // Inicializar archivo de bases.txt con contenido por defecto si no existe
    const basesFilePath = path.join(dataDir, 'bases.txt');
    if (!fs.existsSync(basesFilePath)) {
        const defaultBasesContent = `BASES DO CERTAME FOTOGRÁFICO 2025\n\n1. PARTICIPANTES\n   - Podrán participar todas las personas mayores de 18 años.\n   - Cada participante podrá presentar un máximo de 2 fotografías.\n\n2. TEMA\n   - El tema será libre.\n   - Las fotografías deberán ser inéditas y no haber sido premiadas en otros concursos.\n\n3. FORMATO\n   - Las fotografías se presentarán en formato digital.\n   - Resolución mínima: 3000x2000 píxeles.\n   - Formato: JPG o PNG.\n\n4. PLAZO\n   - El plazo de presentación finalizará el 30 de abril de 2025.\n\n5. PREMIOS\n   - Primer premio: 300€\n   - Segundo premio: 200€\n   - Tercer premio: 100€\n\n6. JURADO\n   - El jurado estará compuesto por profesionales de la fotografía.\n   - Su decisión será inapelable.\n\n7. EXPOSICIÓN\n   - Las fotografías premiadas serán expuestas en la sede de la asociación.\n   - Se publicarán en la web y redes sociales.`;
        fs.writeFileSync(basesFilePath, defaultBasesContent);
        console.log('Archivo bases.txt creado con contenido por defecto.');
    }
};

export default initializeDirectories; 