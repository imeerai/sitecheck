// [name, category, where to look, pattern]
// "where": a response header name, or "html" / "cookie".
const RULES = [
  ['Nginx', 'Web server', 'server', /nginx/i],
  ['Apache', 'Web server', 'server', /apache/i],
  ['LiteSpeed', 'Web server', 'server', /litespeed/i],
  ['Caddy', 'Web server', 'server', /caddy/i],
  ['IIS', 'Web server', 'server', /iis/i],
  ['Express', 'Framework', 'x-powered-by', /express/i],
  ['PHP', 'Language', 'x-powered-by', /php/i],
  ['ASP.NET', 'Framework', 'x-powered-by', /asp\.net/i],
  ['Cloudflare', 'CDN', 'cf-ray', /./],
  ['CloudFront', 'CDN', 'x-amz-cf-id', /./],
  ['Fastly', 'CDN', 'x-served-by', /cache/i],
  ['Vercel', 'Hosting', 'x-vercel-id', /./],
  ['Netlify', 'Hosting', 'x-nf-request-id', /./],
  ['GitHub Pages', 'Hosting', 'x-github-request-id', /./],
  ['WordPress', 'CMS', 'html', /wp-content|wp-includes/],
  ['Shopify', 'Platform', 'html', /cdn\.shopify\.com/],
  ['Wix', 'Platform', 'html', /wixstatic\.com/],
  ['Next.js', 'Framework', 'html', /_next\/|__NEXT_DATA__/],
  ['Nuxt', 'Framework', 'html', /__NUXT__|\/_nuxt\//],
  ['Gatsby', 'Framework', 'html', /___gatsby/],
  ['React', 'Frontend', 'html', /data-reactroot|react-dom/],
  ['Vue', 'Frontend', 'html', /data-v-[a-f0-9]{6,}|vue(\.min)?\.js/],
  ['Angular', 'Frontend', 'html', /ng-version|<app-root/],
  ['Svelte', 'Frontend', 'html', /svelte-/],
  ['jQuery', 'Library', 'html', /jquery[.\-@]/i],
  ['Bootstrap', 'CSS', 'html', /bootstrap(\.min)?\.(css|js)|bootstrap@/i],
  ['Tailwind CSS', 'CSS', 'html', /tailwind/i],
  ['Google Analytics', 'Analytics', 'html', /googletagmanager|google-analytics|gtag\(/i],
  ['PHP', 'Language', 'cookie', /PHPSESSID/],
  ['Laravel', 'Framework', 'cookie', /laravel_session/],
  ['Django', 'Framework', 'cookie', /csrftoken/],
  ['Java', 'Language', 'cookie', /JSESSIONID/],
];

function detectStack(headers, html) {
  const sources = { html, cookie: [].concat(headers['set-cookie'] || []).join(';') };
  const found = new Map();

  for (const [name, category, where, pattern] of RULES) {
    const text = sources[where] ?? String(headers[where] ?? '');
    if (pattern.test(text) && !found.has(name)) found.set(name, category);
  }

  const generator = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i);
  if (generator) found.set(generator[1].slice(0, 40), 'Generator');

  return [...found].map(([name, category]) => ({ name, category }));
}

module.exports = { detectStack };
