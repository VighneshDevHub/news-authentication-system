from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case
from app.models.analysis import AnalysisResult
from app.models.saved_article import SavedArticle
from app.models.search_query import SearchQuery
from typing import Dict, Any, List

class DashboardService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_stats(self, user_id: int = None, days: int = 7) -> Dict[str, Any]:
        # Verifications Count & Average Score
        v_stmt = select(
            func.count(AnalysisResult.id),
            func.avg(AnalysisResult.authenticity_score)
        )
        if user_id:
            v_stmt = v_stmt.where(AnalysisResult.user_id == user_id)
        v_res = (await self.db.execute(v_stmt)).first()
        v_count = v_res[0] or 0
        avg_score = round(float(v_res[1] or 0))

        # Activity Data
        from datetime import datetime, timedelta
        start_date = datetime.utcnow() - timedelta(days=days)
        activity_stmt = select(
            func.date(AnalysisResult.created_at).label("date"),
            func.count(AnalysisResult.id).label("count")
        ).where(AnalysisResult.created_at >= start_date)
        if user_id:
            activity_stmt = activity_stmt.where(AnalysisResult.user_id == user_id)
        activity_stmt = activity_stmt.group_by("date").order_by("date")
        activity_results = (await self.db.execute(activity_stmt)).all()
        activity_data = [{"date": str(r[0]), "scans": r[1]} for r in activity_results]

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

        # Categories distribution
        cat_stmt = select(AnalysisResult.category, func.count(AnalysisResult.id)).group_by(AnalysisResult.category)
        if user_id:
            cat_stmt = cat_stmt.where(AnalysisResult.user_id == user_id)
        cat_results = (await self.db.execute(cat_stmt)).all()
        by_category = [{"name": r[0] or "General", "value": r[1]} for r in cat_results]

        # Score distribution
        score_stmt = select(
            case(
                (AnalysisResult.authenticity_score >= 80, "Credible"),
                (AnalysisResult.authenticity_score >= 50, "Needs Review"),
                else_="Misinformation"
            ).label("status"),
            func.count(AnalysisResult.id)
        ).group_by("status")
        if user_id:
            score_stmt = score_stmt.where(AnalysisResult.user_id == user_id)
        score_results = (await self.db.execute(score_stmt)).all()
        by_score = [{"name": r[0], "count": r[1]} for r in score_results]

        return {
            "verifications_count": v_count,
            "saved_articles_count": sa_count,
            "search_queries_count": sq_count,
            "average_score": avg_score,
            "activity_data": activity_data,
            "by_category": by_category,
            "by_score": by_score
        }

    async def get_history(
        self, 
        user_id: int = None, 
        category: str = None, 
        min_score: int = None,
        limit: int = 10
    ) -> Dict[str, List[Any]]:
        # Verification History
        v_stmt = select(AnalysisResult).order_by(AnalysisResult.created_at.desc())
        
        if user_id:
            v_stmt = v_stmt.where(AnalysisResult.user_id == user_id)
        if category:
            v_stmt = v_stmt.where(AnalysisResult.category == category)
        if min_score is not None:
            v_stmt = v_stmt.where(AnalysisResult.authenticity_score >= min_score)
            
        v_stmt = v_stmt.limit(limit)
        v_results = (await self.db.execute(v_stmt)).scalars().all()

        verification_history = [
            {
                "id": r.id,
                "date": r.created_at,
                "score": r.authenticity_score,
                "category": r.category,
                "relevance": r.relevance_score,
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
