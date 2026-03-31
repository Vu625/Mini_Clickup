const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { Notification, MarkReadResponse } from "@/types/notification";

export const notificationService = {
  /**
   * Lấy danh sách thông báo của người dùng hiện tại
   */
  getNotifications: async (token: string): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/api/v1/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Không thể tải thông báo");
    return response.json();
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  markAsRead: async (token: string, notificationId: string): Promise<MarkReadResponse> => {
    const response = await fetch(`${API_URL}/api/v1/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Thao tác thất bại");
    return response.json();
  },
};

