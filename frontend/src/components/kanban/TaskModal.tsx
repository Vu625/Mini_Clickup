"use client";

import { useState } from "react";
import { Loader2, X, Calendar, ClipboardList } from "lucide-react";

// Tái sử dụng Interface chuẩn của bạn
export interface Task {
  id: string;
  project_id: string;
  description: string | null;
  title: string;
  priority: string;
  status: string;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  embedding_status: boolean;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  due_date?: string;
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (taskId: string, data: TaskUpdate) => void;
  isUpdating: boolean;
}

export const TaskModal = ({ task, onClose, onUpdate, isUpdating }: TaskModalProps) => {
  const [formData, setFormData] = useState<TaskUpdate>({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    due_date: task.due_date ? task.due_date.split("T")[0] : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (!dataToSend.due_date || dataToSend.due_date.trim() === "") {
      delete dataToSend.due_date; 
    }
    onUpdate(task.id, dataToSend);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-emerald-100/50">
        
        {/* Header - Nhuộm xanh nhẹ */}
        <div className="flex justify-between items-center p-5 border-b bg-emerald-50/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <ClipboardList size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Chi tiết công việc</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form id="task-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Tên công việc</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all dark:bg-slate-800 dark:border-slate-700"
              placeholder="Thêm mô tả chi tiết để AI hiểu rõ hơn ngữ cảnh..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Trạng thái</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full border border-slate-200 p-2.5 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Độ ưu tiên</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleChange} 
                className="w-full border border-slate-200 p-2.5 rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" /> Hạn chót
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full border border-slate-200 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-slate-800 dark:border-slate-700 cursor-pointer"
              />
            </div>
          </div>
        </form>

        {/* Footer - Nút bấm Emerald */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button 
            type="submit" 
            form="task-form" 
            disabled={isUpdating}
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

      </div>
    </div>
  );
};