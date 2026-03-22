from uuid import UUID
from typing import Optional
from pydantic import BaseModel

# Dữ liệu dùng để tạo mới
class WorkspaceCreate(BaseModel):
    name: str

# Dữ liệu dùng để cập nhật
class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None

# Dữ liệu trả về cho Client
class WorkspaceRead(BaseModel):
    id: UUID
    name: str
    owner_id: UUID

    class Config:
        from_attributes = True