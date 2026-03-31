// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// // import * as z from "zod";
// import { registerSchema,RegisterInput } from "@/schemas/auth"
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { authService } from "@/services/auth.service";
// import Link from "next/link";


// const RegisterPage = () => {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<RegisterInput>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: { full_name: "", email: "", password: "" },
//   });

  
//   const onSubmit = async (values: RegisterInput) => {
//     setError(null);
//     try{
//       await authService.register(values);
//       router.push("/login")
//     }catch (err){
//       setError(err instanceof Error ? err.message : "Lỗi không xác định");
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center p-4">
//       <div className="w-full max-w-sm p-6 border rounded-xl shadow-sm">
//         <h1 className="text-2xl font-bold mb-6 text-center">Tạo tài khoản</h1>
        
//         {error && <div className="text-red-500 mb-4 text-sm text-center">{error}</div>}

//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Họ và tên</label>
//             <input {...form.register("full_name")} className="w-full p-2 border rounded-md" placeholder="Nguyễn Văn A" />
//             {form.formState.errors.full_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.full_name.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Email</label>
//             <input {...form.register("email")} className="w-full p-2 border rounded-md" placeholder="email@example.com" />
//             {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Mật khẩu</label>
//             <input {...form.register("password")} type="password" className="w-full p-2 border rounded-md" placeholder="••••••••" />
//             {form.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>}
//           </div>

//           <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
//             Đăng ký
//           </button>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           Đã có tài khoản? <Link href="/login" className="text-blue-600 hover:underline">Đăng nhập</Link>
//         </p>
//       </div>
//     </div>
//   );
// };


// export default RegisterPage;
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  UserPlus, 
  ArrowRight, 
  Bot, 
  AlertCircle,
  ShieldCheck
} from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.register(values);
      // Có thể thêm một thông báo toast thành công ở đây
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor tương tự trang Login để tạo sự đồng bộ */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-200 mb-4 transform hover:-rotate-6 transition-transform">
            <Bot className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight text-center">
            Bắt đầu với <span className="text-emerald-600">AIPlanner</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-center">
            Tham gia cùng chúng tôi để tối ưu hiệu suất công việc
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Họ và tên</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  {...form.register("full_name")} 
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${form.formState.errors.full_name ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white`}
                  placeholder="Nguyễn Văn A" 
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.full_name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.full_name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  {...form.register("email")} 
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${form.formState.errors.email ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white`}
                  placeholder="name@example.com" 
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mật khẩu</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input 
                  {...form.register("password")} 
                  type="password"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border ${form.formState.errors.password ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white`}
                  placeholder="••••••••" 
                  disabled={isLoading}
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="flex items-start gap-2 py-2 px-1">
              <ShieldCheck className="text-emerald-500 mt-0.5" size={16} />
              <p className="text-[11px] text-slate-500 leading-tight">
                Bằng cách đăng ký, bạn đồng ý với các Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <UserPlus size={18} />
                  Tạo tài khoản
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="text-emerald-600 font-bold hover:underline underline-offset-4">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;