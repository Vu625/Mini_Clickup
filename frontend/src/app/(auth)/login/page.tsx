"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Import các UI component từ Shadcn/ui (Button, Input, Form...)

// const loginSchema = z.object({
//   email: z.string().email("Email không hợp lệ"),
//   password: z.string().min(1, "Vui lòng nhập mật khẩu"),
// });

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      setError("Email hoặc mật khẩu không chính xác.");
    } else {
      router.push("/workspace"); // Chuyển hướng sau khi thành công
      router.refresh(); // Làm mới trạng thái ứng dụng
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 border rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập Mini-ClickUp</h1>
        
        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...form.register("email")} 
              className="w-full p-2 border rounded-md" 
              placeholder="nhap@email.com" 
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input 
              {...form.register("password")} 
              type="password"
              className="w-full p-2 border rounded-md" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;