const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { getLastBackupTimestamp } = require('../utils/backup');

/**
 * @route GET /api/health
 * @desc Obtiene el estado del sistema y métricas clave
 * @access Public
 */
router.get('/health', async (req, res) => {
    try {
        // Leer participaciones.json
        const participacionesPath = path.join(__dirname, '../../data/participaciones.json');
        const participacionesData = await fs.readFile(participacionesPath, 'utf8');
        const participaciones = JSON.parse(participacionesData);

        // Obtener timestamp del último backup
        const ultimoBackup = getLastBackupTimestamp();

        // Construir respuesta
        const healthData = {
            status: "ok",
            timestamp: new Date().toISOString(),
            participacionesTotales: participaciones.length,
            ultimoBackup: ultimoBackup
        };

        res.json(healthData);
    } catch (error) {
        console.error('Error en health check:', error);
        res.status(500).json({
            status: "error",
            message: "Error al obtener el estado del sistema"
        });
    }
});

module.exports = router; 