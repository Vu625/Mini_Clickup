from uuid import UUID
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.task import Task
from app.models.user import User
from app.crud import task as crud_task
from app.ai.agents.task_agent import generate_tasks_from_ai
from app.services.vector_service import upsert_task_to_vector_db
from fastapi import HTTPException, status
from app.models.workspace import Workspace
from app.schemas.task import TaskUpdate
from app.services.vector_service import upsert_task_vector
async def delete_task_service(db: AsyncSession, task_id: UUID, current_user: User):
    # 1. Tìm Task trong DB
    statement = select(Task).where(Task.id == task_id)
    result = await db.execute(statement)
    db_obj = result.scalar_one_or_none()

    # 2. Nếu không thấy Task
    if not db_obj:
        raise HTTPException(status_code=404, detail="Không tìm thấy công việc này.")

    # 3. Kiểm tra quyền (Ví dụ: Bạn có thể cần join với Project/Workspace để check sâu hơn, 
    # nhưng tạm thời chúng ta check xem user có login là được, hoặc logic riêng của bạn)
    # Ở đây tôi giả sử bất kỳ ai login cũng có thể xóa, hoặc bạn thêm logic check Owner tại đây.

    # 4. Thực hiện xóa
    return await crud_task.delete_task(db, db_obj=db_obj)


async def ai_generate_and_save_tasks(
    db: AsyncSession, 
    project_id: UUID, 
    user_input: str,
    current_user: User
):
    # 1. Gọi AI để lấy danh sách task
    ai_tasks = await generate_tasks_from_ai(user_input)
    
    saved_tasks = []
    for task_data in ai_tasks:
        # 2. Lưu vào Postgres
        new_task = Task(
            project_id=project_id,
            title=task_data["title"],
            description=task_data["description"],
            assignee_id=current_user.id,
            embedding_status=False
        )
        db.add(new_task)
        await db.flush() # Để lấy ID của task
        
        # 3. Đẩy vào ChromaDB để phục vụ Semantic Search sau này
        full_text = f"{new_task.title}: {new_task.description}"
        upsert_task_vector(
            task_id=str(new_task.id), 
            text=full_text,
            metadata={"project_id": str(project_id)}
        )   
        new_task.embedding_status = True
        saved_tasks.append(new_task)
    
    await db.commit()
    return saved_tasks



async def check_is_owner(db: AsyncSession, project_id: UUID, user_id: UUID):
    # Tìm workspace chứa project này và kiểm tra owner_id
    # Giả sử Project có trường workspace_id (bạn có thể điều chỉnh theo model của bạn)
    from app.models.project import Project 
    
    stmt = select(Workspace.owner_id).join(Project).where(Project.id == project_id)
    result = await db.execute(stmt)
    owner_id = result.scalar_one_or_none()
    
    if owner_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Chỉ chủ sở hữu Workspace mới có quyền thực hiện hành động này."
        )

async def update_task_with_permission(
    db: AsyncSession, 
    task_id: UUID, 
    obj_in: TaskUpdate, 
    current_user: User
):
    # 1. Lấy Task hiện tại
    stmt = select(Task).where(Task.id == task_id)
    result = await db.execute(stmt)
    db_obj = result.scalar_one_or_none()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Task not found")

    # 2. Kiểm tra quyền
    # Lấy owner_id của Workspace chứa task này
    from app.models.project import Project
    owner_stmt = select(Workspace.owner_id).join(Project).where(Project.id == db_obj.project_id)
    owner_id = (await db.execute(owner_stmt)).scalar_one_or_none()

    is_owner = owner_id == current_user.id
    is_assignee = db_obj.assignee_id == current_user.id

    # Logic phân quyền:
    # - Nếu đổi status: Owner hoặc Assignee đều được làm.
    # - Nếu đổi bất kỳ thứ gì khác (title, priority, assignee_id...): Chỉ Owner được làm.
    update_data = obj_in.model_dump(exclude_unset=True)
    
    other_fields = {k: v for k, v in update_data.items() if k != "status"}
    
    if other_fields and not is_owner:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa nội dung Task này.")
    
    if "status" in update_data and not (is_owner or is_assignee):
        raise HTTPException(status_code=403, detail="Bạn không có quyền cập nhật trạng thái Task này.")

    # 3. Thực hiện update
    updated_task = await crud_task.update_task(db, db_obj=db_obj, obj_in=obj_in)

    # 4. Gửi thông báo nếu Status chuyển sang "Done"
    if updated_task.status == "Done" and is_assignee:
        from app.models.notification import Notification
        new_notif = Notification(
            receiver_id=owner_id,
            content=f"Công việc '{updated_task.title}' đã được hoàn thành bởi {current_user.full_name}"
        )
        db.add(new_notif)
        await db.commit()

    return updated_task