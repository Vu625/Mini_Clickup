# from fastapi import APIRouter, Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordRequestForm
# from sqlmodel import Session
# from app.db.session import get_session
# from app.schemas.user import UserCreate, UserResponse
# from app.schemas.token import Token
# from app.crud import user as user_crud
# from app.core import security

# router = APIRouter()

# @router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
# def register(user_in: UserCreate, session: Session = Depends(get_session)):
#     """
#     Đăng ký người dùng mới.
#     """
#     # Kiểm tra email đã tồn tại chưa
#     user = user_crud.get_user_by_email(session, email=user_in.email)
#     if user:
#         raise HTTPException(
#             status_code=400,
#             detail="Email này đã được đăng ký trong hệ thống."
#         )
#     return user_crud.create_user(session, user_in)

# @router.post("/login", response_model=Token)
# def login(
#     session: Session = Depends(get_session),
#     form_data: OAuth2PasswordRequestForm = Depends()
# ):
#     """
#     Đăng nhập lấy Access Token (OAuth2 compatible).
#     """
#     # 1. Kiểm tra User có tồn tại không
#     user = user_crud.get_user_by_email(session, email=form_data.username)
#     if not user or not security.verify_password(form_data.password, user.password_hash):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Email hoặc mật khẩu không chính xác",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     # 2. Tạo Token trả về
#     return {
#         "access_token": security.create_access_token(user.id),
#         "token_type": "bearer",
#     }

from fastapi import APIRouter
from app.core.fastapi_users_config import fastapi_users, auth_backend
from app.schemas.user import UserCreate, UserRead

router = APIRouter()
# Route cho Đăng ký
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    # prefix="/register"
)

# Route cho Login (trả về JWT)
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
    responses={204: {"description": "Logout thành công"}}
)
