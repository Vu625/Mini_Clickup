from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate

async def create_task(db: AsyncSession, obj_in: TaskCreate) -> Task:
    db_obj = Task(**obj_in.model_dump())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def get_tasks_by_project(db: AsyncSession, project_id: UUID):
    statement = select(Task).where(Task.project_id == project_id)
    result = await db.execute(statement)
    return result.scalars().all()

async def update_task(db: AsyncSession, db_obj: Task, obj_in: TaskUpdate) -> Task:
    update_data = obj_in.model_dump(exclude_unset=True)
    
    # Nếu có thay đổi title hoặc description, reset cờ embedding
    if "title" in update_data or "description" in update_data:
        db_obj.embedding_status = False
        
    for field in update_data:
        setattr(db_obj, field, update_data[field])
        
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

async def delete_task(db: AsyncSession, db_obj: Task) -> bool:
    await db.delete(db_obj)
    await db.commit()
    return True