from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Dict, Any, Optional
from app.db.session import get_db
from app.api import deps
from app.models.user import User
from app.models.analysis import AnalysisResult
from app.ai.groq_provider import GroqProvider
from pydantic import BaseModel
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    analysis_id: Optional[int] = None
    context: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str
    report_data: Optional[Dict[str, Any]] = None

@router.post("", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Chat with the AI assistant about news content.
    If analysis_id is provided, the assistant will have context about that specific analysis.
    """
    provider = GroqProvider() 
    
    additional_context = request.context or ""
    
    # If analysis_id is provided, fetch the analysis and add to context
    if request.analysis_id:
        result = await db.execute(
            select(AnalysisResult).where(AnalysisResult.id == request.analysis_id)
        )
        analysis = result.scalars().first()
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        # Optional: Check if the user owns this analysis or if it's public
        # if analysis.user_id and analysis.user_id != current_user.id:
        #     raise HTTPException(status_code=403, detail="Not authorized to access this analysis")

        # Create a structured context from the analysis result
        analysis_context = f"""
        CONTEXT FOR THIS CHAT:
        The user is asking about a specific news analysis result.
        
        Original Text: {analysis.original_text[:1000]}...
        
        Analysis Results:
        - Authenticity Score: {analysis.authenticity_score}/100
        - Verdict: {analysis.verdict}
        - Category: {analysis.category}
        - Key Findings: {json.dumps(analysis.details.get('verdict_summary', ''))}
        
        Supporting Evidence: {json.dumps(analysis.details.get('supporting_evidence', []))}
        
        Please use this information to answer the user's questions accurately.
        """
        additional_context = f"{analysis_context}\n\n{additional_context}"

    # Detect if user wants a report
    is_report_request = any(word in request.message.lower() for word in ["report", "analyze", "visualization", "chart", "graph"])
    
    response_text = await provider.chat(
        message=request.message,
        history=request.history,
        context=additional_context
    )

    report_data = None
    if is_report_request and (additional_context or request.context):
        # Generate some structured data for visualization if context exists
        report_data = {
            "credibility_score": 85,
            "sentiment": "Neutral",
            "key_entities": ["Example Corp", "John Doe"],
            "bias_score": 15,
            "source_reliability": [
                {"source": "BBC", "score": 95},
                {"source": "Twitter", "score": 40},
                {"source": "Local News", "score": 80}
            ]
        }

    return {
        "response": response_text,
        "report_data": report_data
    }
