from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.project import Project, ProjectMember
from app.models.workspace import WorkspaceMember
from app.schemas.project import ProjectCreate, ProjectUpdate

async def create_project(db: AsyncSession, obj_in: ProjectCreate, user_id: UUID) -> Project:
    # 1. Tạo Project mới
    db_obj = Project(**obj_in.model_dump())
    db.add(db_obj)
    await db.flush() # Lấy ID của project
    
    # 2. Thêm người tạo vào ProjectMember với quyền Owner
    member_obj = ProjectMember(
        project_id=db_obj.id,
        user_id=user_id,
        role_in_project="Owner"
    )
    db.add(member_obj)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_projects_in_workspace(db: AsyncSession, workspace_id: UUID, user_id: UUID):
    # 1. Kiểm tra role của User trong Workspace
    ws_stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user_id
    )
    ws_result = await db.execute(ws_stmt)
    ws_member = ws_result.scalar_one_or_none()

    # Nếu không ở trong Workspace, trả về rỗng (hoặc có thể ném lỗi ở tầng API)
    if not ws_member:
        return []

    # 2. Áp dụng logic lọc Project
    if ws_member.role_in_workspace in ["Owner", "Admin"]:
        # Admin/Owner thấy mọi project trong workspace
        stmt = select(Project).where(Project.workspace_id == workspace_id)
    else:
        # Member/Guest chỉ thấy project public HOẶC project mà họ là thành viên
        stmt = (
            select(Project)
            .outerjoin(ProjectMember, Project.id == ProjectMember.project_id)
            .where(
                Project.workspace_id == workspace_id,
                or_(
                    Project.is_public == True,
                    ProjectMember.user_id == user_id
                )
            )
        )
    
    result = await db.execute(stmt)
    # Dùng unique() để tránh duplicate nếu có join
    return result.scalars().unique().all()

async def update_project(db: AsyncSession, *, db_obj: Project, obj_in: ProjectUpdate) -> Project:
    update_data = obj_in.model_dump(exclude_unset=True) # Chỉ update các trường có gửi lên
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_project(db: AsyncSession, *, id: UUID) -> bool:
    stmt = select(Project).where(Project.id == id)
    result = await db.execute(stmt)
    db_obj = result.scalar_one_or_none()
    
    if db_obj:
        await db.delete(db_obj)
        await db.commit()
        return True
    return False