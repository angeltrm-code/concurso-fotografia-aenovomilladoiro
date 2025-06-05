const fs = require('fs');
const path = require('path');

// Patrones de archivos sensibles que no deberían ser commiteados
const SENSITIVE_PATTERNS = [
    /\.env$/,
    /\.env\.[a-zA-Z]+$/,
    /participaciones\.json$/,
    /\/uploads\//,
    /\/backups\//,
    /\/logs\//
];

// Patrones de texto que podrían indicar secretos
const SECRET_PATTERNS = [
    /password\s*=\s*['"][^'"]+['"]/i,
    /secret\s*=\s*['"][^'"]+['"]/i,
    /key\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    /auth[_-]?token\s*=\s*['"][^'"]+['"]/i
];

// Colores para la consola
const colors = {
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m'
};

// Obtener archivos en el stage
const getStagedFiles = () => {
    const { execSync } = require('child_process');
    return execSync('git diff --cached --name-only --diff-filter=ACMR')
        .toString()
        .split('\n')
        .filter(Boolean);
};

// Verificar si un archivo coincide con patrones sensibles
const isSensitiveFile = (file) => {
    return SENSITIVE_PATTERNS.some(pattern => pattern.test(file));
};

// Verificar si un archivo contiene posibles secretos
const containsSecrets = (file) => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        return SECRET_PATTERNS.some(pattern => pattern.test(content));
    } catch (error) {
        console.error(`Error al leer el archivo ${file}:`, error);
        return false;
    }
};

// Función principal
const main = () => {
    const stagedFiles = getStagedFiles();
    let hasErrors = false;
    let hasWarnings = false;

    stagedFiles.forEach(file => {
        // Verificar archivos sensibles
        if (isSensitiveFile(file)) {
            console.error(`${colors.red}❌ Error: El archivo ${file} parece contener información sensible y no debería ser commiteado.${colors.reset}`);
            hasErrors = true;
        }

        // Verificar posibles secretos
        if (containsSecrets(file)) {
            console.warn(`${colors.yellow}⚠️  Advertencia: El archivo ${file} podría contener secretos o claves. Por favor, verifica su contenido.${colors.reset}`);
            hasWarnings = true;
        }
    });

    if (hasErrors) {
        console.error(`\n${colors.red}❌ Commit abortado: Se detectaron archivos sensibles.${colors.reset}`);
        process.exit(1);
    }

    if (hasWarnings) {
        console.warn(`\n${colors.yellow}⚠️  Advertencia: Se detectaron posibles secretos. Por favor, verifica los archivos mencionados.${colors.reset}`);
    }
};

main(); 