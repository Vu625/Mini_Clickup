from fastapi import APIRouter
from app.api.v1.endpoints import auth

api_router = APIRouter()

# Đăng ký các module API tại đây
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# Sau này sẽ thêm:
# api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])