from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_async_session
from app.core.fastapi_users_config import current_active_user
from app.models.user import User
from app.models.project import Project,ProjectMember
from app.models.workspace import WorkspaceMember
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.crud import project as crud_project

router = APIRouter()
@router.get("/workspace/{workspace_id}", response_model=List[ProjectRead])
async def list_projects(
    workspace_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy danh sách Projects theo phân quyền (Public hoặc có tham gia)."""
    projects = await crud_project.get_projects_in_workspace(db, workspace_id, current_user.id)
    return projects

@router.post("/", response_model=ProjectRead)
async def create_new_project(
    *,
    db: AsyncSession = Depends(get_async_session),
    obj_in: ProjectCreate,
    current_user: User = Depends(current_active_user)
):
    """Tạo Project mới. User phải nằm trong Workspace đó."""
    # Kiểm tra user có trong workspace không và có quyền tạo không (VD: cần role Admin/Owner/Member)
    stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == obj_in.workspace_id,
        WorkspaceMember.user_id == current_user.id
    )
    result = await db.execute(stmt)
    ws_member = result.scalar_one_or_none()
    
    if not ws_member:
        raise HTTPException(status_code=403, detail="You are not a member of this workspace")
        
    # Có thể thêm logic: Guest không được tạo Project tại đây
    if ws_member.role_in_workspace == "Guest":
        raise HTTPException(status_code=403, detail="Guests cannot create projects")

    return await crud_project.create_project(db, obj_in=obj_in, user_id=current_user.id)


# Phần PUT (Update) và DELETE bạn có thể bổ sung tương tự như Workspace, 
# nhớ kết hợp kiểm tra quyền trong bảng ProjectMember (role phải là Owner/Editor) trước khi cho phép sửa/xóa.

@router.put("/{project_id}", response_model=ProjectRead)
async def update_existing_project(
    project_id: UUID,
    obj_in: ProjectUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Cập nhật Project (Chỉ Admin Workspace hoặc Owner Project)."""
    # 1. Tìm Project và lấy thông tin role của User cùng lúc
    stmt = (
        select(Project, WorkspaceMember.role_in_workspace, ProjectMember.role_in_project)
        .join(WorkspaceMember, Project.workspace_id == WorkspaceMember.workspace_id)
        .outerjoin(ProjectMember, (Project.id == ProjectMember.project_id) & (ProjectMember.user_id == current_user.id))
        .where(Project.id == project_id, WorkspaceMember.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Project not found or no access")

    db_obj, ws_role, pj_role = row

    # 2. Logic kiểm tra quyền sửa
    can_edit = ws_role in ["Owner", "Admin"] or pj_role == "Owner" or pj_role == "Editor"
    if not can_edit:
        raise HTTPException(status_code=403, detail="Not enough permissions to edit this project")

    return await crud_project.update_project(db, db_obj=db_obj, obj_in=obj_in)


@router.delete("/{project_id}")
async def remove_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Xóa Project (Chỉ Admin Workspace hoặc Owner Project)."""
    # 1. Kiểm tra quyền xóa (tương tự update nhưng khắt khe hơn)
    stmt = (
        select(Project, WorkspaceMember.role_in_workspace, ProjectMember.role_in_project)
        .join(WorkspaceMember, Project.workspace_id == WorkspaceMember.workspace_id)
        .outerjoin(ProjectMember, (Project.id == ProjectMember.project_id) & (ProjectMember.user_id == current_user.id))
        .where(Project.id == project_id, WorkspaceMember.user_id == current_user.id)
    )
    result = await db.execute(stmt)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Project not found")

    db_obj, ws_role, pj_role = row

    # 2. Logic: Chỉ Admin Workspace hoặc Owner của Project mới được xóa
    if ws_role not in ["Owner", "Admin"] and pj_role != "Owner":
        raise HTTPException(status_code=403, detail="Only Workspace Admins or Project Owners can delete")

    success = await crud_project.delete_project(db, id=project_id)
    return {"message": "Project deleted successfully"}