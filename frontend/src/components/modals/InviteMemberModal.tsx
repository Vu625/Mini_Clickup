"use client";

import { useState,useEffect } from "react";
import { Workspace } from "@/types/workspace";
import { User } from "@/types/user";
import { useSearchUsers } from "@/hooks/useUsers";
import { useInviteMember } from "@/hooks/useInvitations";
import { X, Loader2, UserPlus, Search, Mail, MailCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Hook helper để debounce value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface InviteMemberModalProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberModal({ workspace, isOpen, onClose }: InviteMemberModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Đợi 0.5s sau khi gõ xong mới search
  
  // Gọi hook search user
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedSearchTerm);
  
  // Gọi hook gửi lời mời
  const inviteMutation = useInviteMember(workspace.id);
  
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null);
  const [invitedEmails, setInvitedEmails] = useState<Set<string>>(new Set()); // Lưu các email đã mời thành công trong session này

  const handleInvite = async (user: User) => {
    if (!user.email) return;
    setInvitingUserId(user.id);
    try {
      // Gửi request mời với vai trò mặc định "Member" (theo type định nghĩa)
      await inviteMutation.mutateAsync({ invitee_email: user.email, role: "Member" });
      
      // Đánh dấu đã mời thành công để UI update nút
      setInvitedEmails(prev => new Set(prev).add(user.email));
      // Toast success ở đây
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setInvitingUserId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
              <UserPlus className="text-emerald-600" size={22}/>
              Mời vào <span className="text-emerald-600 truncate max-w-[200px]">{workspace.name}</span>
            </DialogTitle>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
          </div>
        </DialogHeader>
        
        <div className="p-6 bg-white dark:bg-slate-950 space-y-5">
          {/* Thanh tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên hoặc email chính xác..."
              className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-900 dark:text-white"
              autoFocus
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-emerald-600" />}
          </div>

          {/* Kết quả tìm kiếm */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kết quả tìm kiếm ({searchResults?.length || 0})</h4>
            
            {!debouncedSearchTerm || debouncedSearchTerm.length < 2 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Nhập ít nhất 2 ký tự để tìm kiếm</div>
            ) : searchResults?.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">Không tìm thấy người dùng phù hợp</div>
            ) : (
              searchResults?.map((user) => {
                const isAlreadyInvited = invitedEmails.has(user.email);
                return (
                  <div key={user.id} className="flex items-center justify-between gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-lg shrink-0">
                        {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-white truncate">{user.full_name || "Chưa đặt tên"}</p>
                        <p className="text-sm text-slate-500 truncate flex items-center gap-1.5">
                          <Mail size={14}/>
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {isAlreadyInvited ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
                        <MailCheck size={14} />
                        Đã gửi
                      </div>
                    ) : (
                      <button
                        onClick={() => handleInvite(user)}
                        disabled={invitingUserId === user.id}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {invitingUserId === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <UserPlus size={14} />
                        )}
                        Mời
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
              Đóng
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}