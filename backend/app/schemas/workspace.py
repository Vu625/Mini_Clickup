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

class InvitationCreate(BaseModel):
    invitee_email: str
    role: str = "Member"

class InvitationRead(BaseModel):
    id: UUID
    workspace_id: UUID
    invitee_email: str
    role: str
    status: str

class InvitationWithWorkspaceRead(BaseModel):
    id: UUID
    workspace_id: UUID
    workspace_name: str  
    inviter_id: UUID
    role: str
    status: str

    class Config:
        from_attributes = True