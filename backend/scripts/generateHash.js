import bcrypt from 'bcryptjs';

const password = 'certame2025';

bcrypt.hash(password, 10).then(hash => {
    console.log('Hash generado para certame2025:', hash);
}); 