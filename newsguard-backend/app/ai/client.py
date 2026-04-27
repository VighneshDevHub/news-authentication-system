from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class LLMProvider(ABC):
    """
    Abstract Base Class for LLM Providers.
    This allows switching between Ollama, OpenAI, Anthropic, etc.
    without changing business logic.
    """

    @abstractmethod
    async def extract_search_queries(self, text: str, count: int = 3) -> List[str]:
        """
        Extracts search queries/headlines from the given text.
        """
        pass

    @abstractmethod
    async def verify_authenticity(self, original_text: str, source_articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compares the original text with source articles to verify authenticity.
        Returns a structured dictionary with scores and findings.
        """
        pass
