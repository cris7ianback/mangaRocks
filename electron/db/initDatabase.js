const { db } = require('./connection');
const bcrypt = require('bcryptjs');

function inicializarBaseDeDatos() {
    db.serialize(() => {
        // Tabla de usuarios
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

        // Tabla de mangas
        db.run(`CREATE TABLE IF NOT EXISTS mangas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      autor TEXT,
      descripcion TEXT,
      añoPublicacion INTEGER,
      genero TEXT,
      portada TEXT
    )`);

        // Tabla de capítulos
        db.run(`CREATE TABLE IF NOT EXISTS capitulos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mangaId INTEGER NOT NULL,
      numero INTEGER NOT NULL,
      titulo TEXT,
      archivoPath TEXT,
      FOREIGN KEY(mangaId) REFERENCES mangas(id) ON DELETE CASCADE
    )`);

        // Insertar usuario admin si no existe
        db.get(`SELECT * FROM usuarios WHERE username = ?`, ['admin'], (err, row) => {
            if (err) {
                console.error('❌ Error consultando admin:', err);
                return;
            }

            if (!row) {
                const passwordPlano = 'admin123';
                bcrypt.hash(passwordPlano, 10, (err, hash) => {
                    if (err) {
                        console.error('❌ Error hasheando password:', err);
                        return;
                    }

                    db.run(`INSERT INTO usuarios (username, password) VALUES (?, ?)`, ['admin', hash], (err) => {
                        if (err) {
                            console.error('❌ Error insertando admin:', err);
                        } else {
                            console.log('✅ Usuario admin creado con password: admin123');
                        }
                    });
                });
            } else {
                console.log('ℹ️ Usuario admin ya existe.');
            }
        });
    });
}

module.exports = { inicializarBaseDeDatos };
