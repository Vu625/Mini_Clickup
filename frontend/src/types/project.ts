export interface Project {
  id: string;
  workspace_id:string;
  name: string;
  description: string;
  is_public: boolean;
  // Thêm các trường khác nếu Backend có trả về
}