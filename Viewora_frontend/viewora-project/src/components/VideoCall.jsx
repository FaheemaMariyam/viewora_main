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
  /* ---------------- CREATE PEER CONNECTION ---------------- */
  const createPC = () => {
    if (pcRef.current) return pcRef.current;

    console.log("Creating PeerConnection...");
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        // NOTE: For full production reliability on mobile, consider a paid TURN service.
        // Adding a public test TURN server (OpenRelay)
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443?transport=tcp",
          username: "openrelayproject",
          credential: "openrelayproject",
        }
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("New ICE Candidate gathered");
        safeSend({ type: "ice", data: e.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE Connection State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed") {
        console.error("ICE Connection failed. Check TURN/Network.");
      }
    };

    pc.ontrack = (e) => {
      console.log("Remote track received:", e.track.kind);
      if (remoteVideoRef.current) {
        if (e.streams && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
        } else {
          // Fallback for some mobile browsers
          if (!remoteVideoRef.current.srcObject) {
            remoteVideoRef.current.srcObject = new MediaStream([e.track]);
          } else {
            remoteVideoRef.current.srcObject.addTrack(e.track);
          }
        }
      }
    };

    pcRef.current = pc;
    return pc;
  };

  /* ---------------- PREPARE MEDIA ---------------- */
  const prepareMedia = async () => {
    if (localStreamRef.current) return;

    console.log("Requesting Media Access...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { max: 30 }
        },
        audio: true,
      });

      console.log("Media Access Granted");
      localStreamRef.current = stream;

      setIsMuted(!stream.getAudioTracks()[0]?.enabled);
      setIsVideoOff(!stream.getVideoTracks()[0]?.enabled);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      /* Attach tracks if PC already exists */
      if (pcRef.current) {
         const pc = pcRef.current;
         stream.getTracks().forEach((track) => {
            if (!pc.getSenders().find((s) => s.track === track)) {
              pc.addTrack(track, stream);
            }
         });
      }

    } catch (err) {
      console.error("Error accessing media devices:", err);
      // If it's NotReadableError, the camera is likely in use by another app (Chrome vs Edge)
      const errorMsg = err.name === 'NotReadableError' 
        ? "Camera is already in use by another application. Please close other browsers/apps using the camera." 
        : `Could not access camera/microphone (${err.name}). Please check permissions.`;
      
      alert(errorMsg);
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
    if (ringingIntervalRef.current) return;

    console.log("Starting call...");
    
    // 1. Request media IMMEDIATELY to preserve user gesture for Edge/Mobile
    await prepareMedia();
    if (!localStreamRef.current) return; // Stop if user denied or hardware failed

    await waitForSocket();
    setIsCaller(true);

    const pc = createPC();
    localStreamRef.current.getTracks().forEach(track => {
       if(!pc.getSenders().find(s => s.track === track)) {
         pc.addTrack(track, localStreamRef.current);
       }
    });

    safeSend({ type: "call_request" });

    ringingIntervalRef.current = setInterval(() => {
      safeSend({ type: "call_request" });
    }, 2000);

    // Add a 30-second timeout for the call
    setTimeout(() => {
      if (!started && ringingIntervalRef.current) {
        console.log("Call timed out - no response from recipient");
        alert("No response. The recipient might be offline.");
        endCall(true);
      }
    }, 30000);
  };

  /* ---------------- ACCEPT CALL ---------------- */
  const acceptCall = async () => {
    console.log("Accepting call...");
    
    // 1. Request media IMMEDIATELY to preserve user gesture
    await prepareMedia();
    if (!localStreamRef.current) return;

    await waitForSocket();
    setIncoming(false);
    setIsCaller(false);
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
        console.log("Call accepted by remote, sending offer...");
        if (ringingIntervalRef.current) {
          clearInterval(ringingIntervalRef.current);
          ringingIntervalRef.current = null;
        }
        
        const pc = createPC();
        await prepareMedia();
        
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
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
        console.log("Local description (offer) set");

        safeSend({ type: "offer", data: offer });
        setStarted(true);
      }

      if (msg.type === "offer") {
        console.log("Offer received, preparing answer...");
        await prepareMedia();
        const pc = createPC();

        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        console.log("Remote description (offer) set");

         if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                if(!pc.getSenders().find(s => s.track === track)) {
                   pc.addTrack(track, localStreamRef.current);
                }
            });
        }

        // Flush buffered ICE candidates
        while (pendingIceRef.current.length > 0) {
          const candidate = pendingIceRef.current.shift();
          try {
            await pc.addIceCandidate(candidate);
            console.log("Buffered ICE Candidate added");
          } catch(e) {
            console.warn("Failed to add buffered candidate", e);
          }
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Local description (answer) set");

        safeSend({ type: "answer", data: answer });
        setStarted(true);
      }

      if (msg.type === "answer") {
        console.log("Answer received");
        const pc = pcRef.current;
        if (!pc) return;

        await pc.setRemoteDescription(new RTCSessionDescription(msg.data));
        console.log("Remote description (answer) set");

        while (pendingIceRef.current.length > 0) {
          const candidate = pendingIceRef.current.shift();
          try {
             await pc.addIceCandidate(candidate);
             console.log("Buffered ICE Candidate added");
          } catch(e) {
             console.warn("Failed to add buffered candidate", e);
          }
        }
      }

      if (msg.type === "ice" && msg.data) {
        const pc = createPC();
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.data));
            console.log("ICE Candidate added immediately");
          } catch(e) {
             console.warn("Failed to add immediate candidate", e);
          }
        } else {
          pendingIceRef.current.push(msg.data);
          console.log("ICE Candidate buffered (remote description not ready)");
        }
      }

      if (msg.type === "call_end") {
        console.log("End call signal received");
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
