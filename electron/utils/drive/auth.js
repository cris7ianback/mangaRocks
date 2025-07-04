const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { BrowserWindow } = require('electron');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

function loadCredentials() {
  const content = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
  return JSON.parse(content).installed;
}

function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  console.log('✅ Token guardado en:', TOKEN_PATH);
}

async function getCodeFromWindow(authUrl, redirectUri) {
  return new Promise((resolve, reject) => {
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      }
    });

    authWindow.loadURL(authUrl);

    const { session: { webRequest } } = authWindow.webContents;

    const filter = { urls: [`${redirectUri}/?*`] };

    webRequest.onBeforeRequest(filter, async ({ url }) => {
      const urlParams = new URL(url);
      const code = urlParams.searchParams.get('code');
      const error = urlParams.searchParams.get('error');

      if (code) {
        resolve(code);
      } else {
        reject(new Error(`Error en autorización: ${error}`));
      }

      setTimeout(() => authWindow.close(), 100);
    });

    authWindow.on('closed', () => {
      reject(new Error('Ventana de autorización cerrada por el usuario'));
    });
  });
}

async function authorize() {
  const { client_id, client_secret, redirect_uris } = loadCredentials();
  const redirectUri = redirect_uris[0]; // Debe ser http://localhost

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

  try {
    const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
    const parsed = JSON.parse(token);

    if (!parsed.access_token && !parsed.refresh_token) throw new Error('Token incompleto');

    oAuth2Client.setCredentials(parsed);
    return oAuth2Client;
  } catch (err) {
    console.log('⚠️ No hay token válido. Iniciando OAuth...');

    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });

    const code = await getCodeFromWindow(authUrl, redirectUri);

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    saveToken(tokens);

    return oAuth2Client;
  }
}

module.exports = { authorize };
