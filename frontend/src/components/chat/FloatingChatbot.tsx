// "use client";

// import { useState, useRef, useEffect } from "react";
// import { MessageSquareText, X, Send, Loader2, Sparkles, Bot } from "lucide-react";

// export function FloatingChatbot({ projectId }: { projectId: string }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [query, setQuery] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [messages, setMessages] = useState<{ role: "user" | "ai", content: string }[]>([
//     { role: "ai", content: "Chào bạn! Mình là trợ lý AI của dự án. Bạn muốn tìm kiếm thông tin hay lên kế hoạch gì hôm nay?" }
//   ]);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Auto scroll xuống tin nhắn mới nhất
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, isTyping]);

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!query.trim()) return;

//     const userMessage = query;
//     setMessages(prev => [...prev, { role: "user", content: userMessage }]);
//     setQuery("");
//     setIsTyping(true);

//     try {
//       // TODO: GỌI API SEMANTIC SEARCH HOẶC RAG CỦA BẠN TẠI ĐÂY
//       // Ví dụ: const res = await aiService.askProject(projectId, userMessage);
      
//       // Giả lập delay trả lời
//       setTimeout(() => {
//         setMessages(prev => [...prev, { 
//           role: "ai", 
//           content: "Dựa trên dữ liệu dự án, task bạn đang hỏi thuộc về module Auth và đang được giao cho dev frontend. Cần tôi tóm tắt thêm không?" 
//         }]);
//         setIsTyping(false);
//       }, 1500);

//     } catch (error) {
//       setMessages(prev => [...prev, { role: "ai", content: "Xin lỗi, đã có lỗi kết nối đến hệ thống AI." }]);
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
//       {/* Cửa sổ Chat */}
//       {isOpen && (
//         <div className="mb-4 w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transform transition-all animate-in slide-in-from-bottom-5">
//           {/* Chat Header */}
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between shadow-md z-10">
//             <div className="flex items-center gap-3 text-white">
//               <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
//                 <Bot size={22} className="text-white" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-sm">AI Project Assistant</h3>
//                 <p className="text-xs text-emerald-100 flex items-center gap-1">
//                   <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse"></span>
//                   Sẵn sàng hỗ trợ
//                 </p>
//               </div>
//             </div>
//             <button 
//               onClick={() => setIsOpen(false)}
//               className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           {/* Chat Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                 <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
//                   msg.role === "user" 
//                     ? "bg-emerald-600 text-white rounded-br-sm" 
//                     : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm"
//                 }`}>
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm p-4 flex gap-1 shadow-sm">
//                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
//                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
//                   <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Chat Input */}
//           <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
//             <input
//               type="text"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               placeholder="Hỏi AI về dự án này..."
//               className="flex-1 bg-slate-100 dark:bg-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white placeholder:text-slate-400 transition-all"
//             />
//             <button
//               type="submit"
//               disabled={!query.trim() || isTyping}
//               className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl p-3 flex items-center justify-center transition-colors shadow-sm"
//             >
//               <Send size={18} />
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Nút FAB (Floating Action Button) */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 ${
//           isOpen 
//             ? "bg-slate-800 text-white rotate-90" 
//             : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30"
//         }`}
//       >
//         {isOpen ? <X size={24} /> : (
//           <div className="relative">
//             <MessageSquareText size={26} />
//             <Sparkles size={12} className="absolute -top-1 -right-2 text-yellow-300 animate-pulse" />
//           </div>
//         )}
//       </button>
//     </div>
//   );
// }
"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquareText, X, Send, Loader2, Sparkles, Bot } from "lucide-react";
// Nhớ import hook useAIChat đúng đường dẫn của bạn nhé (ví dụ từ "@/hooks/useTasks")
import { useAIChat } from "@/hooks/useTasks"; 

export function FloatingChatbot({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai", content: string }[]>([
    { role: "ai", content: "Chào bạn! Mình là trợ lý AI của dự án. Bạn muốn tìm kiếm thông tin hay lên kế hoạch gì hôm nay?" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Khởi tạo Hook gọi API
  const chatMutation = useAIChat(projectId);

  // Auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    // Chặn gửi nếu input rỗng hoặc đang chờ AI trả lời
    if (!query.trim() || chatMutation.isPending) return;

    const userMessage = query;
    // Cập nhật UI ngay lập tức với tin nhắn của user
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setQuery("");

    try {
      // 2. Gọi API thực tế và đợi kết quả
      const response = await chatMutation.mutateAsync(userMessage);
      
      // 3. Cập nhật UI với câu trả lời từ AI
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: response.answer 
      }]);

    } catch (error) {
      console.error("Lỗi khi chat với AI:", error);
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "Xin lỗi, đã có lỗi kết nối đến hệ thống AI. Vui lòng thử lại sau nhé." 
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="mb-4 w-[380px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transform transition-all animate-in slide-in-from-bottom-5">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex items-center justify-between shadow-md z-10">
            {/* ... Phần header giữ nguyên ... */}
            <div className="flex items-center gap-3 text-white">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Project Assistant</h3>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse"></span>
                  Sẵn sàng hỗ trợ
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-wrap ${
                  msg.role === "user" 
                    ? "bg-emerald-600 text-white rounded-br-sm" 
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Hiệu ứng Typing tự động bật khi API đang gọi */}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm p-4 flex gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hỏi AI về dự án này..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 dark:text-white placeholder:text-slate-400 transition-all"
              disabled={chatMutation.isPending} // Disable input khi đang đợi phản hồi
            />
            <button
              type="submit"
              disabled={!query.trim() || chatMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl p-3 flex items-center justify-center transition-colors shadow-sm"
            >
              {chatMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}

      {/* Nút FAB (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen 
            ? "bg-slate-800 text-white rotate-90" 
            : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30"
        }`}
      >
        {isOpen ? <X size={24} className="-rotate-90 transition-transform" /> : (
          <div className="relative">
            <MessageSquareText size={26} />
            <Sparkles size={12} className="absolute -top-1 -right-2 text-yellow-300 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}