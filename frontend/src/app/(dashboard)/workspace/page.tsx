"use client";

import { useState } from "react";
import Link from "next/link"
import { Workspace } from "@/types/workspace";
import { useWorkspaces, useCreateWorkspace } from "@/hooks/useWorkspaces";

export default function WorkspacePage() {
  const { data: workspaces, isLoading, error } = useWorkspaces();
  const createMutation = useCreateWorkspace();
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    createMutation.mutate(newWorkspaceName, {
      onSuccess: () => setNewWorkspaceName(""), // Xóa input sau khi tạo xong
    });
  };

  if (isLoading) return <div className="p-8 text-gray-500">Đang tải workspaces...</div>;
  if (error) return <div className="p-8 text-red-500">Lỗi: {(error as Error).message}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Không gian làm việc của bạn</h1>

      {/* Form tạo mới */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          placeholder="Nhập tên workspace..."
          className="border p-2 rounded-md flex-1"
          disabled={createMutation.isPending}
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {createMutation.isPending ? "Đang tạo..." : "Tạo Workspace"}
        </button>
      </form>

      {/* Danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces?.map((ws: Workspace) => (
          <Link href = {`/workspace/${ws.id}`} key = {ws.id} className="block">
          <div key={ws.id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-lg">{ws.name}</h3>
            <p className="text-sm text-gray-500 mt-2">ID: {ws.id.split("-")[0]}...</p>
          </div>
          </Link>
        ))}
        
        {workspaces?.length === 0 && (
          <p className="text-gray-500 col-span-3">Bạn chưa tham gia Workspace nào.</p>
        )}
      </div>
    </div>
  );
}