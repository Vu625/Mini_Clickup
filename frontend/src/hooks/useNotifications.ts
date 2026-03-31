import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { useSession } from "next-auth/react";

// Helper lấy token
const useAuthToken = () => {
  const { data: session } = useSession();
  return session?.accessToken;
};

/**
 * Hook lấy danh sách thông báo
 */
export const useNotifications = () => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(token!),
    enabled: !!token,
    refetchInterval: 30000, // Tự động làm mới mỗi 30 giây (Polling nhẹ)
  });
};

/**
 * Hook đánh dấu đã đọc
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.markAsRead(token!, notificationId),
    onSuccess: () => {
      // Cập nhật lại danh sách thông báo để đổi màu/trạng thái UI
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};