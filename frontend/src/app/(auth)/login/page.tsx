// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import * as z from "zod";
// import { loginSchema, LoginInput } from "@/schemas/auth";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import Link from "next/link";


// const LoginPage = () => {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<LoginInput>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   const onSubmit = async (values: LoginInput) => {
//     setError(null);
//     const result = await signIn("credentials", {
//       redirect: false,
//       email: values.email,
//       password: values.password,
//     });

//     if (result?.error) {
//       setError("Email hoặc mật khẩu không chính xác.");
//     } else {
//       router.push("/workspace"); // Chuyển hướng sau khi thành công
//       router.refresh(); // Làm mới trạng thái ứng dụng
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-sm p-6 border rounded-xl shadow-sm">
//         <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập Mini-ClickUp</h1>
        
//         {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input 
//               {...form.register("email")} 
//               className="w-full p-2 border rounded-md" 
//               placeholder="nhap@email.com" 
//             />
//             {form.formState.errors.email && (
//               <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Mật khẩu</label>
//             <input 
//               {...form.register("password")} 
//               type="password"
//               className="w-full p-2 border rounded-md" 
//               placeholder="••••••••" 
//             />
//           </div>

//           <button 
//             type="submit" 
//             className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
//           >
//             Đăng nhập
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           Chưa có tài khoản ? <Link href="/register" className="text-blue-600 hover:underline">Đăng kí</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  Loader2, 
  ArrowRight, 
  Bot, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError("Email hoặc mật khẩu không chính xác.");
      } else {
        router.push("/workspace");
        router.refresh();
      }
    } catch (e) {
      setError("Đã xảy ra lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 mb-4 transform hover:rotate-6 transition-transform">
            <Bot className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Chào mừng <span className="text-emerald-600">trở lại!</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Đăng nhập để tiếp tục quản lý dự án</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  {...form.register("email")} 
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border ${form.formState.errors.email ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white`}
                  placeholder="name@example.com" 
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mật khẩu</label>
                <Link href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Quên mật khẩu?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  {...form.register("password")} 
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white"
                  placeholder="••••••••" 
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-emerald-600 font-bold hover:underline underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-slate-400">
          © 2026 AIPlanner System. Bảo mật & Thông minh.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;