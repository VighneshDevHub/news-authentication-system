# NewsGuard-AI Deployment Guide

## Infrastructure Overview
- **Frontend**: Next.js (Vercel/Self-hosted)
- **Backend**: FastAPI (Docker/Kubernetes)
- **Database**: PostgreSQL with JSONB support
- **AI Engine**: Groq/OpenAI/Anthropic via abstract provider

## 1. Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+

## 2. Deployment Steps

### 2.1 Backend Deployment
1. Build the Docker image:
   ```bash
   docker build -t newsguard-backend ./newsguard-backend
   ```
2. Run migrations:
   ```bash
   docker exec newsguard-backend alembic upgrade head
   ```
3. Start the container:
   ```bash
   docker-compose up -d backend
   ```

### 2.2 Frontend Deployment
1. Install dependencies:
   ```bash
   cd newsguard-frontend && npm install
   ```
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm run start
   ```

## 3. Rollback Procedures

### 3.1 Code Rollback
If a deployment fails, revert to the previous stable git tag:
```bash
git checkout tags/v1.2.0
docker-compose up -d --build
```

### 3.2 Database Rollback
Revert the last migration:
```bash
docker exec newsguard-backend alembic downgrade -1
```

## 4. Monitoring & Maintenance
- **Logs**: Centralized logging via ELK stack or CloudWatch.
- **Health Checks**: `/health` endpoint monitored every 60s.
- **Backups**: Daily automated snapshots of the PostgreSQL database.
