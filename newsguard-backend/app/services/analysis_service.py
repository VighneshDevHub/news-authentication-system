import hashlib
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.search_service import SearchService
from app.services.scraper_service import ScraperService
from app.ai.client import LLMProvider
from app.models.analysis import AnalysisResult

class AnalysisService:
    def __init__(self, db: AsyncSession, llm_provider: LLMProvider):
        self.db = db
        self.llm = llm_provider

    async def analyze_article(self, text: str, user_id: int = None, url: Optional[str] = None) -> Dict[str, Any]:
        # If URL provided, scrape it first to get the text
        if url and not text.strip():
            print(f"Scraping URL: {url}")
            scraped = await ScraperService.fetch_multiple([url])
            if scraped and scraped[0].get("content"):
                text = scraped[0]["content"]
            else:
                text = url  # fallback

        # 1. Extract Keywords
        queries = await self.llm.extract_search_queries(text)
        if not queries:
            queries = [text[:100]]

        # 2. Search Google - using all extracted queries for maximum coverage
        search_urls = set()
        for q in queries:
            urls = await SearchService.google_search(q, num_results=5)
            search_urls.update(urls)
        
        # Prioritize diverse sources (first result from each query)
        diverse_urls = []
        for q in queries:
            urls = await SearchService.google_search(q, num_results=2)
            for u in urls:
                if u not in diverse_urls:
                    diverse_urls.append(u)
        
        unique_urls = list(dict.fromkeys(diverse_urls + list(search_urls)))[:8]

        # 3. Scrape Content
        verified_articles = await ScraperService.fetch_multiple(unique_urls)

        # 4. Multi-Stage Verification
        # Stage 4.1: Extract Claims
        claims_data = await self.llm.extract_claims(text)
        claims = claims_data.get("claims", [])
        category = claims_data.get("category", "General")

        # Stage 4.2: Cross-Reference
        verification_results = await self.llm.cross_reference(claims, verified_articles)

        # Stage 4.3: Bias Detection
        bias_result = await self.llm.detect_bias(text)

        # Stage 4.4: Final Verdict
        analysis_result = await self.llm.get_final_verdict(text, verification_results, bias_result)

        # 5. Save Result
        db_result = await self.save_result(text, analysis_result, user_id, category)

        return {
            "id": db_result.id,
            "score": db_result.authenticity_score,
            "category": category,
            "result": analysis_result,
            "bias": bias_result,
            "key_points": queries,
            "related_articles": verified_articles,
            "relevance_score": analysis_result.get("relevance_score", 0)
        }

    async def analyze_bias_only(self, text: str) -> Dict[str, Any]:
        """Lightweight bias-only analysis without full verification pipeline."""
        return await self.llm.detect_bias(text)

    async def save_result(self, text: str, analysis: Dict[str, Any], user_id: int = None, category: str = "General") -> AnalysisResult:
        text_hash = hashlib.md5(text.encode()).hexdigest()
        score = analysis.get("authenticity_score", 0)
        relevance = analysis.get("relevance_score", 0)
        verdict = "Highly Credible" if score >= 80 else ("Needs Verification" if score >= 50 else "Likely Misinformation")

        result_entry = AnalysisResult(
            user_id=user_id,
            original_text=text,
            original_text_hash=text_hash,
            authenticity_score=score,
            verdict=verdict,
            category=category,
            relevance_score=relevance,
            details=analysis
        )

        self.db.add(result_entry)
        await self.db.commit()
        await self.db.refresh(result_entry)
        return result_entry
