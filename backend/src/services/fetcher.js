const http = require('http');
const https = require('https');
const dns = require('dns').promises;
const net = require('net');
const zlib = require('zlib');
const { timeoutMs, maxBodyBytes, maxRedirects, allowPrivate } = require('../config');
const { isPrivateIp } = require('../utils/url');

async function lookup(host) {
  const family = net.isIP(host);
  return family ? { address: host, family } : dns.lookup(host);
}

function unzip(buffer, encoding) {
  try {
    if (encoding === 'gzip') return zlib.gunzipSync(buffer, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
    if (encoding === 'br') return zlib.brotliDecompressSync(buffer);
  } catch {}
  return buffer;
}

// One GET request with timings. We resolve DNS ourselves so the private-IP
// check and the actual connection use the same address.
async function request(url) {
  const started = process.hrtime.bigint();
  const now = () => Number(process.hrtime.bigint() - started) / 1e6;
  const host = url.hostname.replace(/^\[|\]$/g, '');

  const { address, family } = await lookup(host);
  if (!allowPrivate && isPrivateIp(address)) throw new Error('Private addresses are not allowed');

  const timing = { dns: now() };
  const secure = url.protocol === 'https:';

  return new Promise((resolve, reject) => {
    let tls = null;
    const req = (secure ? https : http).request({
      hostname: host,
      port: url.port || undefined,
      path: url.pathname + url.search,
      servername: net.isIP(host) ? undefined : host,
      agent: false,
      timeout: timeoutMs,
      headers: { 'User-Agent': 'SiteCheck/1.0', 'Accept-Encoding': 'gzip, br' },
      lookup: (_h, opts, cb) => (opts.all ? cb(null, [{ address, family }]) : cb(null, address, family)),
    }, (res) => {
      timing.ttfb = now();
      const chunks = [];
      let bytes = 0;
      res.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes <= maxBodyBytes) chunks.push(chunk);
      });
      res.on('end', () => {
        timing.total = now();
        const body = unzip(Buffer.concat(chunks), res.headers['content-encoding']).toString('utf8', 0, 300000);
        resolve({ status: res.statusCode, headers: res.headers, body, bytes, timing, tls, ip: address });
      });
      res.on('error', reject);
    });

    req.on('socket', (socket) => {
      socket.on('connect', () => { timing.connect = now(); });
      socket.on('secureConnect', () => {
        timing.secure = now();
        const cert = socket.getPeerCertificate();
        tls = { protocol: socket.getProtocol(), issuer: cert.issuer?.O || cert.issuer?.CN, validTo: cert.valid_to, trusted: socket.authorized };
      });
    });
    req.on('timeout', () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
    req.end();
  });
}

// Follows redirects (each hop goes through request(), so each hop is checked).
async function fetchPage(url) {
  const hops = [];
  for (let i = 0; i <= maxRedirects; i++) {
    const page = await request(url);
    hops.push(url.href);
    const next = page.headers.location;
    if (page.status >= 300 && page.status < 400 && next) {
      url = new URL(next, url);
      if (!/^https?:$/.test(url.protocol)) throw new Error('Invalid redirect');
      continue;
    }
    return { page, url, redirects: hops.length - 1 };
  }
  throw new Error('Too many redirects');
}

module.exports = { request, fetchPage };
