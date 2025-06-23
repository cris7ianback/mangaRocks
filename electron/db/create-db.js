const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('mangadb.sqlite');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

    // Insertar usuario admin con password hasheada
    const adminUser = 'admin';
    const adminPass = 'admin123';

    bcrypt.hash(adminPass, 10, (err, hash) => {
        if (err) {
            console.error('Error hasheando password', err);
            return;
        }

        db.run(`INSERT OR IGNORE INTO usuarios (username, password) VALUES (?, ?)`, [adminUser, hash], (err) => {
            if (err) {
                console.error('Error insertando admin', err);
            } else {
                console.log('Usuario admin creado con password admin123');
            }
            db.close();
        });
    });
});
