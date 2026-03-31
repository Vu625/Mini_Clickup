import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useSession } from "next-auth/react";
import { WorkspaceCreate, WorkspaceUpdate } from "@/types/workspace";

// Lấy accessToken từ Auth.js session (cần cấu hình type trong next-auth.d.ts)
// export const useWorkspaces = () => {
//   const { data: session } = useSession();
//   const token = session?.accessToken;
//   return useQuery({
//     queryKey: ["workspaces"],
//     queryFn: () => workspaceService.getWorkspaces(token!),
//     enabled: !!token,
//   });
// };

// export const useCreateWorkspace = () => {
//   const queryClient = useQueryClient();
//   const { data: session } = useSession();
//   const token = session?.accessToken;

//   return useMutation({
//     mutationFn: (name: string) => workspaceService.createWorkspace(token!, { name }),
//     onSuccess: () => {
//       // Tự động invalidate để query load lại danh sách mới ngay lập tức
//       queryClient.invalidateQueries({ queryKey: ["workspaces"] });
//     },
//   });
// };


/**
 * Hook dùng chung để lấy Access Token từ Session
 * Giúp code gọn sạch hơn (DRY)
 */
const useAuthToken = () => {
  const { data: session } = useSession();
  return session?.accessToken;
};

// 1. Hook lấy danh sách Workspace
export const useWorkspaces = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceService.getWorkspaces(token!),
    enabled: !!token, // Chỉ chạy khi đã có token
  });
};

// 2. Hook tạo mới Workspace
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (data: WorkspaceCreate) => 
      workspaceService.createWorkspace(token!, data),
    onSuccess: () => {
      // Làm mới danh sách ngay lập tức sau khi tạo thành công
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

// 3. Hook cập nhật Workspace
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkspaceUpdate }) =>
      workspaceService.updateWorkspace(token!, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

// 4. Hook xóa Workspace
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (id: string) => workspaceService.deleteWorkspace(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};