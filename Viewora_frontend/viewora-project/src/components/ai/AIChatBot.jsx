
import { useState, useRef, useEffect, useContext, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { getAreaInsights } from "../../api/aiApi";
import MarkdownRenderer from "../ui/MarkdownRenderer";
import { 
  Send, Sparkles, RefreshCw, Bot, User, 
  ChevronRight, Building2, Landmark, 
  MapPin, AlertCircle, Clock
} from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "Is Whitefield good for investment?",
  "What are the pricing trends in Palakkad?",
  "Best areas for 3BHK villas under 1Cr?",
  "Upcoming development near Kanjikode?"
];

const AIChatBot = forwardRef((props, ref) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const storageKey = `viewora_ai_chat_${user?.id || 'guest'}`;

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(msg => ({
          ...msg,
          time: new Date(msg.time)
        }));
      } catch (e) {
        console.error("Failed to load AI chat history", e);
      }
    }
    return [
      {
        role: "assistant",
        content: `Hello ${user?.first_name || 'there'}! I'm your Viewora real estate advisor. How can I help you find your dream property today?`,
        time: new Date()
      }
    ];
  });
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    const query = text.trim();
    if (!query) return;

    // Add user message
    const userMsg = { role: "user", content: query, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await getAreaInsights(query);
      const aiMsg = { 
        role: "assistant", 
        content: res.data.answer, 
        sources: res.data.sources || [],
        time: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "I'm sorry, I'm having trouble connecting to the AI service. Please try again in a moment.";
      const errorMsg = { 
        role: "assistant", 
        content: errorMessage, 
        isError: true,
        time: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const initial = [
      {
        role: "assistant",
        content: `Hello ${user?.first_name || 'there'}! I'm your Viewora real estate advisor. How can I help you find your dream property today?`,
        time: new Date()
      }
    ];
    setMessages(initial);
    localStorage.removeItem(storageKey);
  };

  useImperativeHandle(ref, () => ({
    clearChat
  }));

  return (
    <div className="flex flex-col h-full bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      {/* Header - Glassmorphism */}
      <div className="bg-[#1A1A1A] px-6 py-4 flex items-center justify-between shadow-xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 blur-3xl rounded-full" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
            <Sparkles size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-black tracking-tight text-sm uppercase">Advisor AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Global Insights Live</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          title="Clear History"
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/5 relative z-10"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 bg-white/50 scrollbar-hide">
        {messages.map((msg, idx) => {
          let displayContent = msg.content;
          let filteredSources = msg.sources || [];
          
          if (msg.role === 'assistant' && msg.content.includes('REFERENCES:')) {
            const parts = msg.content.split(/REFERENCES:\s*\[(.*?)\]/);
            if (parts.length >= 2) {
              displayContent = parts[0].trim();
              const refIds = parts[1].split(',').map(id => id.trim());
              
              if (refIds.length > 0 && msg.sources) {
                filteredSources = msg.sources.filter(s => 
                  refIds.includes(String(s.property_id))
                );
              }
            }
          }

          const isAI = msg.role === 'assistant';

          return (
            <div key={idx} className={`flex ${isAI ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex gap-3 max-w-[85%] ${!isAI && 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                  isAI 
                    ? 'bg-brand-primary/5 border-brand-primary/10 text-brand-primary' 
                    : 'bg-[#1A1A1A] border-transparent text-white'
                }`}>
                  {isAI ? <Bot size={16} /> : <User size={16} />}
                </div>

                <div className="space-y-2">
                  <div className={`rounded-3xl p-4 shadow-sm border ${
                    isAI 
                      ? 'bg-white border-gray-100 text-[#1A1A1A] rounded-tl-none' 
                      : 'bg-[#1A1A1A] border-transparent text-white rounded-tr-none'
                  }`}>
                    {isAI ? (
                      <div className="prose prose-sm prose-slate max-w-none text-sm font-medium leading-relaxed">
                        <MarkdownRenderer content={displayContent} />
                      </div>
                    ) : (
                      <p className="text-sm font-bold tracking-tight">{msg.content}</p>
                    )}

                    {/* Meta Info */}
                    <div className={`flex items-center gap-1.5 mt-2 opacity-30 ${!isAI && 'justify-end'}`}>
                      <Clock size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Sources as Premium Mini Cards */}
                  {filteredSources?.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-700 delay-300">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Relevant Hubs</p>
                      <div className="flex flex-col gap-2">
                        {filteredSources.map((s, sIdx) => (
                          <div 
                            key={sIdx} 
                            onClick={() => s.property_id && navigate(`/properties/${s.property_id}`)}
                            className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:border-brand-primary hover:shadow-xl hover:shadow-black/5 transition-all group cursor-pointer"
                          >
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-lg shadow-inner group-hover:bg-brand-primary/5 transition-colors">
                              {s.type === 'commercial' ? <Landmark size={18} className="text-brand-primary" /> : <Building2 size={18} className="text-brand-primary" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-[#1A1A1A] truncate uppercase tracking-tighter">{s.title || s.locality || 'View Listing'}</p>
                              <div className="flex items-center gap-1 text-gray-400">
                                <MapPin size={10} />
                                <p className="text-[9px] font-medium truncate uppercase tracking-widest">{s.city || 'Strategic Asset'}</p>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-gray-300 group-hover:text-[#1A1A1A] transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center">
                <Bot size={16} className="text-brand-primary animate-pulse" />
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl rounded-tl-none p-5 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-brand-primary/30 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !loading && (
        <div className="px-6 py-4 border-t border-gray-50 bg-[#FDFDFD]">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Popular Intelligence Inquiries</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-gray-100 text-gray-500 hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 pt-5 pb-4 bg-white border-t border-gray-100">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Search local dynamics, pricing trends, or asset scores..."
            className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 pr-14 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-brand-primary/5 transition-all outline-none placeholder:text-gray-300"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#1A1A1A] text-white rounded-[1rem] disabled:opacity-20 hover:bg-black hover:shadow-xl hover:shadow-black/10 transition-all active:scale-95 group/send"
          >
            <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-2 opacity-20">
           <AlertCircle size={10} />
           <p className="text-[9px] font-black uppercase tracking-widest text-[#1A1A1A]">Powered by Viewora Intelligence Engine v4.0</p>
        </div>
      </div>
    </div>
  );
});

export default AIChatBot;
