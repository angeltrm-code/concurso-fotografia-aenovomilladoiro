import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Usuario y hash de contraseña desde .env
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('DEBUG ADMIN LOGIN');
    console.log('ADMIN_USER:', ADMIN_USER);
    console.log('ADMIN_PASS_HASH:', ADMIN_PASS_HASH);
    console.log('USERNAME RECIBIDO:', username);
    console.log('PASSWORD RECIBIDO:', password);
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }
    if (username !== ADMIN_USER) {
        console.log('Usuario incorrecto');
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const valid = await bcrypt.compare(password, ADMIN_PASS_HASH);
    console.log('RESULTADO BCRYPT:', valid);
    if (!valid) {
        console.log('Contraseña incorrecta');
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

export default router; 