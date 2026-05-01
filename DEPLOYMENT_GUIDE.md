# 🚢 NewsGuard AI Deployment Guide

This guide provides comprehensive instructions for deploying NewsGuard AI in various environments, from local development to production.

---

## 📋 Table of Contents
- [Infrastructure Overview](#-infrastructure-overview)
- [1. Environment Variables](#1-environment-variables)
- [2. Docker Deployment (Recommended)](#2-docker-deployment-recommended)
- [3. Cloud Platforms (SaaS)](#3-cloud-platforms-saas)
    - [Frontend (Vercel)](#frontend-vercel)
    - [Backend (Railway/Render)](#backend-railwayrender)
    - [Database (Supabase/Managed)](#database-supabasemanaged)
- [4. AI Configuration](#4-ai-configuration)
- [5. Troubleshooting](#5-troubleshooting)

---

## 🏗️ Infrastructure Overview
- **Frontend**: Next.js 16 (App Router)
- **Backend**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL 14+
- **AI Engine**: Groq (Llama 3.3) / Ollama (Local)

---

## 1. Environment Variables

You need to configure these variables for both backend and frontend.

### Backend (`newsguard-backend/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_SERVER` | DB Host | `localhost` or `db.example.com` |
| `POSTGRES_USER` | DB Username | `postgres` |
| `POSTGRES_PASSWORD` | DB Password | `your_password` |
| `POSTGRES_DB` | DB Name | `newsguard` |
| `GROQ_API_KEY` | Groq Cloud Key | `gsk_...` |
| `GOOGLE_API_KEY` | Google Cloud API Key | `AIza...` |
| `GOOGLE_CSE_ID` | Custom Search ID | `...` |
| `SECRET_KEY` | JWT Secret | `openssl rand -hex 32` |

### Frontend (`newsguard-frontend/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |

---

## 2. Docker Deployment (Recommended)

The easiest way to run the entire stack is using Docker Compose.

### Quick Start
1. Ensure you have Docker and Docker Compose installed.
2. Create a root `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-newsguard}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build: ./newsguard-backend
    environment:
      - DATABASE_URL=postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8000:8000"

  frontend:
    build: ./newsguard-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

3. Run: `docker-compose up --build -d`

---

## 3. Cloud Platforms (SaaS)

### Frontend (Vercel)
1. Push your code to GitHub.
2. Connect your repo to [Vercel](https://vercel.com).
3. Set the **Root Directory** to `newsguard-frontend`.
4. Add the `NEXT_PUBLIC_API_URL` environment variable.
5. Deploy!

### Backend (Railway/Render)
1. Create a new project on [Railway](https://railway.app).
2. Connect your repo.
3. Set the **Root Directory** to `newsguard-backend`.
4. Add all backend environment variables.
5. Railway will automatically detect the `Dockerfile` or `requirements.txt`.

### Database (Supabase/Managed)
1. Create a PostgreSQL project on [Supabase](https://supabase.com).
2. Copy the **Transaction Connection String**.
3. Update your backend `DATABASE_URL` or `POSTGRES_*` variables.
4. Run migrations: `python init_db.py` (locally or via CI/CD).

---

## 4. AI Configuration

### Using Groq (Production)
- Obtain a key from [Groq Console](https://console.groq.com).
- Set `GROQ_API_KEY` in your environment.
- The system defaults to `llama-3.3-70b-versatile`.

### Using Ollama (Local Development)
- Install [Ollama](https://ollama.ai).
- Pull the model: `ollama pull llama3.2`.
- Ensure Ollama is running (`127.0.0.1:11434`).
- Set `OLLAMA_BASE_URL=http://host.docker.internal:11434` if running in Docker.

---

## 5. Troubleshooting

### Database Connection Errors
- Ensure the database is running and accessible.
- Check if the connection string uses `asyncpg` for FastAPI: `postgresql+asyncpg://...`

### CORS Issues
- Update `BACKEND_CORS_ORIGINS` in the backend `.env` to include your production frontend URL (e.g., `https://newsguard-ai.vercel.app`).

### AI Response Latency
- Groq is recommended for production due to its high speed.
- Local Ollama performance depends on your machine's hardware (GPU recommended).

---

<div align="center">
  <p>For more help, open an issue in the <a href="https://github.com/yourusername/NewsGuard-AI">GitHub Repository</a>.</p>
</div>
