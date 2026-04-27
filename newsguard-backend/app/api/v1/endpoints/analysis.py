from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.analysis import AnalysisRequest, AnalysisResponse
from app.services.analysis_service import AnalysisService
from app.ai.groq_provider import GroqProvider
from app.ai.ollama_provider import OllamaProvider
from app.core.config import settings

router = APIRouter()

@router.post("/", response_model=AnalysisResponse)
async def analyze_article(
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze a news article text for authenticity.
    """
    if not request.text:
        raise HTTPException(status_code=400, detail="Text is required")

    # Dependency Injection for AI Provider
    # Prefer Groq if API key is provided, otherwise fallback to Ollama
    if settings.GROQ_API_KEY:
        ai_provider = GroqProvider()
    else:
        ai_provider = OllamaProvider()
    
    service = AnalysisService(db, ai_provider)
    
    try:
        result = await service.analyze_article(request.text)
        return result
    except Exception as e:
        print(f"Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
