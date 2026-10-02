const http = require('http');
const analyzeRoute = require('./routes/analyze');
const serveStatic = require('./static');
const { sendJson } = require('./utils/http');

module.exports = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/health') return sendJson(res, 200, { ok: true });
  if (url.pathname === '/api/analyze') return analyzeRoute(req, res, url);
  serveStatic(req, res, url);
});
