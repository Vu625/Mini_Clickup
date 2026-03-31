"use client";

import { useState, useEffect } from "react";
import { Workspace } from "@/types/workspace";
import { useUpdateWorkspace } from "@/hooks/useWorkspaces";
import { X, Loader2, Briefcase,Settings2 } from "lucide-react";
// Giả sử bạn có Component Modal chung, nếu không dùng css thuần
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 

interface UpdateWorkspaceModalProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateWorkspaceModal({ workspace, isOpen, onClose }: UpdateWorkspaceModalProps) {
  const [name, setName] = useState(workspace.name);
  const updateMutation = useUpdateWorkspace();

  // Reset name khi đổi workspace được chọn
  useEffect(() => {
    setName(workspace.name);
  }, [workspace]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name === workspace.name) return;

    try {
      await updateMutation.mutateAsync({ id: workspace.id, data: { name: name.trim() } });
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
              Thiết lập Workspace
            </DialogTitle>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"></button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white dark:bg-slate-950">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tên không gian làm việc mới</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Team Marketing VN"
                className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900 dark:text-white"
                autoFocus
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
              Hủy
            </button>
            <button 
              type="submit" 
              disabled={updateMutation.isPending || !name.trim() || name === workspace.name}
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