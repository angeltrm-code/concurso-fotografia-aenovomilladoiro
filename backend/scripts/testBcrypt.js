import bcrypt from 'bcryptjs';

const hash = '$2a$10$4PDrTy8BfNHfbHv3qHa7BOkqElDsydE8CnFFNhRUZ2r0ZjFAvDdRK';
const password = 'certame2025';

bcrypt.compare(password, hash).then(result => {
    console.log('¿La contraseña es válida para el hash?:', result);
}); 