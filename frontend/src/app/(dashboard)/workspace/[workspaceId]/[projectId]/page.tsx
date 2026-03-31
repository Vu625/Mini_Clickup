// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import { 
//   DndContext, 
//   DragEndEvent, 
//   useSensor, 
//   useSensors, 
//   PointerSensor,
//   closestCorners 
// } from "@dnd-kit/core";
// import { 
//   LayoutGrid, 
//   Plus, 
//   ArrowLeft, 
//   Loader2, 
//   Search, 
//   Filter,
//   MoreHorizontal
// } from "lucide-react";

// import { useTasks, useCreateTask, useUpdateTask } from "@/hooks/useTasks";
// import { KanbanColumn } from "@/components/kanban/KanbanColumn";
// import { TaskModal, TaskUpdate, Task } from "@/components/kanban/TaskModal";
// import { Button } from "@/components/ui/button";

// export default function ProjectBoardPage() {
//   const params = useParams();
//   const projectId = params.projectId as string;
//   const workspaceId = params.workspaceId as string;

//   const { data: tasks, isLoading, error } = useTasks(projectId);
//   const createMutation = useCreateTask(projectId);
//   const updateMutation = useUpdateTask(projectId);
  
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null);
//   const [title, setTitle] = useState("");
  
//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: { distance: 5 },
//     })
//   );

//   const handleCreate = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     createMutation.mutate(
//       { title, priority: "Medium", status: "To Do" },
//       { onSuccess: () => setTitle("") }
//     );
//   };

//   const handleUpdateTaskDetails = (taskId: string, data: TaskUpdate) => {
//     updateMutation.mutate(
//       { taskId, data },
//       { onSuccess: () => setSelectedTask(null) }
//     );
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;

//     const taskId = active.id as string;
//     const currentStatus = active.data.current?.status;
//     const newStatus = over.id as string;

//     if (currentStatus !== newStatus) {
//       updateMutation.mutate({
//         taskId: taskId,
//         data: { status: newStatus },
//       });
//     }
//   };

//   if (isLoading) return (
//     <div className="flex h-full items-center justify-center">
//       <Loader2 className="animate-spin text-emerald-600 w-8 h-8" />
//     </div>
//   );

//   if (error) return <div className="p-8 text-red-500">Lỗi: {(error as Error).message}</div>;

//   const todoTasks = tasks?.filter((t: Task) => t.status === "To Do") || [];
//   const inProgressTasks = tasks?.filter((t: Task) => t.status === "In Progress") || [];
//   const doneTasks = tasks?.filter((t: Task) => t.status === "Done") || [];

//   return (
//     <div className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-950">
      
//       {/* Header Area */}
//       <div className="bg-white dark:bg-slate-900 border-b p-4 sm:px-8">
//         <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-400">
//           <Link href={`/workspace/${workspaceId}`} className="hover:text-emerald-600 transition-colors">Workspace</Link>
//           <span>/</span>
//           <span className="text-slate-600 dark:text-slate-200">Kanban Board</span>
//         </div>

//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-emerald-600 rounded-lg text-white">
//               <LayoutGrid size={20} />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">Project Board</h1>
//               <p className="text-xs text-slate-500">Kéo thả các task để cập nhật tiến độ công việc</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="relative hidden sm:block">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
//               <input 
//                 type="text" 
//                 placeholder="Tìm kiếm task..." 
//                 className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-48 transition-all focus:w-64"
//               />
//             </div>
//             <Button variant="outline" size="icon" className="rounded-full">
//               <Filter size={16} />
//             </Button>
//             <Button variant="outline" size="icon" className="rounded-full">
//               <MoreHorizontal size={16} />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Kanban Content */}
//       <div className="flex-1 overflow-hidden p-4 sm:p-8">
        
//         {/* Quick Add Bar */}
//         <form onSubmit={handleCreate} className="max-w-md mb-8 flex gap-2 group">
//           <div className="relative flex-1">
//             <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 opacity-50 group-focus-within:opacity-100 transition-opacity" size={18} />
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Thêm nhanh công việc mới..."
//               className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
//               disabled={createMutation.isPending}
//             />
//           </div>
//           <Button 
//             type="submit" 
//             disabled={createMutation.isPending || !title.trim()}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
//           >
//             {createMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Thêm"}
//           </Button>
//         </form>

//         {/* Drag and Drop Context */}
//         <DndContext 
//           onDragEnd={handleDragEnd} 
//           sensors={sensors}
//           collisionDetection={closestCorners}
//         >
//           <div className="flex gap-6 h-full min-h-[500px] items-start pb-10 overflow-x-auto custom-scrollbar">
//             <KanbanColumn 
//               statusId="To Do" 
//               title="Cần làm" 
//               tasks={todoTasks} 
//               bgColor="bg-slate-200/50" 
//               onTaskClick={setSelectedTask} 
//             />
//             <KanbanColumn 
//               statusId="In Progress" 
//               title="Đang thực hiện" 
//               tasks={inProgressTasks} 
//               bgColor="bg-emerald-50/50" 
//               onTaskClick={setSelectedTask} 
//             />
//             <KanbanColumn 
//               statusId="Done" 
//               title="Hoàn thành" 
//               tasks={doneTasks} 
//               bgColor="bg-emerald-100/30" 
//               onTaskClick={setSelectedTask} 
//             />
//           </div>
//         </DndContext>
//       </div>

//       {/* Task Detail Modal */}
//       {selectedTask && (
//         <TaskModal
//           task={selectedTask}
//           onClose={() => setSelectedTask(null)}
//           onUpdate={handleUpdateTaskDetails}
//           isUpdating={updateMutation.isPending}
//         />
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  DndContext, 
  DragEndEvent, 
  useSensor, 
  useSensors, 
  PointerSensor,
  closestCorners 
} from "@dnd-kit/core";
import { 
  LayoutGrid, 
  Plus, 
  Loader2, 
  Search, 
  Filter,
  MoreHorizontal,
  Sparkles,
  Wand2,
  ChevronRight,
  UserCircle2
} from "lucide-react";
import { useEffect } from "react";
import { useTasks, useCreateTask, useUpdateTask,useGenerateTasksAI,useSemanticSearch } from "@/hooks/useTasks";
import { useWorkspaces } from "@/hooks/useWorkspaces"; // Để lấy tên Breadcrumbs
import { useProjects } from "@/hooks/useProjects";     // Để lấy tên Breadcrumbs
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { TaskModal, TaskUpdate, Task } from "@/components/kanban/TaskModal";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { FloatingChatbot } from "@/components/chat/FloatingChatbot"

export default function ProjectBoardPage() {
  
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [isMyTasksOnly, setIsMyTasksOnly] = useState(false);
  const params = useParams();
  const projectId = params.projectId as string;
  const workspaceId = params.workspaceId as string;

  // Lấy data để hiển thị Breadcrumbs thực tế
  const { data: workspaces } = useWorkspaces();
  const { data: projects } = useProjects(workspaceId);
  const workspaceName = workspaces?.find((w) => w.id === workspaceId)?.name || "Đang tải...";
  const projectName = projects?.find((p) => p.id === projectId)?.name || "Đang tải...";

  const { data: tasks, isLoading, error } = useTasks(projectId);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Thêm dòng này
  const { data: semanticTasks, isLoading: isSemanticLoading } = useSemanticSearch(
    projectId, 
    isSemanticSearch ? debouncedQuery : "" 
  );
  const createMutation = useCreateTask(projectId);
  const updateMutation = useUpdateTask(projectId);
  
  // States
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  
  // AI & Search States

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const generateAiMutation = useGenerateTasksAI(projectId);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate(
      { title, priority: "Medium", status: "To Do",assignee_id: currentUserId },
      { onSuccess: () => setTitle("") }
    );
  };

  const handleGenerateAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    // Gọi API thông qua Mutation
    generateAiMutation.mutate(aiPrompt, {
      onSuccess: () => {
        setIsAiModalOpen(false); // Đóng modal khi thành công
        setAiPrompt("");         // Xóa prompt cũ
      },
      onError: (err) => {
        alert("Lỗi khi tạo task: " + (err as Error).message);
      }
    });
  };

  const handleUpdateTaskDetails = (taskId: string, data: TaskUpdate) => {
    updateMutation.mutate(
      { taskId, data },
      { onSuccess: () => setSelectedTask(null) }
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const currentStatus = active.data.current?.status;
    const newStatus = over.id as string;

    if (currentStatus !== newStatus) {
      updateMutation.mutate({
        taskId: taskId,
        data: { status: newStatus },
      });
    }
  };
//   const filteredTasks = tasks?.filter((task:Task) => {
//   // Lọc theo search (nếu có)
//   const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
  
//   // Lọc theo "Task của tôi"
//   // Dựa vào thuộc tính assignee_id trong type Task
//   const matchesAssignee = isMyTasksOnly ? task.assignee_id === currentUserId : true; 

//   return matchesSearch && matchesAssignee;
// });
  const sourceTasks = (isSemanticSearch && debouncedQuery .length > 1) 
    ? (semanticTasks || []) 
    : tasks?.filter((task: Task) => 
        task.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      ) || [];

  // Lọc thêm bước "Task của tôi"
  // const finalTasks = sourceTasks.filter((task: Task) => 
  //   isMyTasksOnly ? task.assignee_id === currentUserId : true
  // );
  const finalTasks = sourceTasks.filter((task: Task) => {
    if (!isMyTasksOnly) return true;

    // Log để kiểm tra thực tế (F12 trên trình duyệt để xem)
    console.log("User ID hiện tại:", currentUserId);
    console.log("Assignee ID của Task:", task.assignee_id);

    // Dùng == thay vì === để tránh lỗi so sánh String vs Object UUID
    // Hoặc ép cả 2 về String để chắc chắn
    return String(task.assignee_id) === String(currentUserId);
  });

  // Phân loại task vào các cột dựa trên finalTasks (thay vì tasks gốc)
  const todoTasks = finalTasks.filter((t: Task) => t.status === "To Do");
  const inProgressTasks = finalTasks.filter((t: Task) => t.status === "In Progress");
  const doneTasks = finalTasks.filter((t: Task) => t.status === "Done");

  if (isLoading) return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600 w-8 h-8" />
    </div>
  );

  if (error) return <div className="p-8 text-red-500">Lỗi: {(error as Error).message}</div>;

  // const todoTasks = tasks?.filter((t: Task) => t.status === "To Do") || [];
  // const inProgressTasks = tasks?.filter((t: Task) => t.status === "In Progress") || [];
  // const doneTasks = tasks?.filter((t: Task) => t.status === "Done") || [];

  return (
    <div className="flex flex-col h-full bg-slate-50/30 dark:bg-slate-950 relative">
      
      {/* --- Header Area --- */}
      <div className="bg-white dark:bg-slate-900 border-b p-4 sm:px-8 flex flex-col gap-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href={`/workspace/${workspaceId}`} className="hover:text-emerald-600 transition-colors">
            {workspaceName}
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">{projectName}</span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 rounded-xl">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">Kanban Board</h1>
              <p className="text-sm text-slate-500">Kéo thả để cập nhật tiến độ công việc</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Nút lọc Task của tôi */}
            <button
              onClick={() => setIsMyTasksOnly(!isMyTasksOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
              isMyTasksOnly 
              ? "bg-emerald-100 text-emerald-700 border-emerald-200 border" 
              : "bg-white text-slate-600 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <UserCircle2 size={18} />
              Chỉ việc của tôi
            </button>
            {/* Search Box Thông Minh */}
            <div className={`relative flex items-center border rounded-full transition-all duration-300 ${
              isSemanticSearch 
                ? 'bg-purple-50 border-purple-200 shadow-sm shadow-purple-100 dark:bg-purple-900/20 dark:border-purple-800' 
                : 'bg-slate-100 border-transparent dark:bg-slate-800'
            }`}>
              {isSemanticSearch && isSemanticLoading ? (
              <Loader2 className="absolute left-3 text-purple-500 animate-spin" size={16} />
              ) : (
              <Search className={`absolute left-3 ${isSemanticSearch ? 'text-purple-500' : 'text-slate-400'}`} size={16} />
              )}
              {/* <Search className={`absolute left-3 ${isSemanticSearch ? 'text-purple-500' : 'text-slate-400'}`} size={16} /> */}
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isSemanticSearch ? "Tìm theo ý nghĩa (AI)..." : "Tìm từ khóa..."} 
                className="pl-9 pr-10 py-2 bg-transparent border-none text-sm focus:ring-0 outline-none w-56 md:w-64 transition-all"
              />
              <button 
                type="button"
                onClick={() => setIsSemanticSearch(!isSemanticSearch)}
                className={`absolute right-1.5 p-1.5 rounded-full transition-colors ${
                  isSemanticSearch ? 'bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-300' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Bật/Tắt Semantic Search"
              >
                <Sparkles size={14} />
              </button>
            </div>

            {/* <Button variant="outline" size="icon" className="rounded-full">
              <Filter size={16} />
            </Button> */}
            
            {/* Nút ✨ AI Task Generation */}
            <Button 
              onClick={() => setIsAiModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white rounded-full px-5 shadow-md shadow-purple-200 dark:shadow-none border-0 font-semibold gap-2 transition-all hover:scale-105"
            >
              <Wand2 size={16} />
              Tạo Task bằng AI
            </Button>
          </div>
        </div>
      </div>

      {/* --- Main Kanban Content --- */}
      <div className="flex-1 overflow-hidden p-4 sm:p-8 flex flex-col">
        
        {/* Quick Add Bar */}
        <form onSubmit={handleCreate} className="max-w-md mb-6 flex gap-2 group">
          <div className="relative flex-1">
            <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 opacity-50 group-focus-within:opacity-100 transition-opacity" size={18} />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thêm nhanh công việc mới..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              disabled={createMutation.isPending}
            />
          </div>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || !title.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6"
          >
            {createMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Thêm"}
          </Button>
        </form>

        {/* Drag and Drop Context */}
        <DndContext 
          onDragEnd={handleDragEnd} 
          sensors={sensors}
          collisionDetection={closestCorners}
        >
          <div className="flex gap-6 h-full items-start pb-4 overflow-x-auto custom-scrollbar flex-1">
            <KanbanColumn 
              statusId="To Do" 
              title="Cần làm" 
              tasks={todoTasks} 
              bgColor="bg-slate-100 dark:bg-slate-800/50" 
              onTaskClick={setSelectedTask} 
            />
            <KanbanColumn 
              statusId="In Progress" 
              title="Đang thực hiện" 
              tasks={inProgressTasks} 
              bgColor="bg-blue-50 dark:bg-blue-900/10" 
              onTaskClick={setSelectedTask} 
            />
            <KanbanColumn 
              statusId="Done" 
              title="Hoàn thành" 
              tasks={doneTasks} 
              bgColor="bg-emerald-50 dark:bg-emerald-900/10" 
              onTaskClick={setSelectedTask} 
            />
          </div>
        </DndContext>
      </div>

{isAiModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <form 
      onSubmit={handleGenerateAI}
      className="bg-white dark:bg-slate-900 p-6 rounded-3xl w-full max-w-md shadow-2xl border border-purple-100 dark:border-purple-900/30"
    >
      <div className="flex items-center gap-2 mb-4 text-purple-600">
        <Wand2 size={20} />
        <h2 className="text-xl font-bold">Tạo Task bằng AI</h2>
      </div>
      
      <p className="text-sm text-slate-500 mb-4 italic">
        {"Hãy mô tả các công việc cần làm, AI sẽ tự động phân rã thành các task nhỏ cho bạn."}
      </p>

      <textarea
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
        placeholder="Ví dụ: Lập kế hoạch ra mắt sản phẩm mới trong 2 tuần..."
        className="w-full h-32 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 dark:bg-slate-800 transition-all resize-none mb-4"
        disabled={generateAiMutation.isPending} // Khóa input khi đang chạy
      />

      <div className="flex justify-end gap-3">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setIsAiModalOpen(false)}
          disabled={generateAiMutation.isPending}
        >
          Hủy bỏ
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6"
          disabled={generateAiMutation.isPending || !aiPrompt.trim()}
        >
          {generateAiMutation.isPending ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Đang phân tích...
            </>
          ) : "Bắt đầu tạo"}
        </Button>
      </div>
    </form>
  </div>
)}

      {/* Task Detail Modal (Cũ) */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTaskDetails}
          isUpdating={updateMutation.isPending}
        />
      )}
      <FloatingChatbot projectId={projectId} />
    </div>
  );
}