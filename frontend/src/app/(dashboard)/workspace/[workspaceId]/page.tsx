"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Project } from "@/types/project";
import { useProjects, useCreateProject } from "@/hooks/useProjects";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { data: projects, isLoading, error } = useProjects(workspaceId);
  const createMutation = useCreateProject(workspaceId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(
      { name, description, is_public: isPublic },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setIsPublic(true);
        },
      }
    );
  };

  if (isLoading) return <div className="p-8">Đang tải danh sách dự án...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {(error as Error).message}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/workspace" className="text-blue-500 hover:underline">
          &larr; Quay lại danh sách Workspace
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Dự án trong Workspace</h1>

      {/* Form tạo Project */}
      <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-md mb-8 border flex flex-col gap-3">
        <h3 className="font-semibold">Tạo dự án mới</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên dự án..."
          className="border p-2 rounded-md"
          disabled={createMutation.isPending}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả dự án (AI sẽ đọc phần này)..."
          className="border p-2 rounded-md"
          disabled={createMutation.isPending}
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            disabled={createMutation.isPending}
          />
          Public (Tất cả thành viên trong Workspace đều thấy)
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-fit"
        >
          {createMutation.isPending ? "Đang tạo..." : "Tạo Project"}
        </button>
      </form>

      {/* Danh sách Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects?.map((project: Project) => (
          <div key={project.id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{project.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${project.is_public ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {project.is_public ? 'Public' : 'Private'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{project.description || "Không có mô tả"}</p>
            
            {/* Nút giả định để đi vào Kanban board của Project này */}
            <Link href={`/project/${project.id}`} className="text-sm text-blue-600 hover:underline">
              Vào xem Tasks &rarr;
            </Link>
          </div>
        ))}

        {projects?.length === 0 && (
          <p className="text-gray-500 col-span-2">Chưa có dự án nào. Hãy tạo một cái mới!</p>
        )}
      </div>
    </div>
  );
}