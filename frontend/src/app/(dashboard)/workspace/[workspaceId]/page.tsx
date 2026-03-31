// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { Project } from "@/types/project";
// import { useProjects, useCreateProject } from "@/hooks/useProjects";
// import { 
//   Plus, 
//   LayoutGrid, 
//   ArrowLeft, 
//   Globe, 
//   Lock, 
//   Loader2,
//   ChevronRight 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// export default function WorkspaceDetailPage() {
//   const params = useParams();
//   const workspaceId = params.workspaceId as string;

//   const { data: projects, isLoading, error } = useProjects(workspaceId);
//   const createMutation = useCreateProject(workspaceId);

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPublic, setIsPublic] = useState(true);

//   const handleCreate = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) return;
//     createMutation.mutate(
//       { name, description, is_public: isPublic },
//       {
//         onSuccess: () => {
//           setName("");
//           setDescription("");
//           setIsPublic(true);
//         },
//       }
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-full items-center justify-center p-8 text-emerald-600 font-medium">
//         <Loader2 className="animate-spin mr-2" /> Đang tải danh sách dự án...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-red-500 bg-red-50 rounded-lg m-8 border border-red-100">
//         Lỗi: {(error as Error).message}
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-6xl mx-auto bg-white dark:bg-slate-950 min-h-screen">
//       {/* Điều hướng quay lại */}
//       <div className="mb-6">
//         <Link 
//           href="/workspace" 
//           className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
//         >
//           <ArrowLeft size={16} /> Quay lại danh sách Workspace
//         </Link>
//       </div>
      
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
//             <div className="p-2 bg-emerald-600 rounded-lg text-white shadow-lg shadow-emerald-200">
//               <LayoutGrid size={24} />
//             </div>
//             Dự án trong Workspace
//           </h1>
//           <p className="text-slate-500 mt-1 ml-12 italic">Quản lý và theo dõi tiến độ các dự án của bạn</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         {/* Cột trái: Form tạo Project */}
//         <div className="lg:col-span-1">
//           <form 
//             onSubmit={handleCreate} 
//             className="bg-emerald-50/50 dark:bg-slate-900 p-6 rounded-2xl border border-emerald-100 shadow-sm sticky top-8"
//           >
//             <h3 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
//               <Plus size={18} /> Tạo dự án mới
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="text-xs font-bold uppercase text-slate-400 ml-1">Tên dự án</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Ví dụ: Thiết kế Website..."
//                   className="w-full border border-slate-200 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:bg-slate-800 dark:border-slate-700"
//                   disabled={createMutation.isPending}
//                 />
//               </div>

//               <div>
//                 <label className="text-xs font-bold uppercase text-slate-400 ml-1">Mô tả dự án</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Mô tả cho AI và đồng đội..."
//                   rows={3}
//                   className="w-full border border-slate-200 rounded-xl p-3 mt-1 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none dark:bg-slate-800 dark:border-slate-700"
//                   disabled={createMutation.isPending}
//                 />
//               </div>

//               <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-emerald-100/50">
//                 <input
//                   type="checkbox"
//                   id="isPublic"
//                   checked={isPublic}
//                   onChange={(e) => setIsPublic(e.target.checked)}
//                   className="w-4 h-4 accent-emerald-600"
//                   disabled={createMutation.isPending}
//                 />
//                 <label htmlFor="isPublic" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
//                   Công khai trong Workspace
//                 </label>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={createMutation.isPending || !name.trim()}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl shadow-md shadow-emerald-200 transition-all"
//               >
//                 {createMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" size={18} />}
//                 Tạo Project
//               </Button>
//             </div>
//           </form>
//         </div>

//         {/* Cột phải: Danh sách Project */}
//         <div className="lg:col-span-2">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {projects?.map((project: Project) => (
//               <div 
//                 key={project.id} 
//                 className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 overflow-hidden"
//               >
//                 {/* Thanh màu bên cạnh */}
//                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

//                 <div className="flex justify-between items-start mb-3">
//                   <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg group-hover:bg-emerald-50 transition-colors">
//                     <LayoutGrid size={20} className="text-slate-400 group-hover:text-emerald-600" />
//                   </div>
//                   <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 ${
//                     project.is_public 
//                       ? 'bg-blue-50 text-blue-600 border border-blue-100' 
//                       : 'bg-amber-50 text-amber-600 border border-amber-100'
//                   }`}>
//                     {project.is_public ? <Globe size={10} /> : <Lock size={10} />}
//                     {project.is_public ? 'Public' : 'Private'}
//                   </span>
//                 </div>

//                 <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors">
//                   {project.name}
//                 </h3>
//                 <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">
//                   {project.description || "Dự án này chưa có mô tả chi tiết."}
//                 </p>
                
//                 {/* Link SỬA ĐỔI: Theo cấu trúc /workspace/[wsId]/[pId] */}
//                 <Link 
//                   href={`/workspace/${workspaceId}/${project.id}`} 
//                   className="mt-4 flex items-center justify-between text-sm font-bold text-emerald-600 hover:text-emerald-700 p-2 -mx-2 rounded-lg hover:bg-emerald-50 transition-all"
//                 >
//                   Vào xem Kanban Board
//                   <ChevronRight size={18} />
//                 </Link>
//               </div>
//             ))}

//             {projects?.length === 0 && (
//               <div className="col-span-2 flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200">
//                 <div className="p-4 bg-white rounded-full shadow-sm mb-4">
//                   <LayoutGrid size={40} className="text-slate-300" />
//                 </div>
//                 <p className="text-slate-500 font-medium text-center">
//                   Workspace này chưa có dự án nào.<br/>Bắt đầu bằng cách tạo một cái mới bên cạnh!
//                 </p>
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
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Project } from "@/types/project";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";

import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { UpdateProjectModal } from "@/components/modals/UpdateProjectModal";

import { 
  Plus, 
  Loader2, 
  ChevronRight, 
  Search,
  Settings2,
  Trash2,
  MoreVertical,
  FolderKanban,
  Globe,
  Lock
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { data: session } = useSession();

  // Fetch Projects
  const { data: projects, isLoading, error } = useProjects(workspaceId);
  const deleteProjectMutation = useDeleteProject(workspaceId);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Lọc Project theo thanh tìm kiếm
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery.trim()) return projects;
    return projects.filter((proj) => 
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (proj.description && proj.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [projects, searchQuery]);

  // Xử lý xóa Project
  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa dự án "${name}"? Toàn bộ task bên trong sẽ bị mất.`)) {
      try {
        await deleteProjectMutation.mutateAsync(id);
      } catch (e) {
        alert((e as Error).message);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium">Đang tải dự án...</p>
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
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/workspace" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mb-2 transition-colors">
            &larr; Quay lại danh sách Workspace
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Quản lý Dự án
          </h1>
          <p className="text-slate-500 mt-2 text-base">
            Các dự án thuộc không gian làm việc này.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all bg-slate-50 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
        {filteredProjects.map((proj: Project) => (
          <div key={proj.id} className="group h-full border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-100/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            {/* Decor Background */}
            <div className="absolute -right-6 -top-6 w-28 h-28 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-sm">
                  <FolderKanban size={24} />
                </div>

                {/* Dropdown Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl mt-2">
                    <DropdownMenuItem onClick={() => setProjectToEdit(proj)} className="gap-2.5 py-2.5 rounded-lg cursor-pointer">
                      <Settings2 size={18} className="text-slate-500" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handleDelete(proj.id, proj.name)}
                      className="gap-2.5 py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={18} />
                      Xóa dự án
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Link href={`/workspace/${workspaceId}/${proj.id}`} className="block">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white truncate group-hover:text-emerald-600 transition-colors mb-2">
                  {proj.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[40px]">
                  {proj.description || "Không có mô tả cho dự án này."}
                </p>
                
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md w-max bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {proj.is_public ? (
                    <><Globe size={14} className="text-blue-500" /> Công khai</>
                  ) : (
                    <><Lock size={14} className="text-amber-500" /> Nội bộ</>
                  )}
                </div>
              </Link>
            </div>

            <Link href={`/workspace/${workspaceId}/${proj.id}`} className="relative z-10 mt-6 flex items-center justify-between text-emerald-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
              Vào bảng công việc
              <ChevronRight size={18} />
            </Link>
          </div>
        ))}

        {/* Nút Tạo Mới */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="group h-full min-h-[200px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col items-center justify-center p-6 text-slate-500 hover:text-emerald-600"
        >
          <div className="h-14 w-14 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus size={28} />
          </div>
          <span className="font-bold text-lg">Tạo Dự án mới</span>
        </button>
      </div>

      {/* Empty State */}
      {(projects || []).length > 0 && filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-slate-500">{`Không tìm thấy dự án nào phù hợp với "${searchQuery}"`}</p>
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal 
        workspaceId={workspaceId}
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {projectToEdit && (
        <UpdateProjectModal
          key={projectToEdit.id}
          workspaceId={workspaceId}
          project={projectToEdit}
          isOpen={!!projectToEdit}
          onClose={() => setProjectToEdit(null)}
        />
      )}
    </div>
  );
}