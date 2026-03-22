from fastapi import FastAPI
from app.api.v1.api import api_router
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.db.session import engine
from sqlmodel import SQLModel
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.security import HTTPBearer
# from fastapi import Depends

app = FastAPI(title="Planner API",openapi_tags=[
        {
            "name": "Authentication",
            "description": "Các API liên quan đến xác thực và đăng ký người dùng",
        },
        {
            "name": "Workspace",
            "description": "Các API Lấy Thêm Xóa Sửa Workspace",
        },
        {
            "name": "Project",
            "description": "Các API Lấy Thêm Xóa Sửa Project",
        },
                {
            "name": "Task",
            "description": "Các API Lấy Thêm Xóa Sửa Task",
        },
    ])

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Cho phép tất cả các phương thức (POST, GET, OPTIONS,...)
    allow_headers=["*"], # Cho phép tất cả các headers
)

# security = HTTPBearer()

# @app.get("/protected-route")
# async def protected_route(token: str = Depends(security)):
#     return {"message": "Bạn đã truy cập được bằng Bearer Token!"}

@app.on_event("startup")
async def init_db():
    async with engine.begin() as conn:
        # Lệnh này sẽ tạo tất cả các bảng đã định nghĩa trong Base.metadata
        await conn.run_sync(SQLModel.metadata.create_all)

# Kết nối router chính
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Vibe Coding API is running!"}