"""
Initialize the database by creating all tables.
Run this once before starting the server:
    python init_db.py
"""
import asyncio
from app.db.base import Base
from app.db.session import engine


async def init_db():
    """Create all tables in the database."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database initialized. All tables created.")


if __name__ == "__main__":
    asyncio.run(init_db())
