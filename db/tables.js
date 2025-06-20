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

  // Crear tabla capitulos si no existe
  db.run(`CREATE TABLE IF NOT EXISTS capitulos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mangaId INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    titulo TEXT,
    archivoBase64 TEXT,
    FOREIGN KEY(mangaId) REFERENCES mangas(id) ON DELETE CASCADE
  )`);
});
