import json
import ollama
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

class OllamaProvider(LLMProvider):
    def __init__(self, model: str = settings.OLLAMA_MODEL):
        self.model = model
        self.client = ollama.AsyncClient(host=settings.OLLAMA_BASE_URL)

    async def _call_json(self, prompt: str) -> Dict[str, Any]:
        try:
            response = await self.client.chat(
                model=self.model, 
                messages=[{"role": "user", "content": prompt}], 
                format="json"
            )
            content = response.get('message', {}).get('content', '{}')
            return json.loads(content)
        except Exception as e:
            print(f"Error calling Ollama (JSON): {e}")
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

    async def chat(self, message: str, context: Optional[str] = None, history: Optional[List[Dict[str, str]]] = None) -> str:
        messages = [{"role": "system", "content": "You are NewsGuard-AI, an advanced news analyst assistant. Provide helpful, accurate, and objective insights."}]
        
        if history:
            for h in history:
                messages.append({"role": h["role"], "content": h["content"]})
        
        if context:
            messages.append({"role": "system", "content": f"Context for analysis: {context}"})
            
        messages.append({"role": "user", "content": message})
        
        try:
            response = await self.client.chat(model=self.model, messages=messages)
            return response.get('message', {}).get('content', "I'm sorry, I couldn't generate a response.")
        except Exception as e:
            print(f"Error in Ollama chat: {e}")
            return "I'm sorry, I'm having trouble processing your request right now."

    async def detect_bias(self, text: str) -> Dict[str, Any]:
        prompt = detect_bias_prompt(text[:4000])
        return await self._call_json(prompt)