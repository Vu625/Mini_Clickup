// src/app/(dashboard)/layout.tsx
import { Sidebar } from "@/components/shared/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Vùng nội dung chính cuộn độc lập */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header phụ (Breadcrumbs, Search, hoặc Notification có thể thêm ở đây) */}
        {/* <header className="h-14 border-b flex items-center px-6 bg-white dark:bg-slate-950">
           <h2 className="text-sm font-medium text-slate-500">Workspace / Project / Kanban</h2>
        </header> */}
        
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}