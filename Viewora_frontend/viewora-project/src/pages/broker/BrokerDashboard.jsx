
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { closeInterest } from "../../api/brokerApi";
import {
  getAvailableInterests,
  getAssignedInterests,
  acceptInterest,
} from "../../api/brokerApi";

import ChatBox from "../../components/ChatBox";
import { startInterest } from "../../api/brokerApi";
import { User as UserIcon, LayoutDashboard, Search, Bell, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { DealCard } from "./DealCard";

export default function BrokerDashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [availableInterests, setAvailableInterests] = useState([]);
  const [assignedInterests, setAssignedInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  
  // 'requests' | 'clients'
  const [activeTab, setActiveTab] = useState("requests");
  const [fetching, setFetching] = useState(true);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "broker") {
      navigate("/");
      return;
    }
    fetchAll();
  }, [user, loading]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchAll = async () => {
    try {
      setFetching(true);
      const [availableRes, assignedRes] = await Promise.all([
        getAvailableInterests(),
        getAssignedInterests(),
      ]);
      setAvailableInterests(availableRes.data);
      setAssignedInterests(assignedRes.data);
    } catch (err) {
      console.error("Failed to load broker data", err);
    } finally {
      setFetching(false);
    }
  };

  /* ---------------- ACCEPT INTEREST ---------------- */
  const handleAccept = async (interestId, e) => {
    e.stopPropagation();
    try {
      await acceptInterest(interestId);
      setAvailableInterests((prev) => prev.filter((i) => i.id !== interestId));
      const res = await getAssignedInterests();
      setAssignedInterests(res.data);
      setActiveTab("clients");
    } catch (err) {
      alert("Failed to accept interest");
    }
  };

  /* ---------------- SELECT INTEREST ---------------- */
  const handleSelectInterest = async (interest) => {
    setSelectedInterest(interest);

    if (activeTab === "clients" && interest.status === "assigned") {
      try {
        await startInterest(interest.id);
        const updated = { ...interest, status: "in_progress" };
        setAssignedInterests((prev) =>
          prev.map((i) => (i.id === interest.id ? updated : i))
        );
        setSelectedInterest(updated);
      } catch (err) {
        console.error("Failed to start interest", err);
      }
    }
  };

  /* ---------------- RENDER SIDEBAR LIST ---------------- */
  const renderList = () => {
    const list = activeTab === "requests" ? availableInterests : assignedInterests;

    if (fetching) return (
      <div className="p-8 flex flex-col items-center justify-center space-y-3 opacity-50">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Assets...</span>
      </div>
    );

    if (list.length === 0) {
      return (
        <div className="p-12 text-center flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <span className="text-2xl opacity-20">📭</span>
          </div>
          <p className="text-sm font-bold text-gray-400">No {activeTab === "requests" ? "Active Inquiries" : "Client Portfolios"}</p>
          <p className="text-[10px] text-gray-300 mt-1 max-w-[150px]">
            {activeTab === "requests" ? "New leads will appear here automatically." : "Accept a request to start a deal."}
          </p>
        </div>
      );
    }

    return (
      <div className="px-4 py-2 space-y-1">
        {list.map((interest) => (
          <DealCard
            key={interest.id}
            interest={interest}
            type={activeTab}
            isSelected={selectedInterest?.id === interest.id}
            onClick={() => handleSelectInterest(interest)}
            onAccept={handleAccept}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row max-w-[1600px] mx-auto h-[100vh] overflow-hidden font-sans">
      
      {/* ---------------- SIDEBAR ---------------- */}
      <div className="w-full md:w-[400px] flex flex-col bg-white border-r border-gray-100 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4 bg-white/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-black text-[#1A1A1A] tracking-tight flex items-center gap-2">
                <Briefcase size={20} className="text-brand-primary" />
                Deal Flow
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 ml-1">Transactions & Leads</p>
            </div>
            <button 
               onClick={() => navigate("/profile")}
               className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-all border border-gray-100 hover:border-gray-200"
               title="Broker Profile"
             >
               <UserIcon size={18} />
             </button>
          </div>

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-gray-100/50 rounded-xl border border-gray-100">
            <button
              onClick={() => { setActiveTab("requests"); setSelectedInterest(null); }}
              className={`
                flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 relative
                ${activeTab === "requests" 
                  ? "bg-white text-brand-primary shadow-sm hover:shadow-md" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"}
              `}
            >
              Inquiries
              {availableInterests.length > 0 && (
                <span className="ml-2 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full shadow-sm">
                  {availableInterests.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => { setActiveTab("clients"); setSelectedInterest(null); }}
              className={`
                flex-1 py-2.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all duration-300 relative
                ${activeTab === "clients" 
                  ? "bg-white text-brand-primary shadow-sm hover:shadow-md" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"}
              `}
            >
              Active Deals
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
          {renderList()}
        </div>
        
        {/* Sidebar Footer */}
        <div className="p-4 bg-white border-t border-gray-100">
           <div className="flex items-center gap-4 px-2 py-1">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#333] text-white flex items-center justify-center text-sm font-black shadow-lg shadow-black/10">
               {user?.username?.charAt(0).toUpperCase()}
             </div>
             <div className="flex flex-col">
               <p className="text-xs font-bold text-[#1A1A1A]">{user?.username || "Broker"}</p>
               <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Secure Connection
               </span>
             </div>
           </div>
        </div>
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="hidden md:flex flex-1 flex-col bg-bg-surface relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[#F8F9FB] pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        </div>

        {selectedInterest ? (
          <div className="flex-1 flex flex-col relative z-10 h-full">
            {/* Context Header */}
            <div className="h-20 px-8 border-b border-gray-100/50 flex items-center justify-between bg-white/60 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-black text-[#1A1A1A] tracking-tight">{selectedInterest.property}</h2>
                  {selectedInterest.status && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200">
                      {selectedInterest.status.replace("_", " ")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-gray-400">Client:</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-gray-100 shadow-sm">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px] font-bold">
                      {selectedInterest.client.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{selectedInterest.client}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button
                   onClick={async () => {
                     const permission = await Notification.requestPermission();
                     console.log("Permission:", permission);
                   }}
                   className="w-10 h-10 rounded-xl hover:bg-white hover:shadow-md text-gray-400 hover:text-brand-primary transition-all flex items-center justify-center border border-transparent hover:border-gray-100"
                   title="Notifications"
                 >
                    <Bell size={18} />
                 </button>

                 {selectedInterest.status === "in_progress" && (
                   <button
                    onClick={async () => {
                      if (!window.confirm("Are you sure you want to close this deal?")) return;
                      await closeInterest(selectedInterest.id);
                      alert("Deal closed successfully");
                      setSelectedInterest(null);
                      fetchAll();
                    }}
                    className="
                      px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest
                      hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2
                    "
                   >
                     <CheckCircle2 size={14} />
                     Close Deal
                   </button>
                 )}
              </div>
            </div>

            {/* Workspace Area */}
            <div className="flex-1 overflow-hidden relative bg-white/40">
              {activeTab === "clients" ? (
                <div className="h-full flex flex-col">
                  <ChatBox interestId={selectedInterest.id} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-brand-primary/10 border border-gray-100 relative group">
                    <div className="absolute inset-0 bg-brand-primary/5 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all" />
                    <Building2 size={40} className="text-brand-primary relative z-10" strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-[#1A1A1A] tracking-tight mb-3">Incoming Deal Request</h3>
                  
                  <div className="max-w-md p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
                     <p className="text-gray-500 text-sm leading-relaxed">
                      <span className="font-bold text-[#1A1A1A]">{selectedInterest.client}</span> has expressed strong interest in 
                      <span className="font-bold text-[#1A1A1A] block mt-1 text-lg">"{selectedInterest.property}"</span>
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleAccept(selectedInterest.id, e)}
                    className="
                      px-8 py-4 bg-[#1A1A1A] text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl 
                      hover:bg-black hover:scale-105 transition-all duration-300 shadow-2xl shadow-black/20
                      flex items-center gap-3
                    "
                  >
                    <CheckCircle2 size={18} />
                    Accept Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 p-8">
             <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-8 border border-gray-100 animate-pulse-slow">
               <LayoutDashboard size={48} className="text-gray-300" strokeWidth={1} />
             </div>
            <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tighter mb-4">Command Center</h1>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Select an active deal from the sidebar or review new incoming requests to begin your workflow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
