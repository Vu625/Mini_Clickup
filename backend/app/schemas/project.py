from uuid import UUID
from typing import Optional
from pydantic import BaseModel

class ProjectCreate(BaseModel):
    workspace_id: UUID
    name: str
    description: Optional[str] = None
    is_public: bool = True

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class ProjectRead(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: Optional[str]
    is_public: bool

    class Config:
        from_attributes = True