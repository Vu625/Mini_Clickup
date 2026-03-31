// export interface Workspace {
//   id: string;
//   name: string;
//   owner_id?: string;
// }
export interface Workspace {
  id: string;      // Mapping từ UUID
  name: string;
  owner_id: string;
}

export interface WorkspaceCreate {
  name: string;
}

export interface WorkspaceUpdate {
  name?: string;   // Optional giống như trong Pydantic
}
export interface InvitationCreate {
  invitee_email: string;
  role?: string; // Mặc định là "Member"
}

export interface Invitation {
  id: string;
  workspace_id: string;
  invitee_email: string;
  role: string;
  status: string; // "pending", "accepted", "declined"
}

export interface InvitationWithWorkspace extends Invitation {
  workspace_name: string;
  inviter_id: string;
}
export interface InvitationActionResponse {
  message: string;
  status: string;
}