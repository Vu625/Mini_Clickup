const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const taskService = {
  getTasksByProject: async (projectId: string, token: string) => {
    const response = await fetch(`${API_URL}/api/v1/task/project/${projectId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  },

  createTask: async (
    token: string,
    data: { project_id: string; title: string; description?: string; priority?: string; status?: string }
  ) => {
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
  
  // Chuẩn bị sẵn hàm Update để sau này làm tính năng kéo thả (Drag & Drop)
  updateTask: async (
    token: string,
    taskId: string,
    data: { status?: string; title?: string; description?: string; priority?: string }
  ) => {
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
  }
};