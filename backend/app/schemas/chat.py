from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ChatRequest(BaseModel):
    query: str = "Có công việc nào đang bị trễ hạn hoặc cần làm gấp không?"
    project_id: Optional[UUID] = None

class ChatResponse(BaseModel):
    answer: str