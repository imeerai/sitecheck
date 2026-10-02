module.exports = {
  port: process.env.PORT || 3000,
  allowPrivate: process.env.ALLOW_PRIVATE === '1', // local testing only
  timeoutMs: 10000,
  maxBodyBytes: 1024 * 1024,
  maxRedirects: 5,
  benchmarkRuns: 4,
  rateLimit: { max: 15, windowMs: 60000 },
};
