# SiteCheck

URL do, benchmark / tech stack / server health lo.
Backend: Node.js, **zero dependencies**. Frontend: React + Tailwind (Vite).

```
backend/
  server.js              entry point
  src/
    app.js               router
    config/              settings
    routes/              /api/analyze
    services/            fetcher, techStack, analyzer
    middleware/          rate limit
    utils/               url + private-IP checks, http helpers
  test/                  node:test unit tests
frontend/
  src/
    components/          UrlForm, Status, Benchmark, TechStack, Health
    lib/                 api, format
  dist/                  prebuilt
```

## Run

    npm start                 # http://localhost:3000
    npm test                  # backend unit tests

## Frontend badalna ho

    npm run build             # rebuild frontend/dist
    npm run dev:api           # dev: terminal 1
    npm run dev:web           # dev: terminal 2

Private/internal IPs blocked hain (SSRF), rate limit 15 req/min per IP.
