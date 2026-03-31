// export interface Project {
//   id: string;
//   workspace_id:string;
//   name: string;
//   description: string;
//   is_public: boolean;
//   // Thêm các trường khác nếu Backend có trả về
// }
export interface Project {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
}

export interface ProjectCreate {
  workspace_id: string;
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  is_public?: boolean;
}