"use client";
import {  
  useSensor, 
  useSensors,
  PointerSensor 
} from "@dnd-kit/core";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useTasks, useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
// import { Task} from "@/types/task";
import { TaskModal, TaskUpdate, Task } from "@/components/kanban/TaskModal";
export default function ProjectBoardPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: tasks, isLoading, error } = useTasks(projectId);
  const createMutation = useCreateTask(projectId);
  const updateMutation = useUpdateTask(projectId); // Hook cập nhật task
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Chuột phải di chuyển ít nhất 5px mới kích hoạt trạng thái Drag
      },
    })
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate(
      { title, priority: "Medium", status: "To Do" },
      { onSuccess: () => setTitle("") }
    );
  };

  const handleUpdateTaskDetails = (taskId: string, data: TaskUpdate) => {
    updateMutation.mutate(
      { taskId, data },
      {
        onSuccess: () => {
          setSelectedTask(null); // Đóng modal khi lưu thành công
        },
      }
    );
  };

  // Logic xử lý khi người dùng thả chuột (Drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Nếu không thả vào cột nào hợp lệ thì bỏ qua
    if (!over) return;

    const taskId = active.id as string;
    const currentStatus = active.data.current?.status;
    const newStatus = over.id as string; // over.id chính là statusId của KanbanColumn

    // Chỉ gọi API nếu task được thả sang cột khác
    if (currentStatus !== newStatus) {
      updateMutation.mutate({
        taskId: taskId,
        data: { status: newStatus },
      });
    }
  };

  if (isLoading) return <div className="p-8">Đang tải bảng công việc...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {(error as Error).message}</div>;

  // Lọc dữ liệu cho các cột
  const todoTasks = tasks?.filter((t: Task) => t.status === "To Do") || [];
  const inProgressTasks = tasks?.filter((t: Task) => t.status === "In Progress") || [];
  const doneTasks = tasks?.filter((t: Task) => t.status === "Done") || [];

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col h-screen relative">
      <div className="mb-4">
        <Link href="/workspace" className="text-blue-500 hover:underline">
          &larr; Về danh sách Workspace
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      {/* Form tạo nhanh */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-md mb-8 border flex gap-3 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tên task mới..."
          className="border p-2 rounded-md flex-1"
          disabled={createMutation.isPending}
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700"
        >
          {createMutation.isPending ? "..." : "Thêm Task"}
        </button>
      </form>

      {/* DndContext lắng nghe toàn bộ sự kiện kéo thả */}
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="flex gap-6 flex-1 overflow-x-auto pb-4 items-start">
          <KanbanColumn 
            statusId="To Do" title="To Do" tasks={todoTasks} bgColor="bg-gray-100" 
            onTaskClick={setSelectedTask} 
          />
          <KanbanColumn 
            statusId="In Progress" title="In Progress" tasks={inProgressTasks} bgColor="bg-blue-50" 
            onTaskClick={setSelectedTask} 
          />
          <KanbanColumn 
            statusId="Done" title="Done" tasks={doneTasks} bgColor="bg-green-50" 
            onTaskClick={setSelectedTask} 
          />
        </div>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTaskDetails}
          isUpdating={updateMutation.isPending}
        />
      )}
    </div>
  );
}