// electron/db/connection.js
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { app } = require('electron');

const dbPath = path.join(app.getPath('userData'), 'mangadb.sqlite');

// Crea una única instancia y la reutiliza
const db = new sqlite3.Database(dbPath);

module.exports = {
    db,
    dbPath
};
