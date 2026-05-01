"""
Initialize the database by creating all tables.
Run this once before starting the server:
    python init_db.py
"""
import asyncio
from app.db.base import Base
from app.db.session import engine, AsyncSessionLocal
from app.models.user import User
from app.core import security
from sqlalchemy.future import select

async def init_db():
    """Drop all tables and create them fresh."""
    async with engine.begin() as conn:
        print("Dropping all tables...")
        await conn.run_sync(Base.metadata.drop_all)
        print("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    print("Seeding initial data...")
    async with AsyncSessionLocal() as db:
        # Check if any user exists
        result = await db.execute(select(User))
        if not result.scalars().first():
            print("Creating default superuser...")
            user = User(
                username="admin",
                email="admin@newsguard.ai",
                hashed_password=security.get_password_hash("admin123"),
                is_active=True,
                is_superuser=True,
                role="admin"
            )
            db.add(user)
            await db.commit()
            print("Default superuser created (admin/admin123)")
            
    print("Database initialized fresh. All tables recreated and seeded.")


if __name__ == "__main__":
    asyncio.run(init_db())
