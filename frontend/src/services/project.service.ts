const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const projectService = {
  getProjectsByWorkspace: async (workspaceId: string, token: string) => {
    const response = await fetch(`${API_URL}/api/v1/project/workspace/${workspaceId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
  },

  createProject: async (
    token: string, 
    data: { workspace_id: string; name: string; description?: string; is_public: boolean }
  ) => {
    const response = await fetch(`${API_URL}/api/v1/project/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
  },
};