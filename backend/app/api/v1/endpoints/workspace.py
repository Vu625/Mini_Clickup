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

router = APIRouter()


@router.post("/", response_model=WorkspaceRead,status_code=201)
async def create_new_workspace(
    *,
    db: AsyncSession = Depends(get_async_session),
    obj_in: WorkspaceCreate,
    current_user: User = Depends(current_active_user)
):
    """Tạo workspace mới và gán quyền Owner cho user hiện tại."""
    return await crud_workspace.create_workspace(db, obj_in=obj_in, owner_id=current_user.id)

@router.get("/", response_model=List[WorkspaceRead])
async def list_my_workspaces(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy toàn bộ workspaces mà user đang tham gia."""
    return await crud_workspace.get_workspaces_by_user(db, user_id=current_user.id)

@router.put("/{workspace_id}", response_model=WorkspaceRead)
async def update_existing_workspace(
    workspace_id: UUID,
    obj_in: WorkspaceUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    return await services_workspace.update_workspace(workspace_id,obj_in,db,current_user)

@router.delete("/{workspace_id}")
async def remove_workspace(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Xóa workspace."""
    # Kiểm tra quyền trước khi xóa
    success = await services_workspace.delete_workspace(db=db, workspace_id=workspace_id, current_user=current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"message": "Workspace deleted successfully"}

@router.post("/{workspace_id}/invite", response_model=InvitationRead)
async def invite_member(
    workspace_id: UUID,
    obj_in: InvitationCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    # Logic kiểm tra quyền: Chỉ Owner mới được mời
    # (Bạn có thể fetch workspace ra kiểm tra owner_id == current_user.id)
    return await crud_workspace.invite_user_to_workspace(
        db, workspace_id, current_user.id, obj_in
    )

@router.get("/invitations/me", response_model=List[InvitationWithWorkspaceRead])
async def list_my_invitations(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user) # Dependency bạn đã có
):
    """
    Lấy danh sách lời mời dành cho User hiện tại dựa trên Email.
    """
    invitations = await crud_workspace.get_my_invitations(
        db, 
        user_email=current_user.email
    )
    return invitations

@router.post("/invitations/{invitation_id}/accept")
async def accept_workspace_invitation(
    invitation_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Chấp nhận lời mời và chính thức gia nhập Workspace."""
    return await crud_workspace.accept_invitation(db, invitation_id, current_user)


@router.post("/invitations/{invitation_id}/decline")
async def decline_workspace_invitation(
    invitation_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Từ chối lời mời (Xóa bản ghi invitation)."""
    return await crud_workspace.decline_invitation(db, invitation_id, current_user)