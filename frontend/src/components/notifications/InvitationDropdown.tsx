"use client";

import { Bell, MailWarning, Check, X, Loader2 } from "lucide-react";
import { useMyInvitations, useAcceptInvitation, useDeclineInvitation } from "@/hooks/useInvitations";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Giả sử dùng Shadcn Popover, hoặc css thuần

export function InvitationDropdown() {
  const { data: invitations, isLoading } = useMyInvitations();
  const acceptMutation = useAcceptInvitation();
  const declineMutation = useDeclineInvitation();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingInvites = invitations?.filter(inv => inv.status === "pending") || [];
  const count = pendingInvites.length;

  const handleAction = async (id: string, action: 'accept' | 'decline') => {
    setProcessingId(id);
    try {
      if (action === 'accept') {
        await acceptMutation.mutateAsync(id);
      } else {
        await declineMutation.mutateAsync(id);
      }
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
          <Bell size={22} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 rounded-2xl mt-3 mr-2 overflow-hidden shadow-2xl shadow-slate-200/50" align="end">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">Lời mời tham gia</h3>
          <p className="text-sm text-slate-500">Bạn có {count} lời mời đang chờ xử lý</p>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex justify-center p-6"><Loader2 className="animate-spin text-emerald-600" /></div>
          ) : count === 0 ? (
            <div className="text-center p-10 text-slate-400 flex flex-col items-center gap-3">
              <MailWarning size={40} strokeWidth={1} />
              <p className="text-sm font-medium">Không có lời mời nào mới</p>
            </div>
          ) : (
            pendingInvites.map((inv) => (
              <div key={inv.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    Workspace: <span className="text-emerald-600">{inv.workspace_name}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate">Vai trò mời: {inv.role}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {processingId === inv.id ? (
                    <Loader2 size={18} className="animate-spin text-slate-400" />
                  ) : (
                    <>
                      <button 
                        onClick={() => handleAction(inv.id, 'accept')}
                        className="p-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                        title="Chấp nhận"
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleAction(inv.id, 'decline')}
                        className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                        title="Từ chối"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}