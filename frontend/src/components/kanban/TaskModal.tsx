"use client";

import { useState, useEffect } from "react";

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
  due_date?: string ;
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (taskId: string, data: TaskUpdate) => void;
  isUpdating: boolean;
}

export const TaskModal = ({ task, onClose, onUpdate, isUpdating }: TaskModalProps) => {
  // Đưa dữ liệu task vào state nội bộ của Modal để người dùng thoải mái chỉnh sửa trước khi bấm Save
  const [formData, setFormData] = useState<TaskUpdate>({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    due_date: task.due_date ? task.due_date.split("T")[0] : "", // Format ngày chuẩn cho thẻ input type="date"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(task.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết công việc</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 font-bold text-xl">
            &times;
          </button>
        </div>

        {/* Body */}
        <form id="task-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên công việc</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 rounded-md focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              placeholder="Thêm mô tả chi tiết để AI hiểu rõ hơn ngữ cảnh..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-md bg-white">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
              <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border p-2 rounded-md bg-white">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hạn chót (Due Date)</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-gray-100 transition">
            Hủy
          </button>
          <button 
            type="submit" 
            form="task-form" 
            disabled={isUpdating}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>

      </div>
    </div>
  );
};