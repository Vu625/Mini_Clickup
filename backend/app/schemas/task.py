from uuid import UUID
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.models.task import TaskPriority
from uuid import UUID


class TaskCreate(BaseModel):
    project_id: UUID
    title: str
    description: Optional[str] = None
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    status: Optional[str] = "To Do"
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[str] = None
    assignee_id: Optional[UUID] = None
    due_date: Optional[datetime] = None

class TaskRead(BaseModel):
    id: UUID
    project_id: UUID
    title: str
    description: Optional[str]
    priority: TaskPriority
    status: str
    assignee_id: Optional[UUID]
    due_date: Optional[datetime]
    created_at: datetime
    embedding_status: bool

    class Config:
        from_attributes = True

class TaskAIGenerateRequest(BaseModel):
    project_id: UUID
    prompt: str = "Lên kế hoạch tổ chức workshop AI trong 1 tuần"