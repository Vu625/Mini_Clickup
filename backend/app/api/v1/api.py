from fastapi import APIRouter
from app.api.v1.endpoints import auth, workspace, project, task

api_router = APIRouter()

# Đăng ký các module API tại đây
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(workspace.router, prefix="/workspace", tags=["Workspace"])
api_router.include_router(project.router, prefix="/project", tags=["Project"])
api_router.include_router(task.router,prefix="/task",tags=["Task"])

# Sau này sẽ thêm:
# api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])