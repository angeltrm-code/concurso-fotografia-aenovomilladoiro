const fs = require('fs').promises;
const path = require('path');

// Configuración de rutas
const BACKUP_DIR = path.join(__dirname, '../../backups');
const DATA_DIR = path.join(__dirname, '../../data');
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Variable para almacenar la fecha del último backup
let lastBackupTimestamp = null;

/**
 * Crea el directorio de backups si no existe
 */
async function ensureBackupDir() {
    try {
        await fs.mkdir(BACKUP_DIR, { recursive: true });
    } catch (error) {
        console.error('Error al crear directorio de backups:', error);
        throw error;
    }
}

/**
 * Genera un timestamp formateado para el nombre del backup
 */
function getBackupTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
}

/**
 * Realiza el backup de un archivo
 */
async function backupFile(sourcePath, backupPath) {
    try {
        await fs.copyFile(sourcePath, backupPath);
    } catch (error) {
        console.error(`Error al hacer backup de ${sourcePath}:`, error);
        throw error;
    }
}

/**
 * Realiza el backup de un directorio completo
 */
async function backupDirectory(sourceDir, backupDir) {
    try {
        // Crear directorio de backup
        await fs.mkdir(backupDir, { recursive: true });

        // Leer contenido del directorio
        const files = await fs.readdir(sourceDir);

        // Copiar cada archivo
        for (const file of files) {
            const sourcePath = path.join(sourceDir, file);
            const backupPath = path.join(backupDir, file);
            
            const stats = await fs.stat(sourcePath);
            if (stats.isDirectory()) {
                await backupDirectory(sourcePath, backupPath);
            } else {
                await backupFile(sourcePath, backupPath);
            }
        }
    } catch (error) {
        console.error(`Error al hacer backup del directorio ${sourceDir}:`, error);
        throw error;
    }
}

/**
 * Valida si un string tiene formato de fecha ISO
 * @param {string} dateStr - String a validar
 * @returns {boolean} - true si es una fecha válida
 */
function isValidISODate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && dateStr === date.toISOString();
}

/**
 * Limpia los backups más antiguos de 7 días
 */
async function limpiarBackupsAntiguos() {
    try {
        // Obtener lista de carpetas en /backups
        const backups = await fs.readdir(BACKUP_DIR);
        const fechaActual = new Date();
        const fechaLimite = new Date(fechaActual.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 días atrás

        // Procesar cada carpeta
        for (const backup of backups) {
            const backupPath = path.join(BACKUP_DIR, backup);
            const stats = await fs.stat(backupPath);

            // Solo procesar directorios
            if (!stats.isDirectory()) continue;

            // Validar que el nombre sea una fecha ISO válida
            if (!isValidISODate(backup)) {
                console.log(`Ignorando carpeta con formato no válido: ${backup}`);
                continue;
            }

            const fechaBackup = new Date(backup);
            
            // Si el backup es más antiguo que el límite, eliminarlo
            if (fechaBackup < fechaLimite) {
                try {
                    await fs.rm(backupPath, { recursive: true, force: true });
                    console.log(`Backup antiguo eliminado: ${backup}`);
                } catch (error) {
                    console.error(`Error al eliminar backup ${backup}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error al limpiar backups antiguos:', error);
        throw error;
    }
}

/**
 * Realiza un backup completo del sistema
 * @returns {Promise<string>} Timestamp del backup realizado
 */
async function performBackup() {
    const timestamp = getBackupTimestamp();
    const backupPath = path.join(BACKUP_DIR, timestamp);

    try {
        // Asegurar que existe el directorio de backups
        await ensureBackupDir();

        // Crear directorio para este backup
        await fs.mkdir(backupPath);

        // Backup de participaciones.json
        const participacionesPath = path.join(DATA_DIR, 'participaciones.json');
        const participacionesBackupPath = path.join(backupPath, 'participaciones.json');
        await backupFile(participacionesPath, participacionesBackupPath);

        // Backup de la carpeta uploads
        const uploadsBackupPath = path.join(backupPath, 'uploads');
        await backupDirectory(UPLOADS_DIR, uploadsBackupPath);

        // Actualizar timestamp del último backup
        lastBackupTimestamp = timestamp;
        console.log(`Backup completado exitosamente: ${timestamp}`);

        // Limpiar backups antiguos después de crear uno nuevo
        await limpiarBackupsAntiguos();

        return timestamp;
    } catch (error) {
        console.error('Error durante el proceso de backup:', error);
        throw error;
    }
}

module.exports = {
    performBackup,
    getLastBackupTimestamp: () => lastBackupTimestamp,
    limpiarBackupsAntiguos
}; 