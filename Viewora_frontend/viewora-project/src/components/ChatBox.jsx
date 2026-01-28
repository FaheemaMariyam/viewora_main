import { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getChatHistory, markMessagesRead } from "../api/chatApi";

export default function ChatBox({ interestId, onSocketReady }) {
  const { user } = useContext(AuthContext);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  /* -------------------------------
     RESET ON CHAT CHANGE
  -------------------------------- */
  useEffect(() => {
    setMessages([]);
  }, [interestId]);

  /* -------------------------------
     LOAD CHAT HISTORY
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    getChatHistory(interestId).then((res) => setMessages(res.data));
  }, [interestId]);

  /* -------------------------------
     MARK MESSAGES AS READ
  -------------------------------- */
  useEffect(() => {
    if (!interestId) return;
    markMessagesRead(interestId);
  }, [interestId]);

  /* -------------------------------
     WEBSOCKET
  -------------------------------- */
  useEffect(() => {
    if (!interestId || !user) return;
    let socket;

    const connect = () => {
      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      socket = new WebSocket(
        `${protocol}://${window.location.hostname}:8000/ws/chat/interest/${interestId}/`
      );

      socketRef.current = socket;
      onSocketReady?.(socket);

      socket.onopen = () => setConnected(true);

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "chat_message") {
          setMessages((prev) => [...prev, data]);
        }

        if (data.type === "read_receipt") {
          setMessages((prev) =>
            prev.map((m) =>
              data.message_ids.includes(m.id)
                ? { ...m, is_read: true }
                : m
            )
          );
        }
      };

      socket.onclose = () => {
        setConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connect();
          }, 1500);
        }
      };

      socket.onerror = () => socket.close();
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      socket?.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, [interestId]);

  /* -------------------------------
     SEND MESSAGE
  -------------------------------- */
  const sendMessage = () => {
    if (!input.trim()) return;
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN)
      return;

    socketRef.current.send(
      JSON.stringify({ type: "message", message: input })
    );
    setInput("");
  };

  /* -------------------------------
     AUTO SCROLL
  -------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------------------
     UI
  -------------------------------- */
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-40 animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-gray-200 rounded-[2rem] flex items-center justify-center mb-6 text-4xl shadow-inner">
                ✨
             </div>
             <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
               Start the conversation
             </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender === user.username;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-5 py-3.5 shadow-sm relative group transition-all duration-300 hover:shadow-md ${
                  isMe
                    ? "bg-brand-primary text-white rounded-[1.25rem] rounded-tr-sm"
                    : "bg-white text-gray-800 border border-gray-100 rounded-[1.25rem] rounded-tl-sm"
                }`}
              >
                <div className="text-[13px] font-medium leading-relaxed whitespace-pre-wrap tracking-wide">
                  {msg.message}
                </div>

                <div
                  className={`mt-1.5 flex items-center justify-end gap-1.5 text-[9px] font-bold uppercase tracking-widest ${
                    isMe ? "text-white/50" : "text-gray-300"
                  }`}
                >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isMe && (
                    <span className={`ml-0.5 ${msg.is_read ? "text-emerald-400" : "text-white/40"}`}>
                      {msg.is_read ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-50 px-6 py-5">
        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-primary/5 focus-within:border-brand-primary/20 transition-all duration-300 shadow-sm">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              connected ? "Draft your message..." : "Connecting..."
            }
            className="flex-1 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-800 focus:outline-none placeholder:text-gray-400"
          />

          <button
            onClick={sendMessage}
            disabled={!connected}
            className={`p-3 rounded-full text-white transition-all duration-300 shadow-md ${
              connected && input.trim()
                ? "bg-brand-primary hover:bg-black hover:scale-105 active:scale-95 shadow-brand-primary/20"
                : "bg-gray-200 cursor-not-allowed text-gray-400 shadow-none"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}