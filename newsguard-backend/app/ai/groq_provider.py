import json
from groq import AsyncGroq
from typing import List, Dict, Any
from app.ai.client import LLMProvider
from app.core.config import settings
from app.ai.prompts import extract_queries_prompt, verify_authenticity_prompt

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str = settings.GROQ_API_KEY, model: str = settings.GROQ_MODEL):
        self.model = model
        self.client = AsyncGroq(api_key=api_key)

    async def extract_search_queries(self, text: str, count: int = 3) -> List[str]:
        prompt = extract_queries_prompt(text[:2000], count)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            return data.get("queries", [])
        except Exception as e:
            print(f"Error extracting queries with Groq: {e}")
            return []

    async def verify_authenticity(self, original_text: str, source_articles: List[Dict[str, Any]]) -> Dict[str, Any]:
        prompt = verify_authenticity_prompt(original_text[:2000], source_articles)

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            print(f"Error verifying authenticity with Groq: {e}")
            return {
                "authenticity_score": 0,
                "key_findings": ["Analysis failed due to an error with Groq."],
                "error": str(e)
            }
