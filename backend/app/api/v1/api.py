from fastapi import APIRouter
from app.api.v1.endpoints import auth, workspace, project, task, notification, user

api_router = APIRouter()

# Đăng ký các module API tại đây
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(workspace.router, prefix="/workspace", tags=["Workspace"])
api_router.include_router(project.router, prefix="/project", tags=["Project"])
api_router.include_router(task.router,prefix="/task",tags=["Task"])
api_router.include_router(notification.router,prefix="/notification",tags=["Notification"])
api_router.include_router(user.router,prefix="/user",tags=["User"])



# Sau này sẽ thêm:
# api_router.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])