// "use client";

// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
// import { Task,TaskUpdate } from "@/types/task";
// interface TaskCardProps {
//   task: Task;
//   onClick: (task: Task) => void;
// }

// export const TaskCard = ({ task,onClick }: TaskCardProps) => {
//   // Khởi tạo Draggable với id của task và đính kèm dữ liệu (status cũ)
//   const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
//     id: task.id,
//     data: { status: task.status },
//   });

//   // Tính toán vị trí khi đang kéo
//   const style = {
//     transform: CSS.Translate.toString(transform),
//     opacity: isDragging ? 0.5 : 1, // Làm mờ card khi đang được kéo
//     cursor: "grab",
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       {...listeners}
//       onClick={() => onClick(task)}
//       className="bg-white p-3 rounded shadow-sm border border-gray-200 hover:border-purple-400 transition relative z-10"
//     >
//       <h3 className="font-medium text-gray-800">{task.title}</h3>
//       {task.description && (
//         <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
//       )}
//       <div className="flex justify-between items-center mt-3">
//         <span
//           className={`text-[10px] uppercase font-bold px-2 py-1 rounded
//             ${
//               task.priority === "Urgent" ? "bg-red-100 text-red-700" :
//               task.priority === "High" ? "bg-orange-100 text-orange-700" :
//               task.priority === "Medium" ? "bg-blue-100 text-blue-700" :
//               "bg-gray-100 text-gray-700"
//             }`}
//         >
//           {task.priority}
//         </span>
//         <span className="text-[10px] text-gray-400" title="Vector DB Status">
//           {task.embedding_status ? "🟢 Synced" : "⏳ Syncing..."}
//         </span>
//       </div>
//     </div>
//   );
// };
// src/components/kanban/TaskCard.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Database, CheckCircle2, Clock,UserCircle2 } from "lucide-react";
import { Task } from "@/types/task"; // Đảm bảo đường dẫn này đúng

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  // Logic màu sắc Badge Priority - Cập nhật để khớp với các loại Priority bạn có
  const priorityColors: Record<string, string> = {
    Urgent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    High: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    Medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-grab active:cursor-grabbing group relative z-10"
    >
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-medium text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2">
          {task.title}
        </h4>
        
        {/* ✨ Icon Embedding Status - Đồng bộ với Backend (embedding_status) */}
        <div 
          className={`shrink-0 p-1 rounded-full transition-colors ${
            task.embedding_status 
              ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
              : 'text-slate-300 bg-slate-50 dark:bg-slate-800'
          }`} 
          title={task.embedding_status ? "AI đã học task này (ChromaDB)" : "AI đang xử lý dữ liệu..."}
        >
          {task.embedding_status ? <CheckCircle2 size={12} /> : <Clock size={12} />}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mt-4">
        {/* Badge Priority */}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
          priorityColors[task.priority] || priorityColors.Medium
        }`}>
          {task.priority}
        </span>

        {/* Due Date */}
        {task.due_date && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium ml-auto">
            <Calendar size={12} />
            {new Date(task.due_date).toLocaleDateString('vi-VN')}
          </div>
        )}
        {task.assignee_id ? (
      <div 
        className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 tooltip-trigger"
        title="Đã phân công"
      >
        {/* Lấy chữ cái đầu của tên User. Tạm thời hardcode ký tự 'U' nếu chưa join bảng User */}
        U
      </div>
    ) : (
      <button 
        className="h-7 w-7 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
        title="Giao việc"
        // onClick={() => openAssignModal(task.id)}
      >
        <UserCircle2 size={14} />
      </button>
    )}
      </div>
    </div>
  );
}