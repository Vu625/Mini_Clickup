export interface Task {
  id: string;
  project_id:string;
  description: string;
  title: string;
  priority: string;
  status: string;
  assignee_id: string;
  due_date: string;
  created_at: string;
  embedding_status: boolean
  // Thêm các trường khác nếu Backend có trả về
}
export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string ;
  // Thêm các trường khác nếu Backend có trả về
}