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
            
            # Use BeautifulSoup for metadata extraction (Title, Image, etc.)
            title = soup.title.string if soup.title and soup.title.string else ''
            if not title:
                h1 = soup.find('h1')
                title = h1.get_text().strip() if h1 else ''
            
            if not content:
                # Remove script and style elements
                for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
                    script.extract()
                
                # Try to find the main article body
                article_body = soup.find('article') or soup.find('main') or soup.find('div', class_='article-body') or soup.find('div', id='article-content')
                
                if article_body:
                    content = article_body.get_text(separator='\n')
                else:
                    content = soup.get_text(separator='\n')
                
                # Basic cleaning
                lines = (line.strip() for line in content.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                content = '\n'.join(chunk for chunk in chunks if chunk and len(chunk) > 20) # Filter very short strings
            
            content = content or ""
            
            # Parse the URL to get the source domain
            source = urlparse(url).netloc.replace('www.', '')
            
            # Find image (first image in article or og:image)
            image_url = None
            og_image = soup.find('meta', property='og:image')
            if og_image:
                image_url = og_image.get('content')
            
            if not image_url:
                # Try to find the first high-res image
                for img in soup.find_all('img'):
                    if img.get('src') and any(ext in img['src'].lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                        if 'favicon' not in img['src'].lower() and 'logo' not in img['src'].lower():
                            image_url = img['src']
                            break
            
            # Ensure image_url is absolute
            if image_url and not image_url.startswith('http'):
                base_url = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
                image_url = f"{base_url.rstrip('/')}/{image_url.lstrip('/')}"

            # Get description from meta tags
            description = ""
            og_desc = soup.find('meta', property='og:description')
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if og_desc:
                description = og_desc.get('content')
            elif meta_desc:
                description = meta_desc.get('content')
            
            if not description and content:
                description = content[:300] + '...'

            return {
                "url": url,
                "title": title,
                "content": content,
                "description": description,
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
