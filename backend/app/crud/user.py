from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

async def search_users(db: AsyncSession, query: str, limit: int = 10):
    # Tìm kiếm user có email hoặc full_name chứa từ khóa query
    search_pattern = f"%{query}%"
    statement = (
        select(User)
        .where(
            or_(
                User.email.ilike(search_pattern),
                User.full_name.ilike(search_pattern)
            ),
            User.is_active == True # Chỉ tìm những người đang hoạt động
        )
        .limit(limit)
    )
    result = await db.execute(statement)
    return result.scalars().all()