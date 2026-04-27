from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AnalysisRequest(BaseModel):
    text: str
    url: Optional[str] = None

class AnalysisResponse(BaseModel):
    id: int
    score: int
    result: Dict[str, Any]
    key_points: List[str]
    related_articles: List[Dict[str, Any]]
