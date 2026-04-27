from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnalysisRequest(BaseModel):
    text: Optional[str] = ""
    url: Optional[str] = None  # New: analyze by URL

class BiasRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    id: int
    score: int
    category: Optional[str] = "General"
    result: Dict[str, Any]
    bias: Optional[Dict[str, Any]] = None
    key_points: List[str]
    related_articles: List[Dict[str, Any]]
    relevance_score: Optional[int] = 0

class BiasResponse(BaseModel):
    overall_bias_score: Optional[int] = 0
    bias_direction: Optional[str] = "unknown"
    bias_types: Optional[List[Dict[str, Any]]] = []
    loaded_language: Optional[List[str]] = []
    missing_perspectives: Optional[List[str]] = []
    recommendation: Optional[str] = ""
