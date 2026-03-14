import { RegisterInput } from "@/schemas/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async register(values: RegisterInput) {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Đăng ký thất bại");
    }

    return res.json();
  },
  
  // Bạn có thể thêm các hàm khác như logout, forgot-password vào đây
};