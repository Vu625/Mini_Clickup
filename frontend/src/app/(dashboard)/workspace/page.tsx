// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Workspace } from "@/types/workspace";
// import { useWorkspaces, useCreateWorkspace } from "@/hooks/useWorkspaces";
// import { 
//   Plus, 
//   Briefcase, 
//   Loader2, 
//   ChevronRight, 
//   LayoutDashboard,
//   Search
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function WorkspacePage() {
//   const { data: workspaces, isLoading, error } = useWorkspaces();
//   const createMutation = useCreateWorkspace();
//   const [newWorkspaceName, setNewWorkspaceName] = useState("");

//   const handleCreate = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newWorkspaceName.trim()) return;
//     createMutation.mutate({ name: newWorkspaceName }, {
//       onSuccess: () => setNewWorkspaceName(""),
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-950">
//         <div className="flex flex-col items-center gap-2">
//           <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
//           <p className="text-slate-500 font-medium">Đang chuẩn bị không gian làm việc...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 max-w-md mx-auto mt-20 text-center bg-red-50 border border-red-100 rounded-2xl">
//         <p className="text-red-600 font-semibold mb-2">Đã có lỗi xảy ra</p>
//         <p className="text-red-500 text-sm">{(error as Error).message}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto min-h-screen bg-white dark:bg-slate-950">
//       {/* Header Section */}
//       <div className="mb-12 text-center md:text-left">
//         <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
//           Chào mừng trở lại! 
//         </h1>
//         <p className="text-slate-500 mt-2 text-lg">
//           Chọn một <span className="text-emerald-600 font-semibold">Workspace</span> để bắt đầu quản lý dự án của bạn.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
//         {/* Cột trái: Form tạo Workspace */}
//         <div className="lg:col-span-1">
//           <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 sticky top-8">
//             <div className="mb-6">
//               <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
//                 <Plus size={24} />
//               </div>
//               <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tạo mới</h3>
//               <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-tighter opacity-70">Workspace riêng biệt</p>
//             </div>

//             <form onSubmit={handleCreate} className="space-y-3">
//               <input
//                 type="text"
//                 value={newWorkspaceName}
//                 onChange={(e) => setNewWorkspaceName(e.target.value)}
//                 placeholder="Tên Workspace..."
//                 className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:bg-slate-800"
//                 disabled={createMutation.isPending}
//               />
//               <Button
//                 type="submit"
//                 disabled={createMutation.isPending || !newWorkspaceName.trim()}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
//               >
//                 {createMutation.isPending ? <Loader2 className="animate-spin" /> : "Xác nhận tạo"}
//               </Button>
//             </form>
//           </div>
//         </div>

//         {/* Cột phải: Danh sách Workspace */}
//         <div className="lg:col-span-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {workspaces?.map((ws: Workspace) => (
//               <Link href={`/workspace/${ws.id}`} key={ws.id} className="group">
//                 <div className="h-full border border-slate-100 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
//                   {/* Decor Background */}
//                   <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  
//                   <div className="relative z-10">
//                     <div className="flex items-center gap-4 mb-4">
//                       <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-200">
//                         {ws.name.charAt(0).toUpperCase()}
//                       </div>
//                       <div className="flex-1 overflow-hidden">
//                         <h3 className="font-bold text-xl text-slate-800 dark:text-white truncate group-hover:text-emerald-600 transition-colors">
//                           {ws.name}
//                         </h3>
//                         <div className="flex items-center text-[10px] text-slate-400 font-mono mt-1">
//                           <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase tracking-tighter">ID: {ws.id.split("-")[0]}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="relative z-10 mt-6 flex items-center justify-between text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
//                     Truy cập ngay
//                     <ChevronRight size={18} />
//                   </div>
//                 </div>
//               </Link>
//             ))}

//             {workspaces?.length === 0 && (
//               <div className="col-span-2 py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
//                 <div className="flex flex-col items-center">
//                    <Briefcase size={48} className="text-slate-300 mb-4" />
//                    <p className="text-slate-500 font-medium">Bạn chưa có không gian làm việc nào.</p>
//                    <p className="text-slate-400 text-sm">Hãy tạo Workspace đầu tiên để bắt đầu dự án.</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Workspace } from "@/types/workspace";
import { useWorkspaces,useDeleteWorkspace } from "@/hooks/useWorkspaces";
import { CreateWorkspaceModal } from "@/components/modals/CreateWorkspaceModal";
import { UpdateWorkspaceModal } from "@/components/modals/UpdateWorkspaceModal";
import { InviteMemberModal } from "@/components/modals/InviteMemberModal";
import { InvitationDropdown } from "@/components/notifications/InvitationDropdown"; // Đảm bảo đường dẫn này đúng với project của bạn
import { 
  Plus, 
  Briefcase, 
  Loader2, 
  ChevronRight, 
  Search,
  FolderDot,
  Settings2,
  Trash2,
  MoreVertical,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function WorkspacePage() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id; // Lấy ID user hiện tại để check quyền Owner

  const { data: workspaces, isLoading, error } = useWorkspaces();
  const deleteWorkspaceMutation = useDeleteWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  
  // States quản lý các Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<Workspace | null>(null);
  const [workspaceToDeleteId, setWorkspaceToDeleteId] = useState<string | null>(null);
  const [workspaceToInvite, setWorkspaceToInvite] = useState<Workspace | null>(null);

  // Lời chào linh hoạt theo thời gian thực
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  // Lọc workspace theo thanh tìm kiếm
  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return [];
    if (!searchQuery.trim()) return workspaces;
    return workspaces.filter((ws) => 
      ws.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [workspaces, searchQuery]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa Workspace "${name}"? Hành động này không thể hoàn tác.`)) {
      try {
        await deleteWorkspaceMutation.mutateAsync(id);
        // Toast success ở đây nếu có thư viện
      } catch (e) {
        // Toast error
        alert((e as Error).message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium">Đang tải không gian làm việc...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-md mx-auto mt-20 text-center bg-red-50 border border-red-100 rounded-2xl">
        <p className="text-red-600 font-semibold mb-2">Đã có lỗi xảy ra</p>
        <p className="text-red-500 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  return (
<div className="p-8 max-w-7xl mx-auto min-h-full bg-white dark:bg-slate-950">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {getGreeting()}, <span className="text-emerald-600">{session?.user?.name || "bạn"}</span>!
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Bạn muốn làm việc ở không gian nào hôm nay?
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm Workspace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-900 dark:text-white"
            />
          </div>

          {/* BỔ SUNG: NÚT THÔNG BÁO LỜI MỜI */}
          <InvitationDropdown />
        </div>
      </div>

      {/* Grid View */}
{/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
        {filteredWorkspaces.map((ws: Workspace) => {
          // const isOwner = ws.owner_id === currentUserId;
          const isOwner = true

          return (
            // Thay đổi Link thành div để chứa các nút action
            <div key={ws.id} className="group h-full border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              {/* Decor Background */}
              <div className="absolute -right-6 -top-6 w-28 h-28 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-emerald-200/50">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  {/* <p>{ws.owner_id}</p> */}
                  {/* <p>{currentUserId}</p> */}
                  {/* BỔ SUNG: MENU ACTIONS (CHỈ HIỆN NẾU LÀ OWNER) */}
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={20} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl mt-2">
                        <DropdownMenuItem onClick={() => setWorkspaceToInvite(ws)} className="gap-2.5 py-2.5 text-emerald-600 focus:text-emerald-700 rounded-lg cursor-pointer">
                          <UserPlus size={18} />
                          Mời thành viên
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setWorkspaceToEdit(ws)} className="gap-2.5 py-2.5 rounded-lg cursor-pointer">
                          <Settings2 size={18} className="text-slate-500" />
                          Đổi tên
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(ws.id, ws.name)}
                          className="gap-2.5 py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={18} />
                          Xóa Workspace
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {/* Phần nội dung click được để vào detail */}
                <Link href={`/workspace/${ws.id}`} className="block">
                  <h3 className="font-bold text-xl text-slate-800 dark:text-white truncate group-hover:text-emerald-600 transition-colors mb-1">
                    {ws.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                    <FolderDot size={16} />
                    <span>Dự án AIPlanner</span>
                  </div>
                </Link>
              </div>

              <Link href={`/workspace/${ws.id}`} className="relative z-10 mt-6 flex items-center justify-between text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                Truy cập ngay
                <ChevronRight size={18} />
              </Link>
            </div>
          );
        })}

        {/* Nút Tạo Mới luôn nằm ở cuối */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center justify-center p-6 text-slate-500 hover:text-emerald-600"
        >
          <div className="h-14 w-14 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus size={28} />
          </div>
          <span className="font-bold text-lg">Tạo Workspace</span>
        </button>
      </div>

      {/* Hiển thị Empty State nếu tìm kiếm không ra kết quả */}
      {(workspaces || []).length > 0 && filteredWorkspaces.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500">{`Không tìm thấy Workspace nào phù hợp với "${searchQuery}"`}</p>
        </div>
      )}

      {/* Modal Tạo mới */}
      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      {/* Modal Tạo mới */}
      <CreateWorkspaceModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* BỔ SUNG: Modal Cập nhật */}
      {workspaceToEdit && (
        <UpdateWorkspaceModal
          workspace={workspaceToEdit}
          isOpen={!!workspaceToEdit}
          onClose={() => setWorkspaceToEdit(null)}
        />
      )}

      {/* BỔ SUNG: Modal Mời thành viên */}
      {workspaceToInvite && (
        <InviteMemberModal
          workspace={workspaceToInvite}
          isOpen={!!workspaceToInvite}
          onClose={() => setWorkspaceToInvite(null)}
        />
      )}
    </div>
  );
}