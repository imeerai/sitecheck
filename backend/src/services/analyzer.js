const { benchmarkRuns } = require('../config');
const { parseUrl } = require('../utils/url');
const { request, fetchPage } = require('./fetcher');
const { detectStack } = require('./techStack');

const round = Math.round;
const average = (list) => list.reduce((a, b) => a + b, 0) / list.length;
const SECURITY_HEADERS = {
  HSTS: 'strict-transport-security',
  CSP: 'content-security-policy',
  'X-Frame-Options': 'x-frame-options',
  'X-Content-Type-Options': 'x-content-type-options',
  'Referrer-Policy': 'referrer-policy',
};

// Challenge pages (Cloudflare etc.) hide the real site from bots.
const isBlocked = (page) =>
  page.headers['cf-mitigated'] === 'challenge' ||
  ([403, 429, 503].includes(page.status) && /cloudflare/i.test(page.headers.server || ''));

function friendlyError(err) {
  if (err.code === 'ENOTFOUND') return 'Domain not found (DNS failed)';
  if (err.code === 'ECONNREFUSED') return 'Connection refused';
  return err.message;
}

// First request follows redirects; the rest hit the final URL to get a fair benchmark.
async function runBenchmark(first, url) {
  const runs = [first.timing];
  for (let i = 1; i < benchmarkRuns; i++) {
    try { runs.push((await request(url)).timing); } catch {}
  }
  const ttfb = runs.map((r) => r.ttfb);
  return {
    runs: runs.length,
    ttfbAvg: round(average(ttfb)),
    ttfbMin: round(Math.min(...ttfb)),
    ttfbMax: round(Math.max(...ttfb)),
    totalAvg: round(average(runs.map((r) => r.total))),
  };
}

function healthNotes(page, url, bench) {
  const notes = [];
  let state = 'up';
  const warn = (text) => { if (state === 'up') state = 'warn'; notes.push(text); };

  if (page.status >= 500) { state = 'down'; notes.push(`Server error ${page.status}`); }
  else if (page.status >= 400) warn(`Client error ${page.status} (the site may block bots)`);
  if (bench.ttfbAvg > 1500) warn('Slow response time');
  if (url.protocol === 'http:') notes.push('Not using HTTPS');
  if (page.tls) {
    if (!page.tls.trusted) warn('SSL certificate is not trusted');
    if (page.tls.daysLeft < 14) warn(`SSL expires in ${page.tls.daysLeft} days`);
  }
  return { state, notes };
}

async function analyze(input) {
  const start = parseUrl(input);

  let result;
  try { result = await fetchPage(start); }
  catch (err) { return { url: start.href, state: 'down', error: friendlyError(err) }; }

  const { page, url, redirects } = result;
  if (page.tls) page.tls.daysLeft = Math.floor((new Date(page.tls.validTo) - Date.now()) / 864e5);

  const bench = await runBenchmark(page, url);
  const { state, notes } = healthNotes(page, url, bench);
  const t = page.timing;

  return {
    url: url.href,
    state,
    notes,
    status: page.status,
    ip: page.ip,
    server: page.headers.server || null,
    compression: page.headers['content-encoding'] || null,
    redirects,
    sizeKb: Math.round(page.bytes / 102.4) / 10,
    bench,
    timing: {
      dns: round(t.dns),
      tcp: t.connect && round(t.connect - t.dns),
      tls: t.secure && round(t.secure - t.connect),
      ttfb: round(t.ttfb),
      total: round(t.total),
    },
    tls: page.tls,
    blocked: isBlocked(page),
    stack: detectStack(page.headers, page.body),
    security: Object.fromEntries(Object.entries(SECURITY_HEADERS).map(([label, name]) => [label, name in page.headers])),
  };
}

module.exports = { analyze };
