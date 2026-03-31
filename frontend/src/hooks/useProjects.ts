import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import { useSession } from "next-auth/react";
import { ProjectCreate, ProjectUpdate } from "@/types/project";

// export const useProjects = (workspaceId: string) => {
//   const { data: session } = useSession();
//   const token = session?.accessToken;

//   return useQuery({
//     queryKey: ["projects", workspaceId],
//     queryFn: () => projectService.getProjectsByWorkspace(workspaceId, token!),
//     enabled: !!token && !!workspaceId, // Phải có cả token và workspaceId mới gọi API
//   });
// };

// export const useCreateProject = (workspaceId: string) => {
//   const queryClient = useQueryClient();
//   const { data: session } = useSession();
//   const token = session?.accessToken;

//   return useMutation({
//     mutationFn: (data: { name: string; description?: string; is_public: boolean }) => 
//       projectService.createProject(token!, { ...data, workspace_id: workspaceId }),
//     onSuccess: () => {
//       // Invalidate đúng queryKey của workspace hiện tại để re-fetch
//       queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
//     },
//   });
// };



/**
 * Hook bổ trợ lấy token để tránh lặp code
 */
const useAuthToken = () => {
  const { data: session } = useSession();
  return session?.accessToken;
};

// 1. Hook lấy danh sách Project theo Workspace
export const useProjects = (workspaceId: string) => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getProjectsByWorkspace(token!, workspaceId),
    enabled: !!token && !!workspaceId,
  });
};

// 2. Hook tạo Project mới
export const useCreateProject = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (data: Omit<ProjectCreate, "workspace_id">) =>
      projectService.createProject(token!, { ...data, workspace_id: workspaceId }),
    onSuccess: () => {
      // Chỉ làm mới danh sách project của workspace hiện tại
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
};

// 3. Hook cập nhật Project
export const useUpdateProject = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: ProjectUpdate }) =>
      projectService.updateProject(token!, projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
};

// 4. Hook xóa Project
export const useDeleteProject = (workspaceId: string) => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (projectId: string) => 
      projectService.deleteProject(token!, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
};