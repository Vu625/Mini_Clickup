from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class NotificationRead(BaseModel):
    id: UUID
    receiver_id: UUID
    content: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    # Quan trọng: Dòng này cho phép Pydantic đọc dữ liệu từ 
    # các Object của SQLAlchemy (ORM) một cách tự động.
    model_config = ConfigDict(from_attributes=True)