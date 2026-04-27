from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.db.base_class import Base

class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    original_text = Column(Text, nullable=False)
    authenticity_score = Column(Integer, nullable=False)
    key_findings = Column(JSONB, nullable=True)
    differences = Column(JSONB, nullable=True)
    supporting_evidence = Column(JSONB, nullable=True)
    score_breakdown = Column(JSONB, nullable=True)
    verified_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="verifications")
