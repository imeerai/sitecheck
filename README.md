# SiteCheck

SiteCheck performs a quick technical audit of any public website. Enter a URL
to view response-time benchmarks, server health, detected technologies, and
basic page details.

The project has a dependency-free Node.js backend and a React + Vite frontend.

## Features

- URL response-time benchmark with multiple runs
- HTTP status, headers, redirects, and page health checks
- Technology detection from headers, cookies, and HTML
- SSRF protection that blocks private and internal IP ranges
- Per-IP rate limit of 15 analysis requests per minute
- JSON API that can also be used without the frontend

## Requirements

- Node.js 18 or newer
- npm

## Quick start

Install the frontend dependencies and build the static assets:

```bash
npm run build
npm start
```

Open <http://localhost:3000> in your browser.

Run the backend unit tests with:

```bash
npm test
```

## Development

Use two terminals when working on the frontend. The Vite development server
proxies `/api` requests to the backend on port 3000.

Terminal 1:

```bash
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

Then open the Vite URL shown in the terminal, usually
<http://localhost:5173>.

## API

Check whether the backend is running:

```bash
curl http://localhost:3000/api/health
```

Analyze a website:

```bash
curl 'http://localhost:3000/api/analyze?url=example.com'
```

The URL may omit `https://`; SiteCheck adds it automatically. Only HTTP and
HTTPS URLs are accepted.

## Project structure

```text
backend/
  server.js              Node.js entry point
  src/
    app.js               HTTP router and API endpoints
    config/              runtime settings
    routes/              API route handlers
    services/            fetcher, analyzer, and tech detection
    middleware/          rate limiting
    utils/               URL, HTTP, and network helpers
  test/                  Node.js unit tests
frontend/
  src/
    components/          dashboard UI components
    lib/                 API and formatting helpers
  dist/                  production frontend build
```

## Configuration

The backend listens on port 3000 by default. Set `PORT` to use another port:

```bash
PORT=4000 node backend/server.js
```

`ALLOW_PRIVATE=1` is available for local testing only. Do not enable it when
the server is exposed to untrusted users, because it allows requests to
private network addresses.
