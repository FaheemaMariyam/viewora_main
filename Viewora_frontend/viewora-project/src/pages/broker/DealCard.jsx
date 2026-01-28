
import { User, Clock, Building2, CheckCircle2 } from "lucide-react";

export function DealCard({ interest, isSelected, onClick, type, onAccept }) {
  const statusColor = (status) => {
    switch (status) {
      case "assigned": return "text-indigo-600 bg-indigo-50 border-indigo-100";
      case "in_progress": return "text-amber-600 bg-amber-50 border-amber-100";
      case "closed": return "text-emerald-600 bg-emerald-50 border-emerald-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative p-4 mb-3 rounded-2xl cursor-pointer transition-all duration-300 border
        ${isSelected 
          ? "bg-white border-brand-primary/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)]" 
          : "bg-white border-gray-100 hover:border-brand-primary/10 hover:shadow-lg hover:shadow-gray-100/50 hover:-translate-y-0.5"}
      `}
    >
      {/* Active Indicator Strip */}
      {isSelected && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-brand-primary rounded-r-full" />
      )}

      <div className="flex justify-between items-start mb-2 pl-2">
        <h4 className={`text-sm font-bold line-clamp-1 ${isSelected ? "text-brand-primary" : "text-gray-900"}`}>
          {interest.property}
        </h4>
        {type === "clients" && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-black tracking-wider border ${statusColor(interest.status)}`}>
            {interest.status.replace("_", " ")}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 pl-2">
        <User size={12} className="text-gray-400" />
        <span className="font-medium text-gray-700">{interest.client}</span>
      </div>

      {type === "requests" && (
        <button
          onClick={(e) => onAccept(interest.id, e)}
          className="
            mt-2 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
            bg-[#1A1A1A] text-white border border-[#1A1A1A]
            hover:bg-white hover:text-[#1A1A1A] transition-all duration-300
            shadow-sm flex items-center justify-center gap-2
          "
        >
          <CheckCircle2 size={12} />
          Accept Request
        </button>
      )}
    </div>
  );
}
