import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useSession } from "next-auth/react";
import { InvitationCreate } from "@/types/workspace";

// Helper hook để lấy token từ session
const useAuthToken = () => {
  const { data: session } = useSession();
  return session?.accessToken;
};

/**
 * Hook lấy danh sách lời mời dành cho người dùng hiện tại
 */
export const useMyInvitations = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["my-invitations"],
    queryFn: () => workspaceService.getMyInvitations(token!),
    enabled: !!token, // Chỉ chạy khi đã có token
  });
};

/**
 * Hook gửi lời mời tham gia Workspace
 */
export const useInviteMember = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (data: InvitationCreate) => 
      workspaceService.inviteMember(token!, workspaceId, data),
    onSuccess: () => {
      // Refresh lại danh sách nếu bạn có hiển thị danh sách "Lời mời đã gửi"
      queryClient.invalidateQueries({ queryKey: ["workspace-invites", workspaceId] });
    },
  });
};

/**
 * Hook chấp nhận lời mời (Bạn đã có - Giữ nguyên để đồng bộ)
 */
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (invitationId: string) => 
      workspaceService.acceptInvitation(token!, invitationId),
    onSuccess: () => {
      // Làm mới danh sách lời mời và danh sách Workspace để thấy cái mới gia nhập
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

/**
 * Hook từ chối lời mời
 */
export const useDeclineInvitation = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (invitationId: string) => 
      workspaceService.declineInvitation(token!, invitationId),
    onSuccess: () => {
      // Xóa lời mời khỏi danh sách hiện tại
      queryClient.invalidateQueries({ queryKey: ["my-invitations"] });
    },
  });
};