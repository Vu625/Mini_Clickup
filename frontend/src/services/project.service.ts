const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Project,ProjectCreate,ProjectUpdate } from "@/types/project";
export const projectService = { 
  getProjectsByWorkspace: async (token: string,workspaceId: string): Promise<Project[]> => {
    const response = await fetch(`${API_URL}/api/v1/project/workspace/${workspaceId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // if (!response.ok) throw new Error("Failed to fetch projects");
    // return response.json();
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Không thể tải danh sách dự án");
    }
    return response.json();
  },

  createProject: async (token: string, data: ProjectCreate): Promise<Project> => {
    const response = await fetch(`${API_URL}/api/v1/project/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    // if (!response.ok) throw new Error("Failed to create project");
    // return response.json();
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Tạo dự án thất bại");
    }
    return response.json();
  },
  updateProject: async (token: string, projectId: string, data: ProjectUpdate): Promise<Project> => {
    const response = await fetch(`${API_URL}/api/v1/project/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Cập nhật dự án thất bại");
    }
    return response.json();
  },
  deleteProject: async (token: string, projectId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/api/v1/project/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Xóa dự án thất bại");
    }
    return response.json();
  },
};