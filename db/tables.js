const db = require('./connection');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

    db.run(`CREATE TABLE IF NOT EXISTS mangas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT,
    descripcion TEXT,
    añoPublicacion INTEGER,
    genero TEXT,
    portada TEXT
  )`);

    // Aquí podrías crear tabla de capítulos también
});
