// "use client";

// import { useState } from "react";
// // Import Hook của bạn
// import { useCreateProject } from "@/hooks/useProjects"; 
// import { Button } from "@/components/ui/button";
// import { LayoutGrid, Loader2 } from "lucide-react";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   workspaceId: string; // ID này lấy từ Sidebar truyền vào
// }

// export const CreateProjectModal = ({ isOpen, onClose, workspaceId }: Props) => {
//   const [name, setName] = useState("");
  
//   // TRUYỀN workspaceId VÀO ĐÂY (Theo đúng định nghĩa Hook của bạn)
//   const createMutation = useCreateProject(workspaceId);

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim() || !workspaceId) return;

//     // Lúc này mutate chỉ cần nhận name (vì Hook đã giữ workspaceId rồi)
//     createMutation.mutate({ name }, {
//       onSuccess: () => {
//         setName("");
//         onClose();
//       },
//     });
//   };

// return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
//       <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-emerald-100">
//         <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
//           <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
//             <LayoutGrid size={20} />
//           </div>
//           Tạo Dự án mới
//         </h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-slate-600 mb-1">Tên dự án</label>
//             <input
//               autoFocus
//               className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
//               placeholder="Ví dụ: Thiết kế UI, Lập trình API..."
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-2">
//             <Button type="button" variant="ghost" onClick={onClose} disabled={createMutation.isPending}>
//               Hủy
//             </Button>
//             <Button 
//               type="submit" 
//               className="bg-emerald-600 hover:bg-emerald-700 text-white"
//               disabled={createMutation.isPending || !name.trim()}
//             >
//               {createMutation.isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
//               Tạo dự án
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };
"use client";

import { useState } from "react";
import { useCreateProject } from "@/hooks/useProjects";
import { X, Loader2, FolderKanban } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreateProjectModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ workspaceId, isOpen, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  
  const createMutation = useCreateProject(workspaceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        is_public: isPublic,
      });
      // Reset form
      setName("");
      setDescription("");
      setIsPublic(false);
      onClose();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="text-emerald-600" size={22}/>
              Tạo Dự án mới
            </DialogTitle>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white dark:bg-slate-950">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên dự án <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: App quản lý công việc"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900 dark:text-white"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mô tả chi tiết</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mục tiêu của dự án này là gì?"
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900 dark:text-white resize-none"
            />
          </div>

          <label className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <input 
              type="checkbox" 
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
            />
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-white">Dự án công khai</p>
              <p className="text-xs text-slate-500">Mọi người trong Workspace đều có thể xem.</p>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={createMutation.isPending || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              Tạo mới
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}