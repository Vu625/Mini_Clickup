// import { auth } from "@/auth";
// import Link from "next/link";
// import LogoutButton from "@/components/auth/LogoutButton";

// export default async function HomePage() {
//   // Lấy session trực tiếp từ server
//   const session = await auth();

//   return (
//     <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-6">
//       <h1 className="text-4xl font-bold">Mini-ClickUp</h1>
      
//       {!session ? (
//         // UI khi chưa đăng nhập
//         <div className="text-center space-y-4">
//           <p className="text-gray-600">Trợ lý ảo thông minh hỗ trợ lập kế hoạch và điều phối công việc.</p>
//           <div className="flex gap-4 justify-center">
//             <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
//               Đăng nhập
//             </Link>
//             <Link href="/register" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
//               Đăng ký
//             </Link>
//           </div>
//         </div>
//       ) : (
//         // UI khi đã đăng nhập
//         <div className="text-center space-y-4 p-6 border rounded-xl shadow-sm w-full max-w-md">
//           <p className="text-xl">Chào mừng bạn trở lại!</p>
//           <p className="text-sm text-gray-500 break-all">
//             Access Token (Test): {session.accessToken?.substring(0, 20)}...
//           </p>
          
//           <div className="flex flex-col gap-3 mt-6">
//             <Link href="/dashboard" className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
//               Vào Workspace của bạn
//             </Link>
//             <LogoutButton />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import { 
  Sparkles, 
  ArrowRight, 
  LayoutDashboard, 
  Zap, 
  ShieldCheck, 
  Bot,
  CheckCircle2
} from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Navigation (Simple) */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Bot className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
            AI<span className="text-emerald-600">Planner</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition">
              Đăng nhập
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-8 animate-fade-in">
          <Sparkles size={16} />
          <span>Nền tảng quản lý công việc thế hệ mới</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8 max-w-4xl">
          Lập kế hoạch thông minh hơn với <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Trợ lý AI</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Tối ưu hóa quy trình làm việc của bạn bằng công nghệ Semantic Search và tự động hóa tác vụ. Quản lý dự án chưa bao giờ nhanh chóng và cá nhân hóa đến thế.
        </p>

        {!session ? (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link 
              href="/register" 
              className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              Bắt đầu miễn phí
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            {/* <Link 
              href="/login" 
              className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Xem bản Demo
            </Link> */}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            <Link 
              href="/workspace" 
              className="group px-10 py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 transition-all flex items-center gap-3"
            >
              <LayoutDashboard size={22} />
              Vào Workspace của bạn
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-slate-400 italic">
              Chào mừng trở lại, <span className="text-emerald-600 font-semibold">{session.user?.name}</span>
            </p>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors text-left group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Tốc độ & Hiệu quả</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Tạo hàng chục task chỉ với một câu lệnh prompt nhờ sức mạnh của AI.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors text-left group">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">AI Semantic Search</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Tìm kiếm task theo ý nghĩa thay vì chỉ từ khóa. AI hiểu bạn đang cần tìm gì.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors text-left group">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Bảo mật tối đa</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Dữ liệu của bạn được phân quyền chặt chẽ và lưu trữ an toàn trên hệ thống.
            </p>
          </div>
        </div>
      </main>

      {/* Footer (Simple) */}
      <footer className="border-t border-slate-100 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>© 2026 AIPlanner. Phát triển bởi Vu & Team AI.</p>
        </div>
      </footer>
    </div>
  );
}

// Icon helper bổ sung
function ChevronRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}