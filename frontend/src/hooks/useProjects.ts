import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { useSession } from "next-auth/react";

export const useProjects = (workspaceId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getProjectsByWorkspace(workspaceId, token!),
    enabled: !!token && !!workspaceId, // Phải có cả token và workspaceId mới gọi API
  });
};

export const useCreateProject = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (data: { name: string; description?: string; is_public: boolean }) => 
      projectService.createProject(token!, { ...data, workspace_id: workspaceId }),
    onSuccess: () => {
      // Invalidate đúng queryKey của workspace hiện tại để re-fetch
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
};