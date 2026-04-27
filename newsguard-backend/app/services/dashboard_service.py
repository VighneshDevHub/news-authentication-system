from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.analysis import AnalysisResult
from app.models.saved_article import SavedArticle
from app.models.search_query import SearchQuery
from typing import Dict, Any, List

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stats(self, user_id: int = None) -> Dict[str, int]:
        # Verifications Count
        v_stmt = select(func.count(AnalysisResult.id))
        if user_id:
            v_stmt = v_stmt.where(AnalysisResult.user_id == user_id)
        v_count = (await self.db.execute(v_stmt)).scalar() or 0

        # Saved Articles Count
        sa_stmt = select(func.count(SavedArticle.id))
        if user_id:
            sa_stmt = sa_stmt.where(SavedArticle.user_id == user_id)
        sa_count = (await self.db.execute(sa_stmt)).scalar() or 0

        # Search Queries Count
        sq_stmt = select(func.count(SearchQuery.id))
        if user_id:
            sq_stmt = sq_stmt.where(SearchQuery.user_id == user_id)
        sq_count = (await self.db.execute(sq_stmt)).scalar() or 0

        return {
            "verifications_count": v_count,
            "saved_articles_count": sa_count,
            "search_queries_count": sq_count
        }

    async def get_history(self, user_id: int = None) -> Dict[str, List[Any]]:
        # Verification History
        v_stmt = select(AnalysisResult).order_by(AnalysisResult.created_at.desc()).limit(10)
        if user_id:
            v_stmt = v_stmt.where(AnalysisResult.user_id == user_id)
        v_results = (await self.db.execute(v_stmt)).scalars().all()

        verification_history = [
            {
                "id": r.id,
                "date": r.created_at,
                "score": r.authenticity_score,
                "text": r.original_text[:100] + "..." if len(r.original_text) > 100 else r.original_text,
                "verdict": r.verdict
            }
            for r in v_results
        ]

        # Saved Articles
        sa_stmt = select(SavedArticle).order_by(SavedArticle.saved_at.desc()).limit(10)
        if user_id:
            sa_stmt = sa_stmt.where(SavedArticle.user_id == user_id)
        sa_results = (await self.db.execute(sa_stmt)).scalars().all()
        saved_articles = [
            {
                "id": r.id,
                "title": r.article_title,
                "url": r.article_url,
                "date": r.saved_at
            }
            for r in sa_results
        ]

        # Search History
        sq_stmt = select(SearchQuery).order_by(SearchQuery.created_at.desc()).limit(10)
        if user_id:
            sq_stmt = sq_stmt.where(SearchQuery.user_id == user_id)
        sq_results = (await self.db.execute(sq_stmt)).scalars().all()
        search_history = [
            {
                "id": r.id,
                "query": r.query_text,
                "date": r.created_at
            }
            for r in sq_results
        ]

        return {
            "verification_history": verification_history,
            "saved_articles": saved_articles,
            "search_history": search_history
        }
