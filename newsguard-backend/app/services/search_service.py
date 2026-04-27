import httpx
from app.core.config import settings

class SearchService:
    @staticmethod
    async def google_search(query: str, num_results: int = 5) -> list[str]:
        """
        Performs a Google Custom Search and returns a list of URLs.
        """
        if not settings.GOOGLE_API_KEY or not settings.GOOGLE_CSE_ID:
            print("Warning: Google API credentials missing. Returning empty list.")
            return []

        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            "q": query,
            "key": settings.GOOGLE_API_KEY,
            "cx": settings.GOOGLE_CSE_ID,
            "num": num_results
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                urls = []
                if "items" in data:
                    urls = [item["link"] for item in data["items"]]
                return urls
            except Exception as e:
                print(f"Google Search Error: {e}")
                return []
