"use client";

import React, { useState, useEffect } from "react";
// 1. Thêm useParams để lấy ID từ URL
import { usePathname, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Home, CheckSquare, Plus, 
  ChevronDown, LayoutGrid
} from "lucide-react";

import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { CreateWorkspaceModal } from "@/components/modals/CreateWorkspaceModal"
import { CreateProjectModal } from "@/components/modals/CreateProjectModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutButton from "@/components/auth/LogoutButton";

export function Sidebar() {
  const pathname = usePathname();
  const params = useParams(); // Lấy workspaceId và projectId từ URL
  const router = useRouter();
  const { data: session } = useSession();
  const { data: workspaces } = useWorkspaces();

  // 2. Ưu tiên lấy workspaceId từ URL, nếu không có mới lấy cái đầu tiên
  const activeWsId = (params.workspaceId as string) || workspaces?.[0]?.id;
  const activeProjectId = params.projectId as string;

  const { data: projects } = useProjects(activeWsId || "");
  const activeWs = workspaces?.find(ws => ws.id === activeWsId);

  const [isWsModalOpen, setIsWsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-slate-50/50 dark:bg-slate-900/50">
      {/* 1. Workspace Switcher */}
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2 hover:bg-emerald-100/50">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
                  {activeWs?.name.charAt(0).toUpperCase() || "W"}
                </div>
                <span className="truncate font-semibold text-slate-800">
                  {activeWs?.name || "Chọn Workspace"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50 text-emerald-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {workspaces?.map((ws) => (
              /* Dùng Link để đổi URL khi chọn Workspace */
              <Link key={ws.id} href={`/workspace/${ws.id}`}>
                <DropdownMenuItem className="cursor-pointer focus:bg-emerald-50">
                  {ws.name}
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuItem 
              className="text-emerald-600 font-medium cursor-pointer"
              onClick={() => setIsWsModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Tạo Workspace mới
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 2. Quick Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        <SidebarNavItem 
          href={`/workspace/${activeWsId}`} 
          icon={<Home size={18} />} 
          label="Trang chủ" 
          active={pathname === `/workspace/${activeWsId}`} 
        />
        {/* <SidebarNavItem 
          href="/tasks" 
          icon={<CheckSquare size={18} />} 
          label="Tasks của tôi" 
          active={pathname === "/tasks"}
        /> */}
        
        <div className="mt-8">
          <div className="flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Dự án hiện tại
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 hover:text-emerald-600"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Plus size={14}/>
            </Button>
          </div>
          <div className="space-y-1 mt-1">
            {projects?.map((project) => (
              <SidebarNavItem 
                key={project.id} 
                icon={<LayoutGrid size={18} />} 
                label={project.name} 
                // 3. Link theo cấu trúc mới: /workspace/[id]/[projectId]
                href={`/workspace/${activeWsId}/${project.id}`} 
                active={activeProjectId === project.id}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <CreateWorkspaceModal 
        isOpen={isWsModalOpen} 
        onClose={() => setIsWsModalOpen(false)} 
      />
      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)}
        workspaceId={activeWsId || ""} 
      />

      {/* 3. User Profile */}
      <div className="border-t p-4 bg-emerald-50/20">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <Avatar className="h-9 w-9 ring-2 ring-emerald-100 shadow-sm">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
              {session?.user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate text-slate-700">{session?.user?.name}</span>
            <span className="text-[10px] text-emerald-600/70 font-medium truncate italic">{session?.user?.email}</span>
          </div>
        </div>
        <LogoutButton /> 
      </div>
    </div>
  );
}

function SidebarNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`
      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? "bg-emerald-100/80 text-emerald-800 shadow-sm border-l-4 border-emerald-600 rounded-l-none pl-2" 
        : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"}
    `}>
      <span className={`${active ? "text-emerald-600" : "text-slate-400"}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}