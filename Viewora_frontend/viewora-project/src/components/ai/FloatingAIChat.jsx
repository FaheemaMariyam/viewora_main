
import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../auth/AuthContext';
import AIChatBot from './AIChatBot';
import { X, RefreshCw, Sparkles } from 'lucide-react';

export default function FloatingAIChat() {
  const { isAuthenticated } = useContext(AuthContext);
  const chatRef = useRef(null);
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("viewora_ai_chat_open") === "true";
  });

  if (!isAuthenticated) return null;

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem("viewora_ai_chat_open", nextState);
  };

  const handleClear = () => {
    if (window.confirm("Restore intelligence profile to default state? This clears all current insights.")) {
      chatRef.current?.clearChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window Container */}
      {isOpen && (
        <div className="mb-4 w-[420px] max-w-[90vw] h-[650px] animate-in fade-in slide-in-from-bottom-6 duration-500 group/window">
          <div className="relative h-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.15)] ring-1 ring-black/5 border border-gray-100 flex flex-col">
            
            {/* Contextual Overlay Actions */}
            <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
              <button 
                onClick={handleClear}
                title="Reset Intelligence"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md border border-transparent hover:border-white/10"
              >
                <RefreshCw size={14} />
              </button>
              <button 
                onClick={toggleChat}
                title="Minimize Explorer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md border border-transparent hover:border-white/10"
              >
                <X size={14} />
              </button>
            </div>

            {/* Injected Chat Bot */}
            <AIChatBot ref={chatRef} />
          </div>
        </div>
      )}

      {/* Advanced Floating Launcher */}
      <div className="relative group">
        {/* Glow Effects */}
        <div className={`absolute inset-0 rounded-full bg-brand-primary blur-xl transition-all duration-700 ${isOpen ? 'opacity-0 scale-50' : 'opacity-20 group-hover:opacity-40 scale-125'}`} />
        
        <button
          onClick={toggleChat}
          className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-[1.5rem] shadow-2xl transition-all duration-500 transform active:scale-95 border border-white/10 ${
            isOpen 
              ? 'bg-[#1A1A1A] text-white rotate-90 rounded-full' 
              : 'bg-[#1A1A1A] text-white hover:shadow-brand-primary/20'
          }`}
        >
          {isOpen ? (
            <X size={24} className="animate-in fade-in zoom-in duration-300" />
          ) : (
            <div className="relative flex items-center justify-center">
               <Sparkles size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse" />
               
               {/* Identity Indicator */}
               <span className="absolute -top-3 -right-3 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#1A1A1A] border-2 border-white flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  </span>
               </span>
            </div>
          )}
        </button>

        {/* Dynamic Label */}
        {!isOpen && (
          <div className="absolute right-full mr-5 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-2xl flex items-center gap-3 whitespace-nowrap border border-white/5">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Query Viewora AI
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-[6px] border-transparent border-l-[#1A1A1A]" />
          </div>
        )}
      </div>
    </div>
  );
}
