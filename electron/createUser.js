const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const { app } = require('electron'); // Si no usas electron aquí, define manualmente la ruta

// O define manualmente la ruta completa a la base de datos:
const dbPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'manga-rocks', 'mangadb.sqlite');
const db = new sqlite3.Database(dbPath);

const username = 'admin';
const plainPassword = '1234';

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  db.run('INSERT OR IGNORE INTO usuarios (username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) {
      console.error('Error insertando usuario:', err.message);
    } else {
      console.log(`Usuario ${username} insertado correctamente`);
    }
    db.close();
  });
});
