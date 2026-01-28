
import AIChatBot from "../../components/ai/AIChatBot";
import { 
  TrendingUp, Map, Award, Rocket, 
  ChevronRight, Sparkles, Globe, ShieldCheck 
} from "lucide-react";

export default function AIChatPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-brand-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[0%] w-[35%] h-[35%] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center">
          
          {/* Header Section - Centered */}
          <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} className="animate-pulse" />
              Next-Gen Real Estate Intelligence
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight text-[#1A1A1A]">
              Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-600">DNA</span> of Every Listing.
            </h1>
            
            <p className="text-lg font-medium text-gray-500 leading-relaxed max-w-2xl mx-auto">
              Harness the power of Viewora RAG to get hyper-local analysis, institutional-grade pricing trends, and area investment scores in seconds.
            </p>
          </div>

          {/* Chat Interface - Centered & Prominent */}
          <div className="w-full relative animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="relative group/chat max-w-4xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-blue-500/20 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <div className="relative h-[750px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100">
                 <AIChatBot />
              </div>
            </div>

            {/* Capability Badges */}
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
               <CapabilityTag label="Pricing Trends" />
               <CapabilityTag label="Area Scores" />
               <CapabilityTag label="Local Projects" />
               <CapabilityTag label="Investment ROI" />
               <CapabilityTag label="Infrastructure" />
            </div>
          </div>

          {/* Trust Footer */}
          <div className="mt-16 flex items-center gap-12 opacity-30 grayscale hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">
                 <Globe size={14} /> Institutional Data Access
               </div>
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">
                 <ShieldCheck size={14} /> Verified RAG Engine
               </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- CUSTOM UI COMPONENTS ---------- */

function InsightFeature({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-5 group">
       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-xl group-hover:shadow-brand-primary/10 transition-all duration-500 flex-shrink-0">
          <Icon size={20} />
       </div>
       <div className="space-y-1">
          <h3 className="font-black text-[#1A1A1A] tracking-tight group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-xs font-medium text-gray-400 leading-relaxed max-w-xs">{desc}</p>
       </div>
    </div>
  );
}

function CapabilityTag({ label }) {
  return (
    <span className="px-5 py-2 rounded-full bg-white border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all cursor-default shadow-sm">
      {label}
    </span>
  );
}
