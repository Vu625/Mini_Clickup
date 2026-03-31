from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.vector_service import search_similar_tasks
from app.db.session import get_async_session
from app.core.fastapi_users_config import current_active_user
from app.models.user import User
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate, TaskAIGenerateRequest
from app.crud import task as crud_task
from app.services.vector_db import sync_task_to_vector_db
from app.services import task_service
from app.services import chat_service
from sqlalchemy import select
from app.schemas.chat import ChatRequest, ChatResponse
router = APIRouter()


@router.get("/project/{project_id}", response_model=List[TaskRead])
async def list_tasks(
    project_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy danh sách task trong project."""
    return await crud_task.get_tasks_by_project(db, project_id=project_id)

@router.post("/", response_model=TaskRead)
async def create_new_task(
    *,
    db: AsyncSession = Depends(get_async_session),
    obj_in: TaskCreate,
    background_tasks: BackgroundTasks, # Inject BackgroundTasks
    current_user: User = Depends(current_active_user)
):
    """Tạo Task mới và trigger sync Vector DB."""
    # (Optional) Thêm logic check quyền: User có trong ProjectMember không?
    
    task = await crud_task.create_task(db, obj_in=obj_in)
    
    # Đẩy tác vụ embedding chạy ngầm, API lập tức trả về cho Frontend
    background_tasks.add_task(sync_task_to_vector_db, task.id, db)
    
    return task

# @router.put("/{task_id}", response_model=TaskRead)
# async def update_existing_task(
#     task_id: UUID,
#     obj_in: TaskUpdate,
#     background_tasks: BackgroundTasks,
#     db: AsyncSession = Depends(get_async_session),
#     current_user: User = Depends(current_active_user)
# ):
#     """Cập nhật Task và đồng bộ lại Vector DB nếu cần."""
#     # (Optional) Check quyền
    
#     statement = select(Task).where(Task.id == task_id)
#     result = await db.execute(statement)
#     db_obj = result.scalar_one_or_none()
    
#     if not db_obj:
#         raise HTTPException(status_code=404, detail="Task not found")
        
#     updated_task = await crud_task.update_task(db, db_obj=db_obj, obj_in=obj_in)
    
#     # Nếu cờ embedding bị reset về False (do đổi tên/mô tả), trigger chạy lại ngầm
#     if not updated_task.embedding_status:
#         background_tasks.add_task(sync_task_to_vector_db, updated_task.id, db)
        
#     return updated_task

@router.put("/{task_id}", response_model=TaskRead)
async def update_existing_task(
    task_id: UUID,
    obj_in: TaskUpdate,
    background_tasks: BackgroundTasks, # Giữ lại để chạy ngầm AI
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """
    Cập nhật Task với 3 tầng xử lý:
    1. Kiểm tra quyền (Owner/Assignee).
    2. Gửi thông báo nếu xong việc (Done).
    3. Đồng bộ lại Vector DB nếu đổi nội dung.
    """
    
    # 1. Gọi Service xử lý phân quyền và update (hàm chúng ta viết ở bước trước)
    # Lưu ý: Bạn nên đưa logic sync_task_to_vector_db vào cuối hàm này hoặc xử lý tại đây
    updated_task = await task_service.update_task_with_permission(db, task_id, obj_in, current_user)
    
    # 2. KIỂM TRA ĐỒNG BỘ VECTOR DB (Giữ lại logic này)
    # Nếu cờ embedding bị reset về False (do CRUD update_task đã xử lý bên trong)
    if not updated_task.embedding_status:
        background_tasks.add_task(sync_task_to_vector_db, updated_task.id, db)
        
    return updated_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Xóa một công việc theo ID."""
    await task_service.delete_task_service(
        db=db, 
        task_id=task_id, 
        current_user=current_user
    )
    # Với mã 204 No Content, FastAPI sẽ không trả về nội dung gì, chỉ báo thành công.
    return None


@router.post("/generate-ai", response_model=List[TaskRead], status_code=status.HTTP_201_CREATED)
async def generate_tasks_via_ai(
    request: TaskAIGenerateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """
    Sử dụng Gemini AI để phân tích Prompt và tự động tạo danh sách Task.
    """
    try:
        # Gọi Service Layer để xử lý logic AI và lưu vào DB
        generated_tasks = await task_service.ai_generate_and_save_tasks(
            db=db,
            project_id=request.project_id,
            user_input=request.prompt,
            current_user=current_user
        )
        for task in generated_tasks:
            background_tasks.add_task(sync_task_to_vector_db, task.id, db)
        return generated_tasks
        
    except Exception as e:
        # Bắt lỗi nếu Gemini bị timeout hoặc trả về JSON sai định dạng
        print(f"Lỗi AI Generator: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Hệ thống AI đang bận hoặc không thể xử lý yêu cầu này. Vui lòng thử lại!"
        )
    

@router.get("/semantic-search", response_model=List[TaskRead])
async def semantic_search_endpoint(
    query: str, # Ví dụ: "việc liên quan đến code"
    project_id: str | None = None,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Tìm kiếm Task bằng AI (Semantic Search)"""
    
    # 1. Tìm các ID liên quan từ Vector DB (ChromaDB)
    matched_ids = search_similar_tasks(
        query=query, 
        project_id=str(project_id) if project_id else None
    )

    if not matched_ids:
        return []

    # 2. Dùng các ID đó để query lấy dữ liệu thật từ bảng Tasks (PostgreSQL)
    statement = select(Task).where(Task.id.in_([UUID(id) for id in matched_ids]))
    result = await db.execute(statement)
    tasks = result.scalars().all()

    # 3. Mẹo nhỏ: PostgreSQL trả về không theo thứ tự điểm số của ChromaDB.
    # Ta cần sắp xếp lại danh sách Task đúng theo thứ tự độ tương đồng từ cao xuống thấp.
    task_dict = {str(t.id): t for t in tasks}
    sorted_tasks = [task_dict[id] for id in matched_ids if id in task_dict]

    return sorted_tasks

# Bạn có thể tạo 1 endpoint tạm thời /api/v1/task/retry-embeddings
@router.post("/retry-embeddings")
async def retry_failed_embeddings(
    db: AsyncSession = Depends(get_async_session)
):
    statement = select(Task).where(Task.embedding_status == False)
    result = await db.execute(statement)
    failed_tasks = result.scalars().all()
    
    count = 0
    for task in failed_tasks:
        try:
            # Gọi lại hàm sync mà bạn đã viết
            await sync_task_to_vector_db(task.id, db)
            count += 1
        except:
            continue
            
    return {"message": f"Đã thử lại thành công cho {count} tasks"}


@router.post("/chat", response_model=ChatResponse)
async def chat_with_project_assistant(
    request: ChatRequest,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """
    Chatbot AI trả lời câu hỏi dựa trên dữ liệu Task của dự án (RAG).
    """
    answer = await chat_service.ask_chatbot_service(
        db=db, 
        query=request.query, 
        project_id=str(request.project_id) if request.project_id else None
    )
    
    return ChatResponse(answer=answer)

@router.get("/me/assigned", response_model=List[TaskRead])
async def list_my_assigned_tasks(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user)
):
    """Lấy tất cả các task mà tôi được gán ở mọi project/workspace."""
    statement = select(Task).where(Task.assignee_id == current_user.id)
    result = await db.execute(statement)
    return result.scalars().all()

# @router.put("/{task_id}/permission-update", response_model=TaskRead)
# async def secure_update_task(
#     task_id: UUID,
#     obj_in: TaskUpdate,
#     db: AsyncSession = Depends(get_async_session),
#     current_user: User = Depends(current_active_user)
# ):
#     """Cập nhật task với logic phân quyền Owner/Assignee."""
#     return await task_service.update_task_with_permission(db, task_id, obj_in, current_user)