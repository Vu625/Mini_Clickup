const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { TaskCreate,Task,TaskPriority,TaskUpdate,ChatRequest, ChatResponse,SemanticSearchRequest,TaskAIGenerateRequest } from "@/types/task";
export const taskService = {
  getTasksByProject: async (token: string,projectId: string) => {
    const response = await fetch(`${API_URL}/api/v1/task/project/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // if (!response.ok) throw new Error("Failed to fetch tasks");
    // return response.json();
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Không thể tải danh sách dự án");
    }
    return response.json();
  },
  createTask: async (token: string,data: TaskCreate):Promise<Task> => {
    const response = await fetch(`${API_URL}/api/v1/task/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  },
    updateTask: async (token: string,taskId: string,data: TaskUpdate): Promise<Task> => {
    const response = await fetch(`${API_URL}/api/v1/task/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
  },
  deleteTask: async (token: string, taskId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v1/task/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete task");
    }
    // Không return response.json() vì mã 204 không có body
  },
  /**
   * AI GENERATE: Sử dụng Gemini để tự động tạo danh sách Task từ Prompt
   */
  generateTasksAI: async (token: string, data: TaskAIGenerateRequest): Promise<Task[]> => {
    const res = await fetch(`${API_URL}/api/v1/task/generate-ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "AI không thể xử lý yêu cầu lúc này");
    }
    return res.json();
  },

  /**
   * SEMANTIC SEARCH: Tìm kiếm Task bằng ý nghĩa ngữ nghĩa qua Vector DB
   */
  semanticSearch: async (token: string, query: string, projectId?: string): Promise<Task[]> => {
    // Chuyển query params thành string: ?query=abc&project_id=xyz
    const params = new URLSearchParams({ query });
    if (projectId) params.append("project_id", projectId);

    const res = await fetch(`${API_URL}/api/v1/task/semantic-search?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Tìm kiếm thông minh thất bại");
    return res.json();
  },

  
  /**
   * AI CHAT (RAG): Hỏi đáp trực tiếp với trợ lý về dữ liệu của Project
   */
  chatWithAI: async (token: string, data: ChatRequest): Promise<ChatResponse> => {
    const res = await fetch(`${API_URL}/api/v1/task/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Trợ lý AI đang bận, vui lòng thử lại sau");
    return res.json();
  },

  /**
   * RETRY EMBEDDINGS: Ép buộc hệ thống quét lại các Task chưa được AI học
   */
  retryEmbeddings: async (token: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_URL}/api/v1/task/retry-embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Không thể thử lại đồng bộ lúc này");
    return res.json();
  }
};