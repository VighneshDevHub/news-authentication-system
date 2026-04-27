import json
import ollama
from typing import List, Dict, Any
from app.ai.client import LLMProvider
from app.core.config import settings
from app.ai.prompts import extract_queries_prompt, verify_authenticity_prompt

class OllamaProvider(LLMProvider):
    def __init__(self, model: str = settings.OLLAMA_MODEL):
        self.model = model
        self.client = ollama.AsyncClient(host=settings.OLLAMA_BASE_URL)

    async def extract_search_queries(self, text: str, count: int = 3) -> List[str]:
        prompt = extract_queries_prompt(text[:2000], count)

        try:
            response = await self.client.chat(model=self.model, messages=[{"role": "user", "content": prompt}], format="json")
            
            content = response.get('message', {}).get('content', '{}')
            data = json.loads(content)
            return data.get("queries", [])
        except Exception as e:
            print(f"Error extracting queries: {e}")
            return []

    async def verify_authenticity(self, original_text: str, source_articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        prompt = verify_authenticity_prompt(original_text[:2000], source_articles)

        try:
            response = await self.client.chat(model=self.model, messages=[{"role": "user", "content": prompt}], format="json")
            
            content = response.get('message', {}).get('content', '{}')
            return json.loads(content)
        except Exception as e:
            print(f"Error verifying authenticity: {e}")
            return {
                "authenticity_score": 0,
                "key_findings": ["Analysis failed due to an error."],
                "error": str(e)
            }
