from pydantic import BaseModel
from typing import Optional

class SaveArticleRequest(BaseModel):
    user_id: int
    article_url: str
    article_title: str
    article_content: Optional[str] = None
    article_source: Optional[str] = None
    image_url: Optional[str] = None

class SaveArticleResponse(BaseModel):
    message: str
    saved: bool
    id: Optional[int] = None
