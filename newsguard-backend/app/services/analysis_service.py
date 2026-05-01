import hashlib
import json
import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.search_service import SearchService
from app.services.scraper_service import ScraperService
from app.ai.client import LLMProvider
from app.models.analysis import AnalysisResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AnalysisService:
    def __init__(self, db: AsyncSession, llm_provider: LLMProvider):
        self.db = db
        self.llm = llm_provider

    async def analyze_article(self, text: str, user_id: int = None, url: Optional[str] = None) -> Dict[str, Any]:
        # If URL provided, scrape it first to get the text
        if url and not text.strip():
            logger.info(f"--- STAGE 0: Scraping Input URL: {url} ---")
            scraped = await ScraperService.fetch_multiple([url])
            if scraped and scraped[0].get("content"):
                text = scraped[0]["content"]
                logger.info(f"Successfully scraped input text (Length: {len(text)})")
            else:
                text = url  # fallback
                logger.warning("Failed to scrape input URL, using URL as text")

        # 1. Extract Keywords
        logger.info("--- STAGE 1: Extracting Search Queries ---")
        queries = await self.llm.extract_search_queries(text, count=4)
        if not queries:
            queries = [text[:100]]
        logger.info(f"Queries Generated: {queries}")

        # 2. Search Google - using all extracted queries for maximum coverage
        logger.info("--- STAGE 2: Searching Google ---")
        search_urls = set()
        diverse_urls = []
        
        # Reputable news and fact-checking domains to prioritize
        REPUTABLE_DOMAINS = [
            'reuters.com', 'apnews.com', 'bbc.com', 'nytimes.com', 'wsj.com', 
            'snopes.com', 'politifact.com', 'factcheck.org', 'fullfact.org',
            'theguardian.com', 'aljazeera.com', 'npr.org', 'bloomberg.com'
        ]

        for q in queries:
            urls = await SearchService.google_search(q, num_results=6)
            logger.info(f"Search for '{q}' found {len(urls)} results")
            
            # Sort URLs to prioritize reputable domains
            sorted_urls = sorted(
                urls, 
                key=lambda u: any(domain in u.lower() for domain in REPUTABLE_DOMAINS), 
                reverse=True
            )
            
            for u in sorted_urls:
                if u not in diverse_urls:
                    diverse_urls.append(u)
            
            search_urls.update(urls)
        
        # Selection logic: prioritize diversity and reputation
        unique_urls = []
        
        # First, pick one reputable source from each query if available
        for q_idx in range(len(queries)):
            for u in diverse_urls:
                if any(domain in u.lower() for domain in REPUTABLE_DOMAINS) and u not in unique_urls:
                    unique_urls.append(u)
                    break
        
        # Then fill up the rest with other diverse results
        for u in diverse_urls:
            if len(unique_urls) >= 10:
                break
            if u not in unique_urls:
                unique_urls.append(u)
        
        unique_urls = unique_urls[:10]
        logger.info(f"Final URL List for Scraping: {unique_urls}")

        # 3. Scrape Content
        logger.info("--- STAGE 3: Scraping Search Results ---")
        verified_articles = await ScraperService.fetch_multiple(unique_urls)
        logger.info(f"Successfully scraped {len(verified_articles)} articles")

        # 4. Multi-Stage Verification
        # Stage 4.1: Extract Claims
        logger.info("--- STAGE 4.1: Extracting Claims from Input ---")
        claims_data = await self.llm.extract_claims(text)
        claims = claims_data.get("claims", [])
        category = claims_data.get("category", "General")
        logger.info(f"Claims Extracted: {claims}")

        # Stage 4.2: Cross-Reference
        logger.info("--- STAGE 4.2: Cross-Referencing Claims with Sources ---")
        verification_results = await self.llm.cross_reference(claims, verified_articles)
        logger.info(f"Cross-Reference results ready (count: {len(verification_results)})")

        # Stage 4.3: Bias Detection
        logger.info("--- STAGE 4.3: Detecting Bias ---")
        bias_result = await self.llm.detect_bias(text)
        logger.info(f"Bias Analysis: {bias_result.get('overall_bias_score')}% bias detected")

        # Stage 4.4: Final Verdict
        logger.info("--- STAGE 4.4: Generating Final Verdict ---")
        analysis_result = await self.llm.get_final_verdict(text, verification_results, bias_result)
        logger.info(f"Final Authenticity Score: {analysis_result.get('authenticity_score')}/100")

        # 5. Save Result
        logger.info("--- STAGE 5: Saving to Database ---")
        db_result = await self.save_result(
            text=text, 
            analysis=analysis_result, 
            user_id=user_id, 
            category=category,
            bias_details=bias_result,
            related_articles=verified_articles
        )
        logger.info(f"Result saved with ID: {db_result.id}")

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

    async def save_result(
        self, 
        text: str, 
        analysis: Dict[str, Any], 
        user_id: int = None, 
        category: str = "General",
        bias_details: Dict[str, Any] = None,
        related_articles: List[Dict[str, Any]] = None
    ) -> AnalysisResult:
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
            details=analysis,
            bias_details=bias_details or {},
            related_articles=related_articles or []
        )

        self.db.add(result_entry)
        await self.db.commit()
        await self.db.refresh(result_entry)
        return result_entry
