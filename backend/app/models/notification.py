from uuid import UUID, uuid4
from typing import Optional, List
from sqlmodel import SQLModel, Field
from datetime import datetime

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    receiver_id: UUID = Field(foreign_key="users.id") # Người nhận thông báo
    content: str
    link: Optional[str] = None # Link dẫn tới workspace đó
    is_read: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)