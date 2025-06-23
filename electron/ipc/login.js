const { db } = require('../db/connection');
const bcrypt = require('bcryptjs');

function registerLoginHandlers(ipcMain) {
    ipcMain.handle('login', async (event, { username, password }) => {
        return new Promise((resolve) => {
            db.get('SELECT password FROM usuarios WHERE username = ?', [username], (err, row) => {
                if (err) return resolve({ success: false, message: 'Error en base de datos.' });
                if (!row) return resolve({ success: false, message: 'Usuario no encontrado.' });

                bcrypt.compare(password, row.password, (err, result) => {
                    if (result) resolve({ success: true });
                    else resolve({ success: false, message: 'Contraseña incorrecta.' });
                });
            });
        });
    });
}

module.exports = { registerLoginHandlers };
