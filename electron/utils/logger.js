const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const os = require('os');

// ✅ Ubicación segura de logs fuera del .asar
const logDir = path.join(os.homedir(), 'manga-rocks-logs');

if (fs.existsSync(logDir)) {
  const stat = fs.statSync(logDir);
  if (!stat.isDirectory()) {
    const nuevoNombre = logDir + '_old_' + Date.now();
    fs.renameSync(logDir, nuevoNombre);
    fs.mkdirSync(logDir);
    console.warn(`⚠️ La ruta de logs era un archivo. Renombrado a: ${nuevoNombre}`);
  }
} else {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
