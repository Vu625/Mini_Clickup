import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function HomePage() {
  // Lấy session trực tiếp từ server
  const session = await auth();

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-bold">Mini-ClickUp</h1>
      
      {!session ? (
        // UI khi chưa đăng nhập
        <div className="text-center space-y-4">
          <p className="text-gray-600">Trợ lý ảo thông minh hỗ trợ lập kế hoạch và điều phối công việc.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              Đăng ký
            </Link>
          </div>
        </div>
      ) : (
        // UI khi đã đăng nhập
        <div className="text-center space-y-4 p-6 border rounded-xl shadow-sm w-full max-w-md">
          <p className="text-xl">Chào mừng bạn trở lại!</p>
          <p className="text-sm text-gray-500 break-all">
            Access Token (Test): {session.accessToken?.substring(0, 20)}...
          </p>
          
          <div className="flex flex-col gap-3 mt-6">
            <Link href="/dashboard" className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
              Vào Workspace của bạn
            </Link>
            <LogoutButton />
          </div>
        </div>
      )}
    </div>
  );
}