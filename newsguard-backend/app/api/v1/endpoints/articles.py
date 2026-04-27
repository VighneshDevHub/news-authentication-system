from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.article import SaveArticleRequest, SaveArticleResponse
from app.services.article_service import ArticleService

router = APIRouter()

@router.post("/save", response_model=SaveArticleResponse)
async def save_article(request: SaveArticleRequest, db: AsyncSession = Depends(get_db)):
    try:
        service = ArticleService(db)
        result = await service.save_article(user_id=request.user_id, payload=request.model_dump())
        return SaveArticleResponse(**result)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
