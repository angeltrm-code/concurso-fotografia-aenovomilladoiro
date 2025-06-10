import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const performBackup = async () => {
    const dataDir = path.join(__dirname, '..', 'data');
    const backupDir = path.join(dataDir, 'backups');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);

    try {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Crear backup de bases.txt
        const basesPath = path.join(dataDir, 'bases.txt');
        if (fs.existsSync(basesPath)) {
            const backupBasesPath = path.join(backupPath, 'bases.txt');
            fs.mkdirSync(path.dirname(backupBasesPath), { recursive: true });
            fs.copyFileSync(basesPath, backupBasesPath);
        }

        console.log(`Backup realizado en: ${backupPath}`);
    } catch (error) {
        console.error('Error al realizar el backup:', error);
    }
};

export const limpiarBackupsAntiguos = () => {
    const backupDir = path.join(__dirname, '..', 'data', 'backups');
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

    try {
        if (!fs.existsSync(backupDir)) return;

        const backups = fs.readdirSync(backupDir);
        const now = Date.now();

        backups.forEach(backup => {
            const backupPath = path.join(backupDir, backup);
            const stats = fs.statSync(backupPath);
            const age = now - stats.mtime.getTime();

            if (age > maxAge) {
                fs.rmSync(backupPath, { recursive: true, force: true });
                console.log(`Backup antiguo eliminado: ${backup}`);
            }
        });
    } catch (error) {
        console.error('Error al limpiar backups antiguos:', error);
    }
}; 