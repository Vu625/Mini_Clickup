from google import genai
from app.core.config import settings
from app.services.vector_service import search_similar_tasks
from app.ai.prompts.chat_prompts import RAG_CHAT_PROMPT # Import prompt vừa tạo
from app.models.task import Task
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

# Khởi tạo client 2026 cho tính năng Chat
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def ask_chatbot_service(db: AsyncSession, query: str, project_id: str | None = None) -> str:
    # 1. Semantic Search: Tìm ID của top 5 task liên quan nhất trong ChromaDB
    matched_ids = search_similar_tasks(query=query, project_id=project_id, top_k=5)

    if not matched_ids:
        return "Hiện tại tôi không tìm thấy công việc nào liên quan đến câu hỏi của bạn."

    # 2. Truy xuất chi tiết từ PostgreSQL (để lấy Status, Priority thực tế)
    statement = select(Task).where(Task.id.in_([UUID(id) for id in matched_ids]))
    result = await db.execute(statement)
    tasks = result.scalars().all()

    # 3. Ép kiểu dữ liệu thành văn bản (Context)
    context_lines = []
    for t in tasks:
        # Bạn có thể format tùy ý, càng chi tiết AI càng trả lời hay
        context_lines.append(
            f"- Tên công việc: {t.title} | Trạng thái: {t.status} | "
            f"Ưu tiên: {t.priority.value} | Mô tả: {t.description or 'Không có'}"
        )
    context_str = "\n".join(context_lines)

    # 4. Ghép Context và Query vào Prompt
    final_prompt = RAG_CHAT_PROMPT.format(context=context_str, query=query)

    try:
        # 5. Gọi Gemini để sinh câu trả lời
        # Dùng model flash vì nó rất nhanh, phù hợp cho chatbot
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=final_prompt
        )
        return response.text
    except Exception as e:
        print(f"[Lỗi Chatbot] {e}")
        return "Xin lỗi, hệ thống AI đang bảo trì hoặc quá tải. Vui lòng thử lại sau."