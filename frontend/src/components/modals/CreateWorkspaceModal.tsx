"use client";

import { useState } from "react";
import { useCreateWorkspace } from "@/hooks/useWorkspaces";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWorkspaceModal = ({ isOpen, onClose }: Props) => {
  const [name, setName] = useState("");
  const createMutation = useCreateWorkspace();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createMutation.mutate({ name }, {
      onSuccess: () => {
        setName("");
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 border border-emerald-100">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <Plus size={20} />
          </div>
          Tạo Workspace mới
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Tên không gian làm việc</label>
            <input
              autoFocus
              className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="Ví dụ: Công ty ABC, Dự án cá nhân..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={createMutation.isPending}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={createMutation.isPending || !name.trim()}
            >
              {createMutation.isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Tạo ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};