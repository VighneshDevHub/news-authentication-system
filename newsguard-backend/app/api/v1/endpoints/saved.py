from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.db.session import get_db
from app.models.user import User
from app.models.saved_article import SavedArticle
from app.schemas.saved_article import SavedArticle as SavedArticleSchema, SavedArticleCreate

router = APIRouter()

@router.get("/", response_model=List[SavedArticleSchema])
async def read_saved_articles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve saved articles for the current user.
    """
    result = await db.execute(
        select(SavedArticle)
        .where(SavedArticle.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.post("/", response_model=SavedArticleSchema)
async def create_saved_article(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    article_in: SavedArticleCreate
) -> Any:
    """
    Save a new article.
    """
    db_obj = SavedArticle(
        **article_in.dict(),
        user_id=current_user.id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

@router.delete("/{article_id}", response_model=SavedArticleSchema)
async def delete_saved_article(
    *,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_user),
    article_id: int
) -> Any:
    """
    Delete a saved article.
    """
    result = await db.execute(
        select(SavedArticle)
        .where(SavedArticle.id == article_id, SavedArticle.user_id == current_user.id)
    )
    article = result.scalars().first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await db.delete(article)
    await db.commit()
    return article
