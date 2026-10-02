const net = require('net');

function parseUrl(input) {
  const text = String(input || '').trim();
  if (!text) throw new Error('URL required');
  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(text);
  if (hasScheme && !/^https?:\/\//i.test(text)) throw new Error('Only http and https are supported');
  return new URL(hasScheme ? text : 'https://' + text);
}

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith('::ffff:')) {
    const v4 = v6.slice(7);
    return net.isIPv4(v4) ? isPrivateIp(v4) : true;
  }
  return v6 === '::1' || v6 === '::' || /^(fc|fd|fe[89ab])/.test(v6);
}

module.exports = { parseUrl, isPrivateIp };
