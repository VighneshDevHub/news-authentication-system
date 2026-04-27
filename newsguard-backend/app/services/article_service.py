from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.saved_article import SavedArticle

class ArticleService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_article(self, user_id: int, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = payload.get("article_url")
        title = payload.get("article_title")
        if not url or not title:
            raise ValueError("URL and title are required")

        existing_stmt = select(SavedArticle).where(
            SavedArticle.user_id == user_id,
            SavedArticle.article_url == url
        )
        existing = (await self.db.execute(existing_stmt)).scalar_one_or_none()
        if existing:
            return {"message": "Article already saved", "saved": True}

        saved = SavedArticle(
            user_id=user_id,
            article_url=url,
            article_title=title,
            article_content=payload.get("article_content"),
            article_source=payload.get("article_source"),
            image_url=payload.get("image_url"),
        )
        self.db.add(saved)
        await self.db.commit()
        await self.db.refresh(saved)
        return {"message": "Article saved", "saved": True, "id": saved.id}
