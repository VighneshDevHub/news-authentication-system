import json
from groq import AsyncGroq
from typing import List, Dict, Any, Optional
from app.ai.client import LLMProvider
from app.core.config import settings
from app.ai.prompts import (
    extract_queries_prompt, 
    extract_claims_prompt, 
    cross_reference_claims_prompt, 
    final_verdict_prompt, 
    detect_bias_prompt
)

class GroqProvider(LLMProvider):
    def __init__(self, api_key: str = settings.GROQ_API_KEY, model: str = settings.GROQ_MODEL):
        self.model = model
        self.client = AsyncGroq(api_key=api_key)

    async def _call_json(self, prompt: str) -> Dict[str, Any]:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error calling Groq (JSON): {e}")
            return {}

    async def extract_search_queries(self, text: str, count: int = 3) -> List[str]:
        prompt = extract_queries_prompt(text[:3000], count)
        data = await self._call_json(prompt)
        return data.get("queries", [])

    async def extract_claims(self, text: str) -> Dict[str, Any]:
        prompt = extract_claims_prompt(text[:4000])
        return await self._call_json(prompt)

    async def cross_reference(self, claims: List[str], source_articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        prompt = cross_reference_claims_prompt(claims, source_articles)
        data = await self._call_json(prompt)
        return data.get("verification_results", [])

    async def get_final_verdict(self, original_text: str, verification_results: List[Dict[str, Any]], bias_result: Dict[str, Any]) -> Dict[str, Any]:
        prompt = final_verdict_prompt(original_text[:3000], verification_results, bias_result)
        return await self._call_json(prompt)

    async def detect_bias(self, text: str) -> Dict[str, Any]:
        prompt = detect_bias_prompt(text[:4000])
        return await self._call_json(prompt)

    async def chat(self, message: str, context: Optional[str] = None, history: Optional[List[Dict[str, str]]] = None) -> str:
        messages = [{"role": "system", "content": "You are NewsGuard-AI, an advanced news analyst assistant. Provide helpful, accurate, and objective insights."}]
        
        if history:
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
        
        if context:
            messages.append({"role": "system", "content": f"Context for analysis: {context}"})
            
        messages.append({"role": "user", "content": message})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error in Groq chat: {e}")
            return "I'm sorry, I'm having trouble processing your request right now."

