const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const workspaceService = {
  getWorkspaces: async (token: string) => {
    const response = await fetch(`${API_URL}/api/v1/workspace/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch workspaces");
    return response.json();
  },

  createWorkspace: async (token: string, data: { name: string }) => {
    const response = await fetch(`${API_URL}/api/v1/workspace/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create workspace");
    return response.json();
  },
};