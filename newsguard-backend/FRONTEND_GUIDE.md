# Frontend Integration Guide

This guide explains how to connect your existing frontend (HTML/JS or Next.js) to the new FastAPI backend.

## 1. Update API Base URL
In your frontend configuration or `config.js`, update the backend URL:

**Old (Flask):**
```javascript
const API_BASE_URL = "http://localhost:5000";
```

**New (FastAPI):**
```javascript
const API_BASE_URL = "http://localhost:8000/api/v1";
```

## 2. Update Analysis Call
The endpoint structure has changed slightly to be more standard.

**Old JavaScript Code:**
```javascript
async function analyzeNews(text) {
    const response = await fetch('/extract', {
        method: 'POST',
        body: JSON.stringify({ news: text })
    });
    // ... then call /search ...
    // ... then call /results ...
}
```

**New JavaScript Code:**
```javascript
async function analyzeNews(text) {
    try {
        const response = await fetch(`${API_BASE_URL}/analysis/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text }) // Note: key is "text", not "news"
        });

        if (!response.ok) throw new Error('Analysis failed');

        const data = await response.json();
        
        // Update UI with the full result directly
        displayScore(data.score);
        displayFindings(data.result.key_findings);
        displayEvidence(data.result.supporting_evidence);
        
    } catch (error) {
        console.error("Error:", error);
    }
}
```

## 3. Key Changes
*   **Single Request**: You no longer need to chain 3 requests (`/extract` -> `/search` -> `/results`). The new backend handles the entire pipeline in **one single async request**.
*   **Response Format**: The response is a single JSON object containing everything you need (score, evidence, breakdown).
*   **CORS**: The backend is already configured to allow `localhost:3000` (React/Next.js) and other origins. If you have issues, check `BACKEND_CORS_ORIGINS` in `.env`.

## 4. Migration Checklist
- [ ] Ensure backend is running on port 8000.
- [ ] Update fetch URLs in your JS files.
- [ ] Update payload keys (use `text` instead of `news`).
- [ ] Remove client-side orchestration logic (the backend does it now).
