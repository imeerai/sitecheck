const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

// Serves the built React app; unknown paths fall back to index.html.
module.exports = function serveStatic(req, res, url) {
  let file = path.join(DIST, path.normalize(decodeURIComponent(url.pathname)));
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, 'index.html');

  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Frontend not built. Run: npm run build'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
};
