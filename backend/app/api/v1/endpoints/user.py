from fastapi import APIRouter, Depends, Query
from typing import List
from app.core.fastapi_users_config import current_active_user
from app.schemas.user import UserRead,UserUpdate
from app.models.user import User
from app.db.session import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud import user as crud_user
from app.core.fastapi_users_config import fastapi_users, auth_backend

# Import hàm crud vừa viết ở trên

router= APIRouter()

@router.get("/search", response_model=List[UserRead])
async def search_users_api(
    q: str = Query(..., min_length=1, description="Email hoặc tên người dùng"),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Tìm kiếm người dùng để mời vào Workspace."""
    users = await crud_user.search_users(db, query=q)
    
    # Optional: Loại bỏ chính bản thân người đang search ra khỏi kết quả
    return [u for u in users if u.id != current_user.id]

router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
)