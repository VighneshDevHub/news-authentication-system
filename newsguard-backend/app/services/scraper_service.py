import trafilatura
import asyncio
from typing import Optional, Dict
from bs4 import BeautifulSoup
from urllib.parse import urlparse

class ScraperService:
    @staticmethod
    async def fetch_article(url: str) -> Optional[Dict[str, str]]:
        """
        Fetches and extracts main text from a URL using Trafilatura.
        Includes fallback to BeautifulSoup for metadata and image extraction,
        mirroring the original NewsGuard logic.
        """
        try:
            loop = asyncio.get_event_loop()
            downloaded = await loop.run_in_executor(None, trafilatura.fetch_url, url)
            
            if not downloaded:
                return None

            # Extract main content using Trafilatura
            content = await loop.run_in_executor(None, trafilatura.extract, downloaded)
            
            # Fallback to BeautifulSoup if Trafilatura fails to extract content
            soup = BeautifulSoup(downloaded, 'html.parser')
            if not content:
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.extract()
                content = soup.get_text(separator='\n')
                # Basic cleaning
                lines = (line.strip() for line in content.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                content = '\n'.join(chunk for chunk in chunks if chunk)
            
            content = content or ""
            
            # Use BeautifulSoup for metadata extraction (Title, Image, etc.)
            title = soup.title.string if soup.title and soup.title.string else ''
            if not title:
                h1 = soup.find('h1')
                title = h1.get_text().strip() if h1 else ''
            
            # Parse the URL to get the source domain
            source = urlparse(url).netloc.replace('www.', '')
            
            # Find image (first image in article or og:image)
            image_url = None
            og_image = soup.find('meta', property='og:image')
            if og_image:
                image_url = og_image.get('content')

            return {
                "url": url,
                "title": title,
                "content": content,
                "description": content[:300] + '...' if content else '',
                "source": source,
                "image_url": image_url
            }
        except Exception as e:
            print(f"Scraping Error ({url}): {e}")
            return None

    @staticmethod
    async def fetch_multiple(urls: list[str]) -> list[Dict[str, str]]:
        """
        Fetches multiple URLs concurrently.
        """
        tasks = [ScraperService.fetch_article(url) for url in urls]
        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None]
