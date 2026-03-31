
// export interface Task {
//   id: string;
//   project_id:string;
//   description: string;
//   title: string;
//   priority: string;
//   status: string;
//   assignee_id: string;
//   due_date: string;
//   created_at: string;
//   embedding_status: boolean
//   // Thêm các trường khác nếu Backend có trả về
// }
// export interface TaskUpdate {
//   title?: string;
//   description?: string;
//   priority?: string;
//   status?: string;
//   due_date?: string ;
//   // Thêm các trường khác nếu Backend có trả về
// }

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  URGENT = "Urgent", // Tùy chỉnh theo Enum Backend của bạn
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  priority: TaskPriority | string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  embedding_status: boolean; // Quan trọng để UI biết AI đã "học" task này chưa
}

export interface TaskCreate {
  project_id: string;
  title: string;
  description?: string;
  priority?: TaskPriority | string;
  status?: string;
  assignee_id?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority | string;
  status?: string;
  assignee_id?: string;
  due_date?: string;
}


// --- AI Generate Types ---
export interface TaskAIGenerateRequest {
  project_id: string;
  prompt: string; // Ví dụ: "Lên kế hoạch coding module Auth trong 3 ngày"
}

// --- Semantic Search Types ---
export interface SemanticSearchRequest {
  query: string;
  project_id?: string;
}

// --- RAG Chat Types ---
export interface ChatRequest {
  query: string;
  project_id?: string | null;
}

export interface ChatResponse {
  answer: string;
}