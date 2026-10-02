const { analyze } = require('../services/analyzer');
const { tooManyRequests } = require('../middleware/rateLimit');
const { sendJson } = require('../utils/http');

module.exports = async function analyzeRoute(req, res, url) {
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress;
  if (tooManyRequests(ip)) return sendJson(res, 429, { error: 'Too many requests, try again in a minute' });

  try {
    sendJson(res, 200, await analyze(url.searchParams.get('url')));
  } catch (err) {
    sendJson(res, 400, { error: err.message });
  }
};
