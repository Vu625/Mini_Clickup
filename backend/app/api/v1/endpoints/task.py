from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_async_session
from app.core.fastapi_users_config import current_active_user
from app.models.user import User
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.crud import task as crud_task
from app.services.vector_db import sync_task_to_vector_db

router = APIRouter()

@router.get("/project/{project_id}", response_model=List[TaskRead])
async def list_tasks(
    project_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy danh sách task trong project."""
    return await crud_task.get_tasks_by_project(db, project_id=project_id)

@router.post("/", response_model=TaskRead)
async def create_new_task(
    *,
    db: AsyncSession = Depends(get_async_session),
    obj_in: TaskCreate,
    background_tasks: BackgroundTasks, # Inject BackgroundTasks
    current_user: User = Depends(current_active_user)
):
    """Tạo Task mới và trigger sync Vector DB."""
    # (Optional) Thêm logic check quyền: User có trong ProjectMember không?
    
    task = await crud_task.create_task(db, obj_in=obj_in)
    
    # Đẩy tác vụ embedding chạy ngầm, API lập tức trả về cho Frontend
    background_tasks.add_task(sync_task_to_vector_db, task.id, db)
    
    return task

@router.put("/{task_id}", response_model=TaskRead)
async def update_existing_task(
    task_id: UUID,
    obj_in: TaskUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Cập nhật Task và đồng bộ lại Vector DB nếu cần."""
    # (Optional) Check quyền
    
    from sqlalchemy import select
    from app.models.task import Task
    
    statement = select(Task).where(Task.id == task_id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()
    
    if not db_obj:
        raise HTTPException(status_code=404, detail="Task not found")
        
    updated_task = await crud_task.update_task(db, db_obj=db_obj, obj_in=obj_in)
    
    # Nếu cờ embedding bị reset về False (do đổi tên/mô tả), trigger chạy lại ngầm
    if not updated_task.embedding_status:
        background_tasks.add_task(sync_task_to_vector_db, updated_task.id, db)
        
    return updated_task

