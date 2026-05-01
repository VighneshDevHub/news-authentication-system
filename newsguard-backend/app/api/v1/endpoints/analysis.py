from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
import json
import asyncio

from app.db.session import get_db
from app.schemas.analysis import AnalysisRequest, AnalysisResponse, BiasRequest, BiasResponse
from app.services.analysis_service import AnalysisService
from app.ai.groq_provider import GroqProvider
from app.models.analysis import AnalysisResult
from app.models.user import User
from app.api import deps

router = APIRouter()

def get_ai_provider():
    return GroqProvider()

@router.post("/", response_model=AnalysisResponse)
async def analyze_article(
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Analyze a news article by text or URL."""
    if not request.text and not request.url:
        raise HTTPException(status_code=400, detail="Either text or url is required")

    service = AnalysisService(db, get_ai_provider())
    return await service.analyze_article(
        text=request.text or "", 
        url=request.url,
        user_id=current_user.id
    )

@router.post("/stream")
async def analyze_article_stream(
    request: AnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """Analyze a news article with a streaming response for real-time progress."""
    if not request.text and not request.url:
        raise HTTPException(status_code=400, detail="Either text or url is required")

    async def event_generator():
        service = AnalysisService(db, get_ai_provider())
        async for update in service.analyze_article_stream(
            text=request.text or "", 
            url=request.url,
            user_id=current_user.id
        ):
            yield f"data: {json.dumps(update)}\n\n"
            # Small delay to ensure client can process events smoothly
            await asyncio.sleep(0.1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.post("/bias", response_model=BiasResponse)
async def analyze_bias(
    request: BiasRequest,
    db: AsyncSession = Depends(get_db)
):
    """Run bias-only analysis on a piece of text."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    service = AnalysisService(db, get_ai_provider())
    return await service.analyze_bias_only(request.text)

@router.get("/{analysis_id}")
async def get_analysis(
    analysis_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a past analysis result by ID."""
    result = await db.execute(select(AnalysisResult).where(AnalysisResult.id == analysis_id))
    analysis = result.scalars().first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {
        "id": analysis.id,
        "score": analysis.authenticity_score,
        "verdict": analysis.verdict,
        "category": analysis.category,
        "text": analysis.original_text,
        "result": analysis.details,
        "bias": analysis.bias_details,
        "related_articles": analysis.related_articles,
        "created_at": analysis.created_at
    }
