# from sqlmodel import create_engine, Session
# from app.core.config import settings

# engine = create_engine(settings.DATABASE_URL)

# def get_session():
#     with Session(engine) as session:
#         yield session

from typing import AsyncGenerator
from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.config import settings

# Trong thực tế, chuỗi này nên được load từ settings/env
DATABASE_URL = settings.DATABASE_URL

# Khởi tạo Async Engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Khởi tạo Session Maker
async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session

# Đây chính là hàm get_user_db mà FastAPI Users đang tìm kiếm
async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)