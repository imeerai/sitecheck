const test = require('node:test');
const assert = require('node:assert');
const { parseUrl, isPrivateIp } = require('../src/utils/url');
const { detectStack } = require('../src/services/techStack');

test('parseUrl adds https and rejects other protocols', () => {
  assert.strictEqual(parseUrl('example.com').href, 'https://example.com/');
  assert.throws(() => parseUrl('ftp://example.com'));
  assert.throws(() => parseUrl(''));
});

test('isPrivateIp blocks internal ranges only', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '192.168.0.5', '169.254.169.254', '::1', '::ffff:7f00:1']) {
    assert.ok(isPrivateIp(ip), ip);
  }
  assert.ok(!isPrivateIp('8.8.8.8'));
});

test('detectStack reads headers, cookies and html', () => {
  const stack = detectStack({ server: 'nginx', 'set-cookie': ['PHPSESSID=1'] }, '<script src="/_next/a.js">');
  const names = stack.map((s) => s.name);
  assert.deepStrictEqual(names.sort(), ['Next.js', 'Nginx', 'PHP']);
});
