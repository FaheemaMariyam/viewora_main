import { useEffect, useRef, useState } from "react";

export default function VideoCall({ socket, onClose }) {
  const pcRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingIceRef = useRef([]);
  const ringingIntervalRef = useRef(null);

  const [started, setStarted] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [isCaller, setIsCaller] = useState(false);

  // Toggle States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  /* ---------------- SAFE SEND ---------------- */
  const safeSend = (payload) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  };

  /* ---------------- WAIT FOR SOCKET ---------------- */
  const waitForSocket = () =>
    new Promise((resolve) => {
      if (!socket) return;

      if (socket.readyState === WebSocket.OPEN) return resolve();

      const check = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });

  /* ---------------- CREATE PEER CONNECTION ---------------- */
  const createPC = () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        safeSend({ type: "ice", data: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current && e.streams[0]) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pcRef.current = pc;
    return pc;
  };

  /* ---------------- PREPARE MEDIA ---------------- */
  const prepareMedia = async () => {
    if (localStreamRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      // Sync initial state with track status
      setIsMuted(!stream.getAudioTracks()[0]?.enabled);
      setIsVideoOff(!stream.getVideoTracks()[0]?.enabled);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      /* If a call is already established/reconnecting, add tracks */
      if (pcRef.current) {
         const pc = pcRef.current;
         const senders = pc.getSenders();
         stream.getTracks().forEach((track) => {
            if (!senders.find((s) => s.track === track)) {
              pc.addTrack(track, stream);
            }
         });
      }

    } catch (err) {
      console.error("Error accessing media devices:", err);
      // Handle permission errors gracefully here if needed
    }
  };

  /* ---------------- TOGGLE CONTROLS ---------------- */
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  /* ---------------- START CALL ---------------- */
  const startCall = async () => {
    if (ringingIntervalRef.current) return; // 🚫 already ringing

    await waitForSocket();
    setIsCaller(true);
    await prepareMedia();

    // Add tracks to PC if not already done in prepareMedia (for safety)
    const pc = createPC();
    if (localStreamRef.current) {
       localStreamRef.current.getTracks().forEach(track => {
         pc.addTrack(track, localStreamRef.current);
       });
    }

    safeSend({ type: "call_request" });

    ringingIntervalRef.current = setInterval(() => {
      safeSend({ type: "call_request" });
    }, 2000);
  };

  /* ---------------- ACCEPT CALL ---------------- */
  const acceptCall = async () => {
    await waitForSocket();
    setIncoming(false);
    setIsCaller(false);
    await prepareMedia();
    safeSend({ type: "call_accept" });
  };

  /* ---------------- SOCKET HANDLER ---------------- */
  useEffect(() => {
    if (!socket) return;

    const handler = async (e) => {
      const msg = JSON.parse(e.data);

      if (msg.type === "call_request") {
        setIncoming(true);
      }

      if (msg.type === "call_accept" && isCaller && !started) {
        if (ringingIntervalRef.current) {
          clearInterval(ringingIntervalRef.current);
          ringingIntervalRef.current = null;
        }
        
        await prepareMedia();
        const pc = createPC();
        
        // Add tracks before offer
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                // Check if already added to avoid duplication error (though addTrack usually assumes new sender)
                if(!pc.getSenders().find(s => s.track === track)) {
                   pc.addTrack(track, localStreamRef.current);
                }
            });
        }

        const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });
        await pc.setLocalDescription(offer);

        safeSend({ type: "offer", data: offer });
        setStarted(true);
      }

      if (msg.type === "offer") {
        await prepareMedia();
        const pc = createPC();

        await pc.setRemoteDescription(msg.data);

        // Add tracks before answer
         if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                if(!pc.getSenders().find(s => s.track === track)) {
                   pc.addTrack(track, localStreamRef.current);
                }
            });
        }

        // Flush ICE
        pendingIceRef.current.forEach((c) =>
          pc.addIceCandidate(c)
        );
        pendingIceRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        safeSend({ type: "answer", data: answer });
        setStarted(true);
      }

      if (msg.type === "answer") {
        const pc = pcRef.current;
        if (!pc) return;

        await pc.setRemoteDescription(msg.data);

        // Flush ICE
        pendingIceRef.current.forEach((c) =>
          pc.addIceCandidate(c)
        );
        pendingIceRef.current = [];
      }

      if (msg.type === "ice" && msg.data) {
        const pc = createPC();
        if (pc.remoteDescription) {
          await pc.addIceCandidate(msg.data);
        } else {
          pendingIceRef.current.push(msg.data);
        }
      }

      if (msg.type === "call_end") {
        endCall(false);
      }
    };

    socket.addEventListener("message", handler);
    return () => socket.removeEventListener("message", handler);
  }, [socket, isCaller, started]);

  /* ---------------- RE-ATTACH LOCAL VIDEO AFTER UI RENDER ---------------- */
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [started, isVideoOff]); // Trigger re-attach if video state toggles (though stream tracks handle the visuals)

  /* ---------------- END CALL ---------------- */
  const endCall = (notify = true) => {
    if (ringingIntervalRef.current) {
      clearInterval(ringingIntervalRef.current);
      ringingIntervalRef.current = null;
    }

    if (notify) safeSend({ type: "call_end" });

    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    pendingIceRef.current = [];

    setStarted(false);
    setIncoming(false);
    setIsCaller(false);
    setIsMuted(false);
    setIsVideoOff(false);

    onClose();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center overscroll-none overflow-hidden">
      
      {/* REMOTE VIDEO (FULL SCREEN) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
          started ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* LOCAL VIDEO (FLOATING PIP) */}
      {/* Show only if started and video is On. If off, maybe show avatar placeholder */}
      <div 
        className={`
          absolute bottom-28 right-4 md:right-8 lg:right-12
          w-32 h-44 md:w-48 md:h-64 
          rounded-2xl border border-white/10 shadow-2xl bg-gray-900/50 backdrop-blur-sm overflow-hidden
          transition-all duration-300 ease-in-out
          ${started ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}
        `}
      >
         <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`}
          />
          {isVideoOff && (
             <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white/30">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3l18 18" />
                </svg>
             </div>
          )}
          
          {/* Mute Indicator on PIP */}
          {isMuted && (
            <div className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded-full">
               <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
               </svg>
            </div>
          )}
      </div>

      {/* INCOMING CALL OVERLAY */}
      {incoming && !started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 bg-black/40 backdrop-blur-xl">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 animate-ping">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
             </svg>
          </div>
          <p className="text-3xl font-bold mb-8 tracking-tight">Incoming Call...</p>
          <button
            onClick={acceptCall}
            className="bg-green-600 hover:bg-green-500 px-12 py-4 rounded-full text-white text-lg font-bold shadow-xl transition-all transform hover:scale-105 flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Accept Call
          </button>
        </div>
      )}

      {/* START CALL BUTTON (Only if not started and not incoming) */}
      {!started && !incoming && (
        <button
          onClick={startCall}
          className="bg-brand-accent hover:bg-blue-600 px-10 py-4 rounded-full text-white text-lg font-bold shadow-xl transition-all transform hover:scale-105 flex items-center gap-3 z-50"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Start Video Call
        </button>
      )}

      {/* CALL CONTROLS BAR */}
      {started && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-6 px-8 py-4 bg-gray-900/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
            
            {/* MIC TOGGLE */}
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isMuted 
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
               {isMuted ? (
                 /* Muted Icon */
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                 </svg>
               ) : (
                 /* Unmuted Icon */
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                 </svg>
               )}
            </button>

            {/* END CALL */}
            <button
              onClick={() => endCall(true)}
              className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg scale-110 hover:scale-125"
            >
              <svg className="w-8 h-8 rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>

            {/* CAMERA TOGGLE */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoOff
                  ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
                {isVideoOff ? (
                  /* Camera Off Icon */
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  /* Camera On Icon */
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
