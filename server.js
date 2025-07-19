const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const qrcode = require('qrcode-terminal');

// ----- config -----
const PORT = 3000;
const UPLOAD_DIRECTORY = path.join(__dirname, 'upload');

const DEV = false;
const DEV_PORT = 3001;
// ----- /config -----

const app = express();
app.use(express.json());
app.use(express.static('.'));

// debugging endpoint
if (DEV) {
  app.post('/debug', (req, res) => {
    console.log('[📱 CLIENT]', req.body.log);
    res.sendStatus(200);
  });
}

// upload endpoint
const upload = multer({dest:UPLOAD_DIRECTORY});
app.post('/upload', upload.single('file'), (req, res) => {

  // move temporary file to target directory
  const relPath = req.body.relativePath;
  if (!relPath) return res.status(400).send("Missing path 'relativePath'");

  const fullTarget = safeJoin(UPLOAD_DIRECTORY, relPath);
  const targetDir = path.dirname(fullTarget);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.renameSync(req.file.path, fullTarget);

  console.log('✅ gespeichert unter:', fullTarget);
  res.send('OK');
});

// start server
app.listen(PORT, () => {
  const ip = getLocalIp();
  if (!DEV) {
    const url = `http://${ip}:${PORT}`;
    qrcode.generate(url, { small: true });
    console.log(`📡 Server läuft unter: ${url}`);
  }
  else {
    const urlD = `http://${ip}:3001`;
    qrcode.generate(urlD, { small: true });
    console.log(`📡 DEV_Server läuft unter: ${urlD}`);
  }
});

if (DEV) {
  const browserSync = require("browser-sync").create();
  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ["index.html"],
    open: false,
    notify: false,
    ui: false,
    ghostMode: false,
    port: DEV_PORT,
  });
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (
        config.family === 'IPv4' &&
        !config.internal &&
        (config.address.startsWith('192.') || config.address.startsWith('10.') || config.address.startsWith('172.'))
      ) {
        return config.address;
      }
    }
  }
  return '127.0.0.1';
}

const safeJoin = (base, unsafeRelativePath) => {
  const normalized = path.normalize(unsafeRelativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const targetPath = path.join(base, normalized);

  if (!targetPath.startsWith(base)) {
    throw new Error('Pfad außerhalb des erlaubten Verzeichnisses.');
  }

  return targetPath;
};