from uuid import UUID
from fastapi_users import schemas
from pydantic import EmailStr

# 1. Schema dùng để Trả về dữ liệu (UserRead)
class UserRead(schemas.BaseUser[UUID]):
    full_name: str | None = None
    # SQLModel mặc định hỗ trợ Pydantic v2 nên không cần Config: from_attributes nữa

# 2. Schema dùng để Đăng ký (UserCreate)
# BẮT BUỘC kế thừa schemas.BaseUserCreate để fastapi-users nhận diện được các hàm xử lý
class UserCreate(schemas.BaseUserCreate):
    full_name: str
    # email và password đã có sẵn trong BaseUserCreate

# 3. Schema dùng để Cập nhật (UserUpdate)
class UserUpdate(schemas.BaseUserUpdate):
    full_name: str | None = None