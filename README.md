# AI‑Assessment‑Advisor

**Overview**
- FastAPI backend with LangChain/OpenAI logic in `backend/`.
- Vite + React frontend in `frontend/`.
- Dev can run locally via Node scripts or with Docker Compose.

**Prereqs**
- Node.js 20+ and npm
- Python 3.13 (for local, non‑Docker dev)
- Docker Desktop (for containerized dev)

**Project Scripts**
- Local setup: `npm run setup` (installs root deps, backend `venv` deps, and frontend deps)
- Local dev (frontend + backend concurrently): `npm run dev`
  - Frontend dev server: http://localhost:5173
  - Backend dev server: http://localhost:8000

**Environment Variables**
- Place backend secrets in `backend/.env` (not committed); See .env.example for your .env.
- Required: `OPENAI_API_KEY=sk-...` (no quotes, no Bearer, no trailing spaces). Windows line endings are handled in code.
- Frontend API base (Compose default): `VITE_API_BASE=http://localhost:8000`.

**Local (Non‑Docker) Dev**
- One‑time: `npm run setup`
- Start both:
  - `npm run dev`
- Or run separately:
  - Backend: `cd backend && venv\\Scripts\\python.exe -m uvicorn main:app --reload --port 8000`
  - Frontend: `cd frontend && npm run dev -- --host`

**Docker Dev (recommended for parity)**
- Compose file: `docker-compose.yml`
- Services:
  - `backend`: builds from `backend/Dockerfile`, exposes `8000`, mounts `backend/.env` into container at `/run/secrets/app_env` (not copied into the image).
  - `frontend`: builds from `frontend/Dockerfile`, runs Vite dev server on `5173` and talks to backend via `VITE_API_BASE`.
- Start/stop:
  - Start: `docker compose up --build`
  - Detach: `docker compose up --build -d`
  - Stop: `docker compose down`
  - Tail logs: `docker compose logs -f backend` or `frontend`
- Open:
  - Frontend: http://localhost:5173
  - Backend API: http://localhost:8000

**How Docker handles secrets here**
- `backend/.env` is excluded by `backend/.dockerignore` and never baked into the image.
- At runtime, Compose bind‑mounts `backend/.env` to `/run/secrets/app_env` (read‑only).
- The `backend/Dockerfile` startup command exports variables from `/run/secrets/app_env` before launching Uvicorn.

**Common Issues**
- Invalid Authorization header with OpenAI: ensure `OPENAI_API_KEY` is clean. Backend sanitizes CR/LF, quotes, and an accidental `Bearer ` prefix.
- CORS: backend allows `http://localhost:5173` by default. Update in `backend/main.py` if needed.
- Frontend API base: adjust `VITE_API_BASE` in `docker-compose.yml` if backend runs elsewhere.

**Repo Structure**
- Backend app entry: `backend/main.py`
- Backend model logic: `backend/model.py`
- Backend requirements: `backend/requirements.txt`
- Frontend app: `frontend/`
- Dockerfiles: `backend/Dockerfile`, `frontend/Dockerfile`
- Compose: `docker-compose.yml`

**Production Notes**
- Current Compose runs a Vite dev server for the frontend (fast feedback). For production, consider building static assets and serving via a web server, or keep dev server behind a reverse proxy with TLS.
