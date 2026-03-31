from fastapi import APIRouter
from app.core.fastapi_users_config import fastapi_users, auth_backend
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter()
# Route cho Đăng ký
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

# Route cho Login (trả về JWT)
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    responses={204: {"description": "Logout thành công"}}
)
#dành cho admin
# router.include_router(
#     fastapi_users.get_users_router(UserRead,UserUpdate),
#     prefix="/users",
#     tags=["users"]
# )
