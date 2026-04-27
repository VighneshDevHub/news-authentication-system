from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.db.session import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import StatsResponse, DashboardHistoryResponse
from app.models.user import User
from app.api import deps

router = APIRouter()

@router.get("/stats", response_model=StatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = DashboardService(db)
    stats = await service.get_stats(user_id=current_user.id)
    return stats

@router.get("/history", response_model=DashboardHistoryResponse)
async def get_dashboard_history(
    category: Optional[str] = None,
    min_score: Optional[int] = None,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    service = DashboardService(db)
    history = await service.get_history(
        user_id=current_user.id,
        category=category,
        min_score=min_score,
        limit=limit
    )
    return history
