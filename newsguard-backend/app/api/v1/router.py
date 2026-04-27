from fastapi import APIRouter
from app.api.v1.endpoints import analysis, articles, dashboard, auth, saved, chat

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(saved.router, prefix="/saved", tags=["saved"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
