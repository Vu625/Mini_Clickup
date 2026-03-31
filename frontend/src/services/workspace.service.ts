const API_URL = process.env.NEXT_PUBLIC_API_URL;
import {Workspace, WorkspaceUpdate, InvitationCreate, Invitation, InvitationWithWorkspace, InvitationActionResponse} from "@/types/workspace"

export const workspaceService = {
  getWorkspaces: async (token: string): Promise<Workspace[]> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể tải danh sách Workspace");
    return response.json();
  },

  createWorkspace: async (token: string, data: { name: string }): Promise<Workspace> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Tạo Workspace thất bại");
    return response.json();
  },
  updateWorkspace: async (token: string, workspaceId: string, data: WorkspaceUpdate): Promise<Workspace> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/${workspaceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Cập nhật Workspace thất bại");
    return response.json();
  },
  deleteWorkspace: async (token: string, workspaceId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/${workspaceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Xóa Workspace thất bại");
    }
    return response.json();
  },
  inviteMember: async (
    token: string, 
    workspaceId: string, 
    data: InvitationCreate
  ): Promise<Invitation> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/${workspaceId}/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Không thể gửi lời mời");
    }
    return response.json();
  },

  /**
   * Lấy danh sách lời mời dành cho User hiện tại (theo email của họ)
   */
  getMyInvitations: async (token: string): Promise<InvitationWithWorkspace[]> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/invitations/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể tải danh sách lời mời");
    return response.json();
  },

  /**
   * Chấp nhận lời mời gia nhập Workspace
   */
  acceptInvitation: async (token: string, invitationId: string): Promise<InvitationActionResponse> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/invitations/${invitationId}/accept`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Chấp nhận lời mời thất bại");
    return response.json();
  },

  /**
   * Từ chối lời mời
   */
  declineInvitation: async (token: string, invitationId: string): Promise<InvitationActionResponse> => {
    const response = await fetch(`${API_URL}/api/v1/workspace/invitations/${invitationId}/decline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Từ chối lời mời thất bại");
    return response.json();
  },
};