import uuid
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, UUIDIDMixin
from app.models.user import User
from app.core.config import settings
from app.db.session import get_user_db

class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = settings.SECRET_KEY
    verification_token_secret = settings.SECRET_KEY

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")
        # Tại đây bạn có thể gọi Background Task để tạo Workspace mặc định cho User

async def get_user_manager(user_db=Depends(get_user_db)): 
    yield UserManager(user_db)