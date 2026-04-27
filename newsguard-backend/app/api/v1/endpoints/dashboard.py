from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import StatsResponse, DashboardHistoryResponse

router = APIRouter()

@router.get("/stats", response_model=StatsResponse)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    # current_user = Depends(get_current_user) # Uncomment when auth is ready
):
    service = DashboardService(db)
    stats = await service.get_stats() # Pass current_user.id later
    return stats

@router.get("/history", response_model=DashboardHistoryResponse)
async def get_dashboard_history(
    db: AsyncSession = Depends(get_db),
    # current_user = Depends(get_current_user) # Uncomment when auth is ready
):
    service = DashboardService(db)
    history = await service.get_history() # Pass current_user.id later
    return history
