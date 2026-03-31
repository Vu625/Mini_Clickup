from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.session import get_async_session
from app.core.fastapi_users_config import current_active_user
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceRead, WorkspaceUpdate ,InvitationCreate, InvitationRead , InvitationWithWorkspaceRead
from app.crud import workspace as crud_workspace
from app.services import workspace as services_workspace
from app.models.notification import Notification
from app.schemas.notification import NotificationRead
router = APIRouter()

@router.get("/notifications", response_model=List[NotificationRead])
async def get_my_notifications(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy danh sách thông báo của tôi (mới nhất lên đầu)."""
    statement = (
        select(Notification)
        .where(Notification.receiver_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    result = await db.execute(statement)
    return result.scalars().all()

@router.patch("/notifications/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    statement = select(Notification).where(
        Notification.id == notification_id, 
        Notification.receiver_id == current_user.id
    )
    result = await db.execute(statement)
    notification = result.scalar_one_or_none()
    
    if notification:
        notification.is_read = True
        await db.commit()
    return {"status": "success"}