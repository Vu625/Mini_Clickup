import chromadb
from uuid import UUID
from google import genai
from typing import List, Optional
from app.core.config import settings

# Khởi tạo ChromaDB lưu trữ cục bộ (trong thư mục chroma_db)
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="tasks_collection")

# Cấu hình Gemini
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def upsert_task_to_vector_db(task_id: UUID, text: str, metadata: dict):
    # Sử dụng embedding mặc định của Chroma hoặc gọi Gemini Embedding API
    collection.upsert(
        ids=[str(task_id)],
        documents=[text],
        metadatas=[metadata]
    )


# def get_gemini_embedding(text: str) -> list[float]:
#     """Sử dụng model embedding của Gemini để biến text thành vector"""
#     result = genai.embed_content(
#         model="models/embedding-001", # Model chuyên dùng cho text embedding
#         content=text,
#         task_type="retrieval_document"
#     )
#     return result['embedding']

def get_gemini_embedding(text: str) -> list[float]:
    """Thử nghiệm với model text-embedding-004 hoặc embedding-001"""
    try:
        # Cách 1: Thử với tên đầy đủ và chuẩn xác nhất
        result = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=text
        )
        return result.embeddings[0].values
    except Exception as e:
        print(f"[Lỗi Embedding 2026] {e}")
        raise e

def upsert_task_vector(task_id: str, text: str, metadata: dict):
    """Lưu hoặc cập nhật Vector vào ChromaDB"""
    embedding = get_gemini_embedding(text)
    collection.upsert(
        ids=[task_id],
        embeddings=[embedding],
        documents=[text],
        metadatas=[metadata]
    )

def search_similar_tasks(query: str, project_id: Optional[str] = None, top_k: int = 5) -> List[str]:
    """Tìm kiếm task có ý nghĩa tương tự câu query"""
    query_embedding = get_gemini_embedding(query)
    
    # Chỉ tìm trong phạm vi Project cụ thể (nếu có truyền vào)
    where_clause = {"project_id": project_id} if project_id else None

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_clause
    )
    
    # Trả về danh sách các Task ID tìm được
    return results['ids'][0] if results['ids'] else []