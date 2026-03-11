# from sqlmodel import SQLModel, Field
# from typing import Optional
# import uuid

# class User(SQLModel, table=True):
#     __tablename__ = "users" # Đảm bảo đúng tên bảng trong SQL
    
#     id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
#     full_name: str
#     email: str = Field(unique=True, index=True)
#     password_hash: str
#     image: Optional[str] = None
import uuid
from typing import Optional
from sqlmodel import Field, SQLModel
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
class User(SQLAlchemyBaseUserTableUUID,SQLModel, table=True):
    __tablename__ = "users"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    
    # Các trường bắt buộc của FastAPI Users
    email: str = Field(unique=True, index=True, max_length=320)
    hashed_password: str = Field(max_length=1024) # Đổi từ password_hash sang hashed_password
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    is_verified: bool = Field(default=False)
    
    # Các trường Custom của dự án Planner
    full_name: str
    image: Optional[str] = None
    # full_name: str = Field(nullable=True)
    # image: str | None = Field(default=None)
