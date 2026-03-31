"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { useUpdateProject } from "@/hooks/useProjects";
import { X, Loader2, Settings2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UpdateProjectModalProps {
  workspaceId: string;
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateProjectModal({ workspaceId, project, isOpen, onClose }: UpdateProjectModalProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [isPublic, setIsPublic] = useState(project.is_public);
  
  const updateMutation = useUpdateProject(workspaceId);

  // Reset form khi project thay đổi
//   useEffect(() => {
//     setName(project.name);
//     setDescription(project.description || "");
//     setIsPublic(project.is_public);
//   }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await updateMutation.mutateAsync({
        projectId: project.id,
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          is_public: isPublic,
        }
      });
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
              <Settings2 className="text-emerald-600" size={22}/>
              Thiết lập Dự án
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
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mô tả chi tiết</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={updateMutation.isPending || !name.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending && <Loader2 size={16} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}