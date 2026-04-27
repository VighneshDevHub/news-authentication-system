# NewsGuard AI — Backend

FastAPI backend for the NewsGuard AI news verification system.

## Tech Stack

- **FastAPI** — async REST API
- **SQLAlchemy 2.0** — async ORM
- **PostgreSQL** — primary database
- **Groq** — cloud LLM (llama-3.3-70b-versatile)
- **Ollama** — local LLM fallback (llama3.2)
- **Google Custom Search API** — web search for verification
- **passlib + bcrypt** — password hashing
- **python-jose** — JWT authentication

## Prerequisites

- Python 3.10+
- PostgreSQL running locally or via Docker
- Ollama installed (optional, for local AI)

## Setup

```bash
cd newsguard-backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate        # Windows
source venv/bin/activate       # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values

# Initialize the database
python init_db.py

# Start the server
uvicorn main:app --reload
```

API available at **http://localhost:8000**
Swagger docs at **http://localhost:8000/api/v1/docs**

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PROJECT_NAME="NewsGuard AI"
API_V1_STR="/api/v1"

# CORS
BACKEND_CORS_ORIGINS=http://localhost:3000

# Database
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=newsguard

# AI — Groq (cloud)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# AI — Ollama (local fallback)
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:latest

# Google Custom Search
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_cse_id

# JWT
SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Project Structure

```
app/
├── ai/           # LLM providers (Groq, Ollama) and prompts
├── api/          # Route handlers
│   └── v1/
│       └── endpoints/
│           ├── analysis.py   # News verification
│           ├── articles.py   # Article search
│           ├── auth.py       # Signup / signin
│           ├── dashboard.py  # User stats
│           └── saved.py      # Saved articles
├── core/         # Config and security (JWT, hashing)
├── db/           # Database session and base models
├── models/       # SQLAlchemy ORM models
├── schemas/      # Pydantic request/response schemas
└── services/     # Business logic (analysis, search, scraper)
```

## API Endpoints

| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | `/api/v1/auth/signup`       | Register new user        | No       |
| POST   | `/api/v1/auth/login`        | Get JWT token            | No       |
| POST   | `/api/v1/analysis/`         | Analyze news text        | No       |
| GET    | `/api/v1/dashboard/`        | User stats               | Required |
| GET    | `/api/v1/saved/`            | List saved articles      | Required |
| POST   | `/api/v1/saved/`            | Save an article          | Required |
| DELETE | `/api/v1/saved/{id}`        | Delete saved article     | Required |

## Running Tests

```bash
pytest tests/
```
