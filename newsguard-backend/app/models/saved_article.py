from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class SavedArticle(Base):
    __tablename__ = "saved_articles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_url = Column(String(500), nullable=True)
    article_title = Column(String(200), nullable=False)
    article_content = Column(Text, nullable=True)
    article_source = Column(String(100), nullable=True)
    image_url = Column(String(500), nullable=True)
    saved_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="saved_articles")
