from uuid import UUID, uuid4
from typing import Optional, List , TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
# from app.models.task import Task
if TYPE_CHECKING:
    from app.models.workspace import Workspace
    from app.models.task import Task
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
    workspace: Optional["Workspace"] = Relationship(back_populates="projects")
    members: List["ProjectMember"] = Relationship(
        back_populates="project",
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan",
        },
    )
    tasks: List["Task"] = Relationship(
        back_populates="project", # Bạn cần thêm back_populates vào model Task nữa (xem bên dưới)
        sa_relationship_kwargs={
            "cascade": "all, delete-orphan", # Xóa Project -> Xóa sạch Task
        },
    )