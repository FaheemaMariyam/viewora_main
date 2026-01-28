
import { useEffect, useState, useContext } from "react";
import {
  getNotifications,
  markNotificationsRead,
} from "../api/notificationApi";
import { AuthContext } from "../auth/AuthContext";
import { 
  Bell, Clock, Calendar, Inbox, 
  ChevronRight, Trash2, Info, 
  AlertCircle, CheckCircle2, ShieldCheck
} from "lucide-react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const { setTotalUnread } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
        await markNotificationsRead();
        setTotalUnread(0);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    load();
  }, [setTotalUnread]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getNotificationIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('approve') || t.includes('verify')) return <ShieldCheck size={18} className="text-emerald-500" />;
    if (t.includes('interest') || t.includes('query')) return <Info size={18} className="text-blue-500" />;
    if (t.includes('alert') || t.includes('warning')) return <AlertCircle size={18} className="text-amber-500" />;
    return <Bell size={18} className="text-brand-primary" />;
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                <Bell size={12} className="animate-pulse" />
                Connectivity Hub
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-[#1A1A1A]">
               Notifications
             </h1>
             <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">
               Track your property engagements and security updates
             </p>
          </div>
          
          <button 
             className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-all bg-white shadow-sm"
             onClick={() => setNotifications([])}
          >
            <Trash2 size={14} />
            Flush Records
          </button>
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] animate-in fade-in zoom-in duration-1000">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
               <Inbox size={32} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-black tracking-tight text-gray-300 uppercase">Archive is Empty</h3>
            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">All activity is currently accounted for</p>
          </div>
        )}

        {/* Notification List */}
        <div className="space-y-4">
          {notifications.map((n, idx) => (
            <div
              key={n.id}
              style={{ animationDelay: `${idx * 50}ms` }}
              className={`
                group relative p-6 rounded-[2rem] border transition-all duration-500 animate-in fade-in slide-in-from-bottom-2
                ${n.is_read 
                  ? "bg-white border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]" 
                  : "bg-white border-brand-primary/20 shadow-[0_20px_60px_rgba(15,23,42,0.05)] ring-1 ring-brand-primary/5"}
                hover:border-brand-primary hover:shadow-[0_30px_100px_rgba(0,0,0,0.08)]
              `}
            >
              <div className="flex gap-6">
                {/* Status Indicator & Icon */}
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                    n.is_read 
                      ? "bg-gray-50 border-gray-100 text-gray-400" 
                      : "bg-brand-primary/5 border-brand-primary/10 text-brand-primary"
                  } group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm`}>
                    {getNotificationIcon(n.title)}
                  </div>
                  {!n.is_read && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-40"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-primary border-2 border-white"></span>
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h4 className={`text-sm font-black uppercase tracking-tight truncate ${n.is_read ? "text-[#1A1A1A]" : "text-brand-primary"}`}>
                        {n.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-wider text-gray-400">
                         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500">
                            <Clock size={10} />
                            {formatTime(n.created_at)}
                         </div>
                         <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors duration-500">
                            <Calendar size={10} />
                            {formatDate(n.created_at)}
                         </div>
                      </div>
                   </div>
                   <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-2xl line-clamp-2 group-hover:text-[#1A1A1A] transition-colors duration-500">
                     {n.body}
                   </p>
                </div>

                {/* Interaction Arrow */}
                <div className="hidden sm:flex items-center self-center pl-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                   <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center">
                      <ChevronRight size={16} />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Meta */}
        <div className="mt-16 pt-8 border-t border-gray-50 flex items-center justify-center opacity-20">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]">
             Viewora Communication Interface v1.0
           </p>
        </div>
      </div>
    </div>
  );
}
