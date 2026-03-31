import google.generativeai as genai
import json
from app.core.config import settings
from app.ai.prompts.task_prompts import TASK_GENERATOR_PROMPT

genai.configure(api_key=settings.GEMINI_API_KEY)

async def generate_tasks_from_ai(user_input: str):
    model = genai.GenerativeModel('gemini-3-flash-preview')
    prompt = TASK_GENERATOR_PROMPT.format(user_input=user_input)

    response = await model.generate_content_async(prompt)
    # Parse JSON từ text trả về (cần xử lý xóa markdown ```json if any)
    # content = response.text.replace("```json", "").replace("```", "").strip()
    raw_text = response.text.strip()

# Xóa các markdown block thừa thãi mà AI hay tự thêm vào
    if raw_text.startswith("```json"):
        raw_text = raw_text.replace("```json", "", 1)
    if raw_text.endswith("```"):
        raw_text = raw_text.rsplit("```", 1)[0]

    try:
        data = json.loads(raw_text.strip())
        return data["tasks"]
    except json.JSONDecodeError:
    # Cực kỳ quan trọng: Nếu AI ngáo, quăng lỗi để Router báo 500 cho Frontend
        raise ValueError("AI trả về dữ liệu không đúng chuẩn JSON.")
    # return json.loads(content)["tasks"]