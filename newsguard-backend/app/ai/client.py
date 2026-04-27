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
    async def extract_claims(self, text: str) -> Dict[str, Any]:
        """Extracts factual claims from the text."""
        pass

    @abstractmethod
    async def cross_reference(self, claims: List[str], source_articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Cross-references claims with sources."""
        pass

    @abstractmethod
    async def get_final_verdict(self, original_text: str, verification_results: List[Dict[str, Any]], bias_result: Dict[str, Any]) -> Dict[str, Any]:
        """Generates the final verdict."""
        pass

    @abstractmethod
    async def chat(self, message: str, context: Optional[str] = None, history: Optional[List[Dict[str, str]]] = None) -> str:
        """AI Assistant chat functionality."""
        pass

    @abstractmethod
    async def detect_bias(self, text: str) -> Dict[str, Any]:
        """
        Analyzes the text for bias.
        Returns a structured dictionary with bias scores and details.
        """
        pass