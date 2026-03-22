"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Task,TaskUpdate } from "@/types/task";
interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task,onClick }: TaskCardProps) => {
  // Khởi tạo Draggable với id của task và đính kèm dữ liệu (status cũ)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });

  // Tính toán vị trí khi đang kéo
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1, // Làm mờ card khi đang được kéo
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-purple-400 transition relative z-10"
    >
      <h3 className="font-medium text-gray-800">{task.title}</h3>
      {task.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex justify-between items-center mt-3">
        <span
          className={`text-[10px] uppercase font-bold px-2 py-1 rounded
            ${
              task.priority === "Urgent" ? "bg-red-100 text-red-700" :
              task.priority === "High" ? "bg-orange-100 text-orange-700" :
              task.priority === "Medium" ? "bg-blue-100 text-blue-700" :
              "bg-gray-100 text-gray-700"
            }`}
        >
          {task.priority}
        </span>
        <span className="text-[10px] text-gray-400" title="Vector DB Status">
          {task.embedding_status ? "🟢 Synced" : "⏳ Syncing..."}
        </span>
      </div>
    </div>
  );
};