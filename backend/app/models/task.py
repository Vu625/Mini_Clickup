from uuid import UUID, uuid4
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
from enum import Enum
from sqlmodel import SQLModel, Field, Column, String ,Relationship
from sqlalchemy import Enum as SAEnum
# from app.models.project import Project
if TYPE_CHECKING:
    from app.models.project import Project

class TaskPriority(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    URGENT = "Urgent"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    project_id: UUID = Field(foreign_key="projects.id", index=True)
    title: str
    description: Optional[str] = Field(default=None)
    
    # Sử dụng SQLAlchemy Enum để tương thích tốt với PostgreSQL
    priority: TaskPriority = Field(
        sa_column=Column(SAEnum(TaskPriority, name="task_priority_enum")),
        default=TaskPriority.MEDIUM
    )
    status: str = Field(default="To Do")
    
    assignee_id: Optional[UUID] = Field(default=None, foreign_key="users.id")
    due_date: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Cờ đánh dấu đã được đưa vào Vector DB chưa
    embedding_status: bool = Field(default=False)
    project: Optional["Project"] = Relationship(back_populates="tasks")