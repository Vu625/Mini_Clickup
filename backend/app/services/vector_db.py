import asyncio
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task

async def sync_task_to_vector_db(task_id: UUID, db: AsyncSession):
    """
    Hàm này sẽ chạy ngầm (Background Task).
    Thực hiện: Chunking -> Embedding -> Lưu Vector DB.
    """
    # Lấy task mới nhất từ DB
    statement = select(Task).where(Task.id == task_id)
    result = await db.execute(statement)
    task = result.scalar_one_or_none()
    
    if not task:
        return

    # TODO: Tích hợp logic LangChain / OpenAI Embedding tại đây
    # Giả lập thời gian gọi API embedding mất 2 giây
    await asyncio.sleep(2) 
    print(f"[AI Agent] Đã chunk và embed thành công Task: {task.title}")
    
    # Cập nhật trạng thái
    task.embedding_status = True
    db.add(task)
    await db.commit()