# API Documentation

## Base URL
`http://localhost:8000/api/v1`

## Endpoints

### 1. Analyze Article
**POST** `/analysis/`

Analyzes a news text for authenticity by:
1.  Extracting keywords.
2.  Searching Google for verified sources.
3.  Scraping top results.
4.  Comparing the input text against sources using LLM.

**Request Body:**
```json
{
  "text": "The full text of the news article you want to verify...",
  "url": "http://optional-source-url.com"
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "score": 85,
  "result": {
    "authenticity_score": 85,
    "key_findings": [
      "The claim matches reports from BBC and CNN.",
      "The dates mentioned are accurate."
    ],
    "differences": [],
    "supporting_evidence": [
      {
        "quote": "NASA confirmed the discovery...",
        "source": "bbc.com"
      }
    ],
    "score_breakdown": {
      "factual_accuracy": 35,
      "source_consistency": 25,
      "detail_accuracy": 15,
      "context_accuracy": 10
    }
  }
}
```

### 2. Health Check
**GET** `/health`

Returns the system status.

**Response:**
```json
{
  "status": "healthy"
}
```
