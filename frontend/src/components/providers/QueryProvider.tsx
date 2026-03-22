"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Dùng useState để đảm bảo QueryClient chỉ khởi tạo 1 lần trên mỗi phiên client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dữ liệu sẽ fresh trong 1 phút trước khi refetch
        refetchOnWindowFocus: false, // Tắt cái này đi cho đỡ gọi API liên tục khi dev
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}