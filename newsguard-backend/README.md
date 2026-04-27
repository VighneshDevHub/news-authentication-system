<div align="center">

# 🛡️ NewsGuard AI — Backend

**Production-grade async REST API for AI-powered news verification**

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-red)](https://www.sqlalchemy.org/)
[![Groq](https://img.shields.io/badge/Groq-LLM-orange)](https://groq.com/)

</div>

---

## 📖 Overview

The NewsGuard AI backend is a fully asynchronous REST API built with **FastAPI** and **SQLAlchemy 2.0**. It orchestrates multiple AI providers, real-time web search, and content scraping to deliver comprehensive news authenticity analysis.

### Core Capabilities

- **Multi-provider AI**: Groq cloud LLM with Ollama local fallback
- **Real-time Search**: Google Custom Search API integration
- **Content Scraping**: Intelligent article extraction with trafilatura
- **Async Architecture**: Non-blocking I/O for high throughput
- **JWT Auth**: Secure token-based authentication
- **Auto Docs**: Swagger UI and ReDoc out of the box

---

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 14+ running locally or via Docker
- Groq API key ([get one free](https://console.groq.com))
- Google Custom Search API key ([setup guide](https://developers.google.com/custom-search/v1/overview))

### 2. Setup

```bash
cd newsguard-backend

# Create virtual environment
python -m venv venv

# Activate
.\venv\Scripts\Activate    # Windows
source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Create database tables
python init_db.py

# Start server
uvicorn main:app --reload
```

**API:** http://localhost:8000  
**Swagger UI:** http://localhost:8000/api/v1/docs  
**ReDoc:** http://localhost:8000/api/v1/redoc

---

## ⚙️ Configuration

All configuration is managed via environment variables. Copy `.env.example` to `.env` and fill in your values:

```env
# ─── Project ──────────────────────────────────────────────
PROJECT_NAME="NewsGuard AI"
API_V1_STR="/api/v1"

# ─── CORS ─────────────────────────────────────────────────
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:8000

# ─── Database ─────────────────────────────────────────────
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=newsguard

# ─── AI: Groq (Cloud) ─────────────────────────────────────
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# ─── AI: Ollama (Local Fallback) ──────────────────────────
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:latest

# ─── Google Custom Search ─────────────────────────────────
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_cse_id

# ─── Security ─────────────────────────────────────────────
SECRET_KEY=run_openssl_rand_hex_32_to_generate
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 📂 Project Structure

```
newsguard-backend/
├── app/
│   ├── ai/                         # AI provider layer
│   │   ├── client.py               # Provider factory & routing
│   │   ├── groq_provider.py        # Groq cloud LLM integration
│   │   ├── ollama_provider.py      # Ollama local LLM integration
│   │   └── prompts.py              # Structured LLM prompts
│   │
│   ├── api/                        # HTTP layer
│   │   ├── deps.py                 # Dependency injection (auth, db)
│   │   └── v1/
│   │       ├── router.py           # Route aggregator
│   │       └── endpoints/
│   │           ├── analysis.py     # POST /analysis/
│   │           ├── articles.py     # GET /articles/
│   │           ├── auth.py         # POST /auth/signup, /auth/login
│   │           ├── dashboard.py    # GET /dashboard/stats, /dashboard/history
│   │           └── saved.py        # CRUD /saved/
│   │
│   ├── core/                       # Application core
│   │   ├── config.py               # Pydantic settings
│   │   └── security.py             # JWT creation, password hashing
│   │
│   ├── db/                         # Database layer
│   │   ├── base.py                 # Imports all models (for Alembic)
│   │   ├── base_class.py           # Declarative base
│   │   └── session.py              # Async engine & session factory
│   │
│   ├── models/                     # SQLAlchemy ORM models
│   │   ├── user.py                 # User table
│   │   ├── analysis.py             # Analysis results
│   │   ├── saved_article.py        # User saved articles
│   │   ├── search_query.py         # Search query log
│   │   ├── user_history.py         # Verification history
│   │   └── verification_result.py  # Detailed results
│   │
│   ├── schemas/                    # Pydantic request/response models
│   │   ├── user.py
│   │   ├── analysis.py
│   │   ├── article.py
│   │   ├── dashboard.py
│   │   ├── saved_article.py
│   │   └── token.py
│   │
│   └── services/                   # Business logic layer
│       ├── analysis_service.py     # Orchestrates full verification pipeline
│       ├── article_service.py      # Article CRUD operations
│       ├── dashboard_service.py    # Stats aggregation
│       ├── scraper_service.py      # Web content extraction
│       └── search_service.py       # Google CSE integration
│
├── tests/                          # Test suite
├── main.py                         # FastAPI app entry point
├── init_db.py                      # Database initialization script
├── requirements.txt                # Python dependencies
├── .env.example                    # Environment template
└── .gitignore
```

---

## 📡 API Reference

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/auth/signup` | Register new user | ❌ |
| `POST` | `/auth/login` | Get JWT access token | ❌ |

#### `POST /auth/signup`

```json
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}

// Response 200
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_active": true
}
```

#### `POST /auth/login`

```
// Request (form-data)
username=user@example.com
password=SecurePass123!

// Response 200
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Analysis Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/analysis/` | Analyze news text | ❌ |

#### `POST /analysis/`

```json
// Request
{
  "text": "Scientists discover new water source on Mars according to NASA."
}

// Response 200
{
  "id": 42,
  "score": 85,
  "key_points": ["NASA Mars mission", "Water discovery claim"],
  "related_articles": [
    {
      "title": "NASA Rover Finds Water Evidence",
      "url": "https://nasa.gov/article",
      "source": "NASA",
      "snippet": "Perseverance rover detected..."
    }
  ],
  "result": {
    "authenticity_score": 85,
    "key_findings": [
      "Claim partially verified by NASA press releases",
      "Water evidence found but context overstated"
    ],
    "differences": [
      "Original claim overstates discovery significance"
    ],
    "supporting_evidence": [
      {
        "quote": "Perseverance detected mineral deposits consistent with ancient water",
        "source": "NASA JPL Official"
      }
    ],
    "score_breakdown": {
      "factual_accuracy": 90,
      "source_consistency": 85,
      "detail_accuracy": 80,
      "context_accuracy": 85
    }
  }
}
```

---

### Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/dashboard/stats` | User statistics | ✅ |
| `GET` | `/dashboard/history` | Verification history | ✅ |

#### `GET /dashboard/stats`

```json
// Response 200
{
  "verifications_count": 42,
  "saved_articles_count": 15,
  "search_queries_count": 128
}
```

---

### Saved Articles Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/saved/` | List saved articles | ✅ |
| `POST` | `/saved/` | Save an article | ✅ |
| `DELETE` | `/saved/{id}` | Delete saved article | ✅ |

---

## 🧠 AI Verification Pipeline

The analysis pipeline runs in 4 stages:

```
1. EXTRACT QUERIES
   Input text → LLM → 3 targeted search queries

2. WEB SEARCH
   Queries → Google CSE → Top 5 relevant articles per query

3. CONTENT SCRAPING
   Article URLs → trafilatura → Clean article text

4. VERIFICATION
   Original text + scraped sources → LLM → Structured JSON result
   {authenticity_score, key_findings, differences, supporting_evidence, score_breakdown}
```

### LLM Prompt Design

The verification prompt instructs the model to act as a professional fact-checker and return a strictly structured JSON response with:

- `authenticity_score` (0-100)
- `key_findings` (list of factual observations)
- `differences` (discrepancies found)
- `supporting_evidence` (quotes with sources)
- `score_breakdown` (4 sub-scores)

---

## 🔐 Security

- **Password Hashing**: bcrypt via passlib (pinned to `bcrypt<4.0.0` for passlib compatibility)
- **JWT Tokens**: HS256 algorithm via python-jose
- **CORS**: Configured for frontend origin only
- **Input Validation**: Pydantic schemas on all endpoints
- **SQL Injection**: Prevented by SQLAlchemy ORM

---

## 🧪 Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# Run specific test file
pytest tests/test_analysis.py -v
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | ≥0.100 | Web framework |
| `uvicorn` | ≥0.23 | ASGI server |
| `sqlalchemy` | ≥2.0 | Async ORM |
| `asyncpg` | ≥0.28 | Async PostgreSQL driver |
| `pydantic` | ≥2.0 | Data validation |
| `pydantic-settings` | ≥2.0 | Settings management |
| `groq` | ≥0.9 | Groq LLM client |
| `ollama` | ≥0.1 | Ollama local LLM |
| `trafilatura` | ≥1.6 | Web content extraction |
| `beautifulsoup4` | ≥4.12 | HTML parsing |
| `python-jose` | ≥3.3 | JWT tokens |
| `passlib[bcrypt]` | ≥1.7.4 | Password hashing |
| `bcrypt` | ≥3.2,<4.0 | bcrypt backend |
| `httpx` | ≥0.24 | Async HTTP client |

---

## 🐛 Known Issues & Fixes

### bcrypt + passlib Compatibility

If you see `ValueError: password cannot be longer than 72 bytes`, this is a known incompatibility between `passlib 1.7.4` and `bcrypt 4.x`. The fix is already applied in `requirements.txt`:

```
bcrypt>=3.2.0,<4.0.0
```

If you still encounter it, force reinstall:

```bash
pip install "bcrypt>=3.2.0,<4.0.0" --force-reinstall
```
