from uuid import UUID, uuid4
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

# Bảng trung gian Project_Members
class ProjectMember(SQLModel, table=True):
    __tablename__ = "project_members"
    
    project_id: UUID = Field(foreign_key="projects.id", primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", primary_key=True)
    role_in_project: str = Field(default="Editor") # Owner, Editor, Viewer
    project: "Project" = Relationship(back_populates="members")


# Bảng Projects
class Project(SQLModel, table=True):
    __tablename__ = "projects"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    workspace_id: UUID = Field(foreign_key="workspaces.id", index=True)
    name: str
    description: Optional[str] = Field(default=None)
    is_public: bool = Field(default=True)

    members: List["ProjectMember"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
        },
    )