import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import ChatBox from "../../components/ChatBox";
import VideoCall from "../../components/VideoCall";
import axiosInstance from "../../utils/axiosInstance";

export default function Chats() {
  const { user, loading, setTotalUnread } = useContext(AuthContext);

  const [interests, setInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const [activeSocket, setActiveSocket] = useState(null);

  /* -------------------------------
     LOAD CHAT LIST (WITH POLLING)
  -------------------------------- */
  const loadInterests = async () => {
    if (!user) return;

    const url =
      user.role === "broker"
        ? "/api/interests/broker/interests/"
        : "/api/interests/client/interests/";

    try {
        const res = await axiosInstance.get(url);
        setInterests(res.data);

        const totalUnread = res.data.reduce(
          (sum, i) => sum + (i.unread_count || 0),
          0
        );
        setTotalUnread(totalUnread);
    } catch (err) {
        console.error("Failed to load chat list:", err);
    }
  };

  useEffect(() => {
    if (!user || loading) return;

    loadInterests();
    const interval = setInterval(loadInterests, 5000);
    return () => clearInterval(interval);
  }, [user, loading]);

  /* -------------------------------
     SELECT CHAT
  -------------------------------- */
  const handleSelectChat = async (interest) => {
    setSelectedInterest(interest);
    setActiveSocket(null); // Clear socket when changing chats

    if (interest.unread_count > 0) {
      await axiosInstance.post(
        `/api/chat/interest/${interest.id}/read/`
      );

      setInterests((prev) =>
        prev.map((i) =>
          i.id === interest.id
            ? { ...i, unread_count: 0 }
            : i
        )
      );

      setTotalUnread((prev) =>
        Math.max(prev - interest.unread_count, 0)
      );
    }
  };

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[320px_1fr] bg-bg-page">
      {/* ================= LEFT PANEL ================= */}
      <aside className="bg-white border-r border-gray-100 flex flex-col items-stretch shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Messages
          </h2>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Your Negotiation Hub
          </p>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-100">
          {interests.length === 0 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center px-6 opacity-60">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl mb-4 flex items-center justify-center text-3xl shadow-sm">📭</div>
               <p className="text-sm font-medium text-gray-500">No active conversations</p>
               <p className="text-xs text-gray-400 mt-1">Start inquiring on properties to see them here.</p>
            </div>
          )}

          {interests.map((i) => {
            const active = selectedInterest?.id === i.id;

            return (
              <div
                key={i.id}
                onClick={() => handleSelectChat(i)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                  active
                    ? "bg-white border-brand-primary/20 shadow-lg shadow-brand-primary/5 ring-1 ring-brand-primary/10"
                    : "bg-transparent border-transparent hover:bg-gray-50 hover:border-gray-100"
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate transition-colors ${active ? "font-bold text-brand-primary" : "font-semibold text-gray-700 group-hover:text-gray-900"}`}>
                      {i.property}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider truncate">
                       {i.broker_name ? <span className="text-brand-accent">Broker: {i.broker_name}</span> : "Property Asset"}
                    </p>
                  </div>
                  
                  {i.unread_count > 0 && (
                    <span className="flex-shrink-0 min-w-[20px] h-[20px] text-[10px] font-bold bg-brand-accent text-white rounded-full flex items-center justify-center shadow-md shadow-brand-accent/20">
                      {i.unread_count}
                    </span>
                  )}
                </div>

                {active && <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-primary rounded-r-full" />}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ================= RIGHT PANEL ================= */}
      <main className="flex flex-col relative bg-white">
        {!selectedInterest && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <div className="text-5xl mb-4 text-gray-200">💬</div>
            <p className="text-sm font-medium">
              Select a conversation to start chatting
            </p>
          </div>
        )}

        {selectedInterest && (
          <>
            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-300">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  {selectedInterest.property}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                    Live Channel
                  </span>
                  {selectedInterest.broker_name && (
                     <>
                        <span className="text-gray-300 mx-1">•</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                           Broker: {selectedInterest.broker_name}
                        </span>
                     </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowVideo(true)}
                className="group flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black hover:shadow-lg hover:shadow-black/20 transition-all active:scale-95"
              >
                <span className="text-base group-hover:scale-110 transition-transform duration-300">📹</span> 
                <span>Video Call</span>
              </button>
            </div>

            {/* VIDEO CALL OVERLAY */}
            {showVideo && activeSocket && (
              <div className="absolute top-20 left-0 right-0 z-20 px-6">
                <VideoCall
                  socket={activeSocket}
                  currentUser={user.username}
                  onClose={() => setShowVideo(false)}
                />
              </div>
            )}

            {/* CHAT BOX */}
            <div
              className={`flex-1 ${
                showVideo ? "mt-[280px]" : ""
              }`}
            >
              <ChatBox
                interestId={selectedInterest.id}
                onSocketReady={(s) => setActiveSocket(s)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}