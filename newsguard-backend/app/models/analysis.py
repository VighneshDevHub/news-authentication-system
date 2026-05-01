from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Core Data
    original_text = Column(Text, nullable=False)
    original_text_hash = Column(String, index=True) # For duplicate detection
    
    # Analysis Outcome
    authenticity_score = Column(Integer, nullable=False) # 0-100
    verdict = Column(String, nullable=True) # e.g. "Likely Authentic"
    category = Column(String, index=True, nullable=True) # e.g. "Politics", "Tech"
    relevance_score = Column(Integer, default=0)
    
    # Detailed Breakdown (JSONB for flexibility)
    # Stores: key_findings, differences, supporting_evidence, score_breakdown
    details = Column(JSONB, nullable=False, default={})
    
    # New columns for full context
    bias_details = Column(JSONB, nullable=True, default={})
    related_articles = Column(JSONB, nullable=True, default=[])
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    # Use full module path to avoid mapper initialization issues
    user = relationship("app.models.user.User", backref="analyses")
