from uuid import UUID, uuid4
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# Bảng trung gian Workspace_Members (Nhiều - Nhiều)
class WorkspaceMember(SQLModel, table=True):
    __tablename__ = "workspace_members"
    
    workspace_id: UUID = Field(foreign_key="workspaces.id", primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", primary_key=True)
    role_in_workspace: str = Field(default="Owner") # Owner, Editor, Viewer
    workspace: "Workspace" = Relationship(back_populates="members")

# Bảng Workspaces
class Workspace(SQLModel, table=True):
    __tablename__ = "workspaces"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(index=True)
    owner_id: UUID = Field(foreign_key="users.id")
    
    members: List["WorkspaceMember"] = Relationship(
        back_populates="workspace",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan", # Khi xóa Workspace, xóa luôn các Member liên quan
        },
    )

    # Relationships (Để dễ dàng truy xuất dữ liệu liên quan)
    # Một workspace có nhiều dự án
    # projects: List["Project"] = Relationship(back_populates="workspace")