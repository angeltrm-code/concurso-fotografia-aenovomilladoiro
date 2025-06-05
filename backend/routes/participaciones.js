const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Ruta para obtener todas las participaciones
router.get('/', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, '../../data');
        const filePath = path.join(dataDir, 'participaciones.json');
        
        try {
            const contenido = await fs.readFile(filePath, 'utf-8');
            const participaciones = JSON.parse(contenido);
            res.json({
                success: true,
                data: participaciones
            });
        } catch (err) {
            if (err.code === 'ENOENT') {
                res.json({
                    success: true,
                    data: []
                });
            } else {
                throw err;
            }
        }
    } catch (error) {
        console.error('Error al obtener participaciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener participaciones'
        });
    }
});

module.exports = router; 