# Kerstin Backup

A minimalistic smartphone photo backup server built with Node.js and Express.
It allows uploading entire folder structures (e.g. `DCIM/Camera`) from your mobile device via browser, using a local web interface – ideal when USB transfers no longer work.

The files are stored in a local `upload/` directory on the host machine, and the server can be run inside a Docker container.

---

## 🚀 Features

* ✅ Select folders (recursively) via browser (`webkitdirectory`)
* ✅ Upload files individually via `fetch`
* ✅ Keeps folder structure using `relativePath`
* ✅ Stores files on host in `./upload`
* ✅ QR code displayed on server start for easy mobile access
* ✅ Optional live reload (DEV mode with BrowserSync)

---

## 📦 Usage (Docker)

### 1. Clone this project

```bash
git clone <your-url>
cd kerstin-backup
```

### 2. Build and start the container

```bash
docker compose build --no-cache
```

### 3. Scan the QR code

Once the server starts, it will display a QR code in the terminal pointing to your local IP (e.g. `http://192.168.0.123:3000`).
Scan it with your phone to access the upload interface.

---

## 📁 Uploaded files

All uploaded files are stored **on the host**, inside the `upload/` folder – including all nested subdirectories.

You can inspect them directly:

```bash
ls upload/
```

---

## ⚙️ Development mode (optional)

To enable development mode with live-reload (BrowserSync):

1. Edit `server.js` and set `DEV = true`
2. Run with:

```bash
npm run dev
```

This will proxy the server through BrowserSync on port `3001` and reload automatically on changes to `index.html`.

---

## 📜 Notes

* Uses `multer@2.0.1` to parse `multipart/form-data`
* To preserve folder structure, `file.webkitRelativePath` is sent explicitly
* The actual file writing is performed manually based on `req.body.relativePath`
* No HTTPS – intended for local network only

---

## 🛡️ Security

Input paths are not yet sanitized – do not expose this server to the internet.

---

## 📄 License

MIT – use at your own risk.
