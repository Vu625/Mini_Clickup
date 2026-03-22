from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.session import get_async_session
from app.core.fastapi_users_config import current_active_user
from app.models.user import User
from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceRead, WorkspaceUpdate
from app.crud import workspace as crud_workspace

router = APIRouter()

@router.post("/", response_model=WorkspaceRead)
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
    """Cập nhật thông tin workspace (Chỉ Owner mới có quyền)."""
    # Bước này có thể viết thêm logic kiểm tra quyền Owner ở đây hoặc trong CRUD
    # Tạm thời giả định user hợp lệ để test CRUD
    statement = select(Workspace).where(Workspace.id == workspace_id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    
    if not db_obj or db_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return await crud_workspace.update_workspace(db, db_obj=db_obj, obj_in=obj_in)

@router.delete("/{workspace_id}")
async def remove_workspace(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Xóa workspace."""
    # Kiểm tra quyền trước khi xóa
    success = await crud_workspace.delete_workspace(db, id=workspace_id)
    if not success:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return {"message": "Workspace deleted successfully"}