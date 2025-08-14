# Cursor-like Web IDE (Frontend + Backend)

A web-based IDE inspired by Cursor.ai with AI code assistance, Monaco Editor, chat interface powered by Perplexity API, and optional sonar-pro code quality analysis.

## Features
- Multi-tab Monaco editor with syntax highlighting
- AI autocomplete hints + chat assistance sidebar
- Real-time HTML/CSS/JS preview pane
- Project file explorer
- OAuth2-like auth (stubbed dev login + ready for GitHub/Google)
- Dark/light mode theme (Tailwind CSS)
- Optional collaborative editing (WebSocket-ready)
- Backend endpoints: `/api/ai-assist`, `/api/execute`, `/api/sonar-analyze`
- Monitoring: Prometheus metrics, structured logging

## Tech Stack
- Frontend: React 18 + TypeScript, Vite, Tailwind CSS, Zustand, `@monaco-editor/react`
- Backend: Node.js (Fastify), JWT auth, rate limiting, vm2 sandbox, Prom-client, Winston
- AI: Perplexity API (`/chat/completions`)
- DevOps: Docker, Kubernetes manifests, GitHub Actions

## Monorepo Layout
```
frontend/           # React + Vite + Tailwind app
backend/            # Fastify API server
k8s/                # Kubernetes manifests
.github/workflows/  # CI pipeline
```

## Quickstart (Local Dev)
1) Prereqs: Node 18+, npm (or pnpm/yarn), Docker (optional), kubectl (optional)

2) Copy env template and fill values:
```bash
cp .env.example .env
```

3) Install and run services
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```
- Frontend dev: http://localhost:5173
- Backend dev: http://localhost:3001

## Environment Variables (.env)
Application-level envs are read by backend and referenced by frontend where needed.

```
# Backend
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
UI_API_KEY=dev-ui-key-change-me
JWT_SECRET=dev-jwt-secret-change-me
PPLX_API_KEY=your-perplexity-api-key
PPLX_MODEL=sonar-large-chat # or other compatible model
PPLX_TEMPERATURE=0.7
PPLX_MAX_TOKENS=512
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=1 minute

# Frontend
VITE_API_BASE=http://localhost:3001
```

Never commit real secrets. Use Kubernetes Secrets or CI secrets for production.

## API Overview
- POST `/api/ai-assist`
  - Headers: `Authorization: Bearer <JWT>`, `x-api-key: <UI_API_KEY>`
  - Body: `{ code_context: string, cursor_position: { line:number, column:number }, chat_history: Array<{role:string, content:string}> }`
  - Returns: Perplexity completion
- POST `/api/execute`
  - Body: `{ language: 'javascript' | 'html', code: string }`
  - Sandboxed execution (`vm2` for JS). Returns `{ output, logs }`
- POST `/api/sonar-analyze`
  - Headers: `Authorization: Bearer <JWT>`
  - Body: `{ language: string, code: string }`
  - Returns: analysis report from local `sonar-pro` module
- POST `/api/auth/dev-login`
  - Issues a short-lived JWT for development/testing

## Docker
```bash
# Build and run both services
docker compose up --build
```
- Frontend: http://localhost:8080
- Backend: http://localhost:3001

## Kubernetes (example)
```bash
kubectl apply -f k8s/
```
- Configure images, secrets, and ingress hostnames before applying.

## CI/CD (GitHub Actions)
- Lint/test on PRs
- Build Docker images for frontend and backend
- Optional push to GHCR (configure `CR_PAT` and repo/owner)

## Security Notes
- Do not expose `/api/execute` broadly. Keep rate-limited and authenticated.
- Always validate `x-api-key` and `Authorization` on sensitive routes.
- Use HTTPS in production. Terminate TLS at ingress or edge.
- Sanitize user-provided code and messages.

## Monitoring
- Backend exposes Prometheus metrics at `/metrics`
- Structured logs with Winston
- Integrate Grafana/ELK as needed

## License
MIT
