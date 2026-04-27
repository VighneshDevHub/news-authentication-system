from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SavedArticleBase(BaseModel):
    article_url: Optional[str] = None
    article_title: str
    article_content: Optional[str] = None
    article_source: Optional[str] = None
    image_url: Optional[str] = None

class SavedArticleCreate(SavedArticleBase):
    pass

class SavedArticle(SavedArticleBase):
    id: int
    user_id: int
    saved_at: datetime

    class Config:
        from_attributes = True
