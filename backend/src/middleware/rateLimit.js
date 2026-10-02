const { rateLimit } = require('../config');

const hits = new Map(); // ip -> request timestamps

function tooManyRequests(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < rateLimit.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > rateLimit.max;
}

setInterval(() => hits.clear(), 10 * 60 * 1000).unref();

module.exports = { tooManyRequests };
