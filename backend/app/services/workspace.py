from uuid import UUID
from app.models.workspace import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from sqlmodel import select
from app.crud import workspace as crud_workspace
from fastapi import HTTPException


async def update_workspace(workspace_id: UUID, obj_in : WorkspaceUpdate, db : AsyncSession , current_user : User )-> Workspace: 
    statement = select(Workspace).where(Workspace.id == workspace_id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")
    if not db_obj or db_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return await crud_workspace.update_workspace(db, db_obj=db_obj, obj_in=obj_in)

async def delete_workspace(workspace_id: UUID, db : AsyncSession , current_user : User )-> Workspace: 
    statement = select(Workspace).where(Workspace.id == workspace_id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Workspace not found")
    if not db_obj or db_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return await crud_workspace.delete_workspace(db, workspace_id)