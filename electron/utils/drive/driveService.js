const { google } = require('googleapis');
const { authorize } = require('./auth');

async function listarCarpetas() {
  const auth = await authorize();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.list({
    q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name)',
  });

  return res.data.files; // Array de carpetas
}

async function listarArchivosEnCarpeta(idCarpeta) {
  const auth = await authorize();
  const drive = google.drive({ version: 'v3', auth });

  const res = await drive.files.list({
    q: `'${idCarpeta}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
  });

  return res.data.files.filter(file => file.name.toLowerCase().endsWith('.cbr'));
}


module.exports = { listarCarpetas, listarArchivosEnCarpeta };
