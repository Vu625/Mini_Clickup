import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import { useSession } from "next-auth/react";

// Lấy accessToken từ Auth.js session (cần cấu hình type trong next-auth.d.ts)
export const useWorkspaces = () => {
  const { data: session } = useSession();
  const token = session?.accessToken; // Cast tạm thời, bạn có thể định nghĩa type sau

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => workspaceService.getWorkspaces(token!),
    enabled: !!token, // Chỉ gọi API khi đã có token
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (name: string) => workspaceService.createWorkspace(token!, { name }),
    onSuccess: () => {
      // Tự động invalidate để query load lại danh sách mới ngay lập tức
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};