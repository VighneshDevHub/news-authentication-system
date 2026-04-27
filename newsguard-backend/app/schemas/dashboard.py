from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class StatsResponse(BaseModel):
    verifications_count: int
    saved_articles_count: int
    search_queries_count: int

class HistoryItem(BaseModel):
    id: int
    date: datetime
    score: int
    text: str
    verdict: str

class DashboardHistoryResponse(BaseModel):
    verification_history: List[HistoryItem]
    saved_articles: List[Dict[str, Any]]
    search_history: List[Dict[str, Any]]
