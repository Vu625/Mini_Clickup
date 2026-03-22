"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { Task,TaskUpdate } from "@/types/task";
interface KanbanColumnProps {
  statusId: string; // "To Do", "In Progress", "Done"
  title: string;
  tasks: Task[];
  bgColor: string;
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn = ({ statusId, title, tasks, bgColor,onTaskClick }: KanbanColumnProps) => {
  // Khởi tạo Droppable với id là trạng thái của cột
  const { isOver, setNodeRef } = useDroppable({
    id: statusId,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] rounded-lg p-4 flex flex-col gap-3 transition-colors ${bgColor} ${
        isOver ? "ring-2 ring-purple-400 ring-inset" : "" // Đổi màu viền khi kéo task lướt qua
      }`}
    >
      <h2 className="font-semibold text-lg text-gray-700 flex justify-between">
        {title}
        <span className="bg-white px-2 py-1 rounded text-sm font-normal shadow-sm">
          {tasks.length}
        </span>
      </h2>

      {/* Render danh sách task trong cột này */}
      <div className="flex flex-col gap-3 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
        {tasks.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm">
            Kéo thả vào đây
          </div>
        )}
      </div>
    </div>
  );
};