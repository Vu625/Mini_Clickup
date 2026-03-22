from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate

async def create_workspace(db: AsyncSession, obj_in: WorkspaceCreate, owner_id: UUID) -> Workspace:
    # 1. Tạo Workspace mới
    db_obj = Workspace(
        name=obj_in.name,
        owner_id=owner_id
    )
    db.add(db_obj)
    await db.flush() # Lấy ID của workspace vừa tạo mà chưa commit hoàn toàn
    
    # 2. Tự động thêm User tạo vào bảng WorkspaceMember với quyền Owner
    member_obj = WorkspaceMember(
        workspace_id=db_obj.id,
        user_id=owner_id,
        role_in_workspace="Owner"
    )
    db.add(member_obj)
    
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_workspaces_by_user(db: AsyncSession, user_id: UUID):
    # Lấy danh sách workspace mà user là thành viên
    statement = select(Workspace).join(WorkspaceMember).where(WorkspaceMember.user_id == user_id)
    result = await db.execute(statement)
    return result.scalars().all()

async def update_workspace(db: AsyncSession, db_obj: Workspace, obj_in: WorkspaceUpdate) -> Workspace:
    update_data = obj_in.model_dump(exclude_unset=True)
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_workspace(db: AsyncSession, id: UUID) -> bool:
    statement = select(Workspace).where(Workspace.id == id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    if db_obj:
        await db.delete(db_obj)
        await db.commit()
        return True
    return False