// "use client";

// import { useDroppable } from "@dnd-kit/core";
// import { TaskCard } from "./TaskCard";
// import { Task,TaskUpdate } from "@/types/task";
// interface KanbanColumnProps {
//   statusId: string; // "To Do", "In Progress", "Done"
//   title: string;
//   tasks: Task[];
//   bgColor: string;
//   onTaskClick: (task: Task) => void;
// }

// export const KanbanColumn = ({ statusId, title, tasks, bgColor,onTaskClick }: KanbanColumnProps) => {
//   // Khởi tạo Droppable với id là trạng thái của cột
//   const { isOver, setNodeRef } = useDroppable({
//     id: statusId,
//   });

//   return (
//     <div
//       ref={setNodeRef}
//       className={`flex-1 min-w-[300px] rounded-lg p-4 flex flex-col gap-3 transition-colors ${bgColor} ${
//         isOver ? "ring-2 ring-purple-400 ring-inset" : "" // Đổi màu viền khi kéo task lướt qua
//       }`}
//     >
//       <h2 className="font-semibold text-lg text-gray-700 flex justify-between">
//         {title}
//         <span className="bg-white px-2 py-1 rounded text-sm font-normal shadow-sm">
//           {tasks.length}
//         </span>
//       </h2>

//       {/* Render danh sách task trong cột này */}
//       <div className="flex flex-col gap-3 min-h-[150px]">
//         {tasks.map((task) => (
//           <TaskCard key={task.id} task={task} onClick={onTaskClick} />
//         ))}
//         {tasks.length === 0 && (
//           <div className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm">
//             Kéo thả vào đây
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// src/components/kanban/KanbanColumn.tsx
import { useDroppable } from "@dnd-kit/core";
import { Task } from "./TaskModal"; // Đường dẫn tuỳ project
import { TaskCard } from "./TaskCard";

interface Props {
  statusId: string;
  title: string;
  tasks: Task[];
  bgColor: string;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({ statusId, title, tasks, bgColor, onTaskClick }: Props) {
  const { setNodeRef } = useDroppable({ id: statusId });

  return (
    <div className={`flex flex-col min-w-[320px] w-[320px] rounded-2xl p-4 ${bgColor} border border-transparent dark:border-slate-800`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-slate-700 dark:text-slate-200">{title}</h3>
        {/* Số lượng Task */}
        <span className="bg-white dark:bg-slate-800 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 flex flex-col gap-3 min-h-[150px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}