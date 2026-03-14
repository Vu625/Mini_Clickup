"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
import { registerSchema,RegisterInput } from "@/schemas/auth"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import Link from "next/link";

// Validate dữ liệu bằng Zod
// const registerSchema = z.object({
//   full_name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
//   email: z.string().email("Email không hợp lệ"),
//   password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
// });

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  // const onSubmit = async (values: RegisterInput) => {
  //   setError(null);
  //   try {
  //     // Gọi API Đăng ký của FastAPI (thêm full_name theo schema của bạn) /api/v1/auth/register
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(values),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.detail || "Đăng ký thất bại");
  //     }

  //     // Đăng ký thành công -> Đẩy về trang Login
  //     router.push("/login");
  //   } catch (err) {
  //     if (err instanceof Error){
  //       setError(err.message)
  //     }else{
  //       setError("Lỗi không xác định")
  //     }
  //   }
  // };
  const onSubmit = async (values: RegisterInput) => {
    setError(null);
    try{
      await authService.register(values);
      router.push("/login")
    }catch (err){
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 border rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản</h1>
        
        {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên</label>
            <input {...form.register("full_name")} className="w-full p-2 border rounded-md" placeholder="Nguyễn Văn A" />
            {form.formState.errors.full_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.full_name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input {...form.register("email")} className="w-full p-2 border rounded-md" placeholder="email@example.com" />
            {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input {...form.register("password")} type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
            {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
            Đăng ký
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};


export default RegisterPage;