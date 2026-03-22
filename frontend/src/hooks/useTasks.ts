import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { useSession } from "next-auth/react";
import { Task,TaskUpdate } from "@/types/task";
export const useTasks = (projectId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskService.getTasksByProject(projectId, token!),
    enabled: !!token && !!projectId,
  });
};

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (data: { title: string; description?: string; priority?: string; status?: string }) =>
      taskService.createTask(token!, { ...data, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

// Hook để update task (đổi status khi kéo thả)
// export const useUpdateTask = (projectId: string) => {
//   const queryClient = useQueryClient();
//   const { data: session } = useSession();
//   const token = session?.accessToken;

//   return useMutation({
//     mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdate }) =>
//       taskService.updateTask(token!, taskId, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
//     },
//   });
// };
export const useUpdateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: TaskUpdate }) =>
      taskService.updateTask(token!, taskId, data),

    // 1. Chạy ngay lập tức khi bạn vừa nhả chuột (onMutate)
    onMutate: async ({ taskId, data }) => {
      // Hủy mọi request đang fetch cùng queryKey để tránh dữ liệu cũ đè lên dữ liệu lạc quan
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });

      // Chụp lại "bức ảnh" của danh sách tasks hiện tại để phòng trường hợp cần Rollback
      const previousTasks = queryClient.getQueryData(["tasks", projectId]);

      // Cập nhật Cache của React Query ngay lập tức với dữ liệu mới (status mới)
      // queryClient.setQueryData(["tasks", projectId], (old: Task[]) => {
      //   if (!old) return [];
      //   return old.map((task) =>
      //     task.id === taskId ? { ...task, ...data } : task
      //   );
      // });
      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) => {
    // Nếu chưa có dữ liệu cũ trong cache, trả về mảng rỗng hoặc list mới
    if (!old) return []; 
    
    // Duyệt qua danh sách, tìm đúng TaskId để merge data mới vào
    return old.map((task) =>
      task.id === taskId ? { ...task, ...data } : task
    );
  });

      // Trả về snapshot để dùng ở bước onError nếu lỡ có chuyện gì
      return { previousTasks };
    },

    // 2. Nếu API Backend báo lỗi (ví dụ: mất mạng, lỗi server)
    onError: (err, newTodo, context) => {
      // Khôi phục lại "bức ảnh" dữ liệu cũ
      queryClient.setQueryData(["tasks", projectId], context?.previousTasks);
      console.error("Lỗi khi update task, đã khôi phục UI:", err);
      // Bạn có thể gắn thêm Toast notification ở đây: toast.error("Cập nhật thất bại!")
    },

    // 3. Khi mọi thứ đã ngã ngũ (Dù thành công hay thất bại)
    onSettled: () => {
      // Gọi một cú fetch nhẹ ở background để đảm bảo UI đồng bộ 100% với sự thật từ Database
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};