import hashlib
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.search_service import SearchService
from app.services.scraper_service import ScraperService
from app.ai.client import LLMProvider
from app.models.analysis import AnalysisResult

class AnalysisService:
    def __init__(self, db: AsyncSession, llm_provider: LLMProvider):
        self.db = db
        self.llm = llm_provider

    async def analyze_article(self, text: str, user_id: int = None) -> Dict[str, Any]:
        """
        Orchestrates the full analysis flow:
        1. Extract Keywords (AI)
        2. Search Google (External)
        3. Scrape Content (External)
        4. Verify Authenticity (AI)
        5. Save Result (DB)
        """
        
        # 1. Extract Keywords
        print("Extracting keywords...")
        queries = await self.llm.extract_search_queries(text)
        if not queries:
            # Fallback if AI fails: use first few words
            queries = [text[:50]]
        
        # 2. Search Google (Use first query for now to save API calls)
        print(f"Searching for: {queries[0]}")
        urls = await SearchService.google_search(queries[0])
        
        # 3. Scrape Content
        print(f"Scraping {len(urls)} articles...")
        verified_articles = await ScraperService.fetch_multiple(urls[:3]) # Limit to top 3
        
        # 4. Verify Authenticity
        print("Verifying authenticity...")
        analysis_result = await self.llm.verify_authenticity(text, verified_articles)
        
        # 5. Save Result
        print("Saving result...")
        db_result = await self.save_result(text, analysis_result, user_id)
        
        return {
            "id": db_result.id,
            "score": db_result.authenticity_score,
            "result": analysis_result,
            "key_points": queries,
            "related_articles": verified_articles
        }

    async def save_result(self, text: str, analysis: Dict[str, Any], user_id: int = None) -> AnalysisResult:
        text_hash = hashlib.md5(text.encode()).hexdigest()
        
        result_entry = AnalysisResult(
            user_id=user_id,
            original_text=text,
            original_text_hash=text_hash,
            authenticity_score=analysis.get("authenticity_score", 0),
            verdict="Authentic" if analysis.get("authenticity_score", 0) > 70 else "Suspicious",
            details=analysis
        )
        
        self.db.add(result_entry)
        await self.db.commit()
        await self.db.refresh(result_entry)
        return result_entry
