const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { User } from "@/types/user";

export const userService = {
  /**
   * Tìm kiếm người dùng theo email hoặc tên
   */
  searchUsers: async (token: string, query: string): Promise<User[]> => {
    const response = await fetch(`${API_URL}/api/v1/user/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Không thể tìm kiếm người dùng");
    }
    
    return response.json();
  },
};