import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { useSession } from "next-auth/react";

const useAuthToken = () => {
  const { data: session } = useSession();
  return session?.accessToken;
};

/**
 * Hook tìm kiếm người dùng với cơ chế debounce/delay nhẹ từ phía UI
 */
export const useSearchUsers = (searchQuery: string) => {
  const token = useAuthToken();

  return useQuery({
    queryKey: ["users-search", searchQuery],
    queryFn: () => userService.searchUsers(token!, searchQuery),
    enabled: !!token && searchQuery.length >= 2, // Chỉ search khi có ít nhất 2 ký tự
    staleTime: 1000 * 60 * 5, // Cache kết quả trong 5 phút để tiết kiệm tài nguyên
  });
};