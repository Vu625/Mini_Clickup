from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task
from app.services.vector_service import upsert_task_vector # Import hàm vừa tạo

async def sync_task_to_vector_db(task_id: UUID, db: AsyncSession):
    """
    Hàm Background: Chuyển text thành Vector và lưu vào ChromaDB.
    """
    statement = select(Task).where(Task.id == task_id)
    result = await db.execute(statement)
    task = result.scalar_one_or_none()
    
    if not task:
        print(f"[AI Agent] Không tìm thấy Task ID: {task_id}")
        return
    

    try:
    # 1. Chuẩn bị nội dung để Embed (Nên ghép cả Title và Description)
        text_to_embed = f"Tiêu đề: {task.title}\nMô tả: {task.description or 'Không có mô tả'}"
    
    # 2. Dữ liệu đính kèm (Metadata) giúp lọc (Filter) sau này
        metadata = {
            "project_id": str(task.project_id),
            "status": task.status,
        }
        # 3. Gọi Service đẩy vào ChromaDB
        upsert_task_vector(task_id=str(task.id), text=text_to_embed, metadata=metadata)
        
        # 4. Cập nhật cờ embedding_status thành True
        task.embedding_status = True
        db.add(task)
        await db.commit()
        print(f"[AI Agent] Đã Embed và lưu ChromaDB thành công Task: {task.title}")
        
    except Exception as e:
        print(f"[Lỗi AI Agent] Không thể Embed task {task.id}: {e}")