import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import { Bot, Send, X, Sparkles, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Client } from '@gradio/client';

const HF_SPACE = "codevigo/VisualizerAI-App";

/* ══════════════════════════════════════════════════════════
   SAFE STRING CONVERTER — যেকোনো value কে string এ রূপান্তর
   এটাই React crash এর মূল fix
══════════════════════════════════════════════════════════ */
function toSafeString(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    /* ["user_text", "bot_text"] format */
    if (val.length === 2 && typeof val[1] === "string") return val[1];
    return val.map(toSafeString).filter(Boolean).join("\n");
  }
  if (typeof val === "object") {
    /* {role:"assistant", content:"..."} */
    if (val.content) return String(val.content);
    if (val.text)    return String(val.text);
    if (val.message) return String(val.message);
    /* Last resort */
    try { return JSON.stringify(val); } catch { return "[object]"; }
  }
  return String(val);
}

/* ── Gradio response parser ── */
function parseGradioResponse(data, userText) {
  try {
    if (!Array.isArray(data) || data.length === 0)
      return { reply: "⚠️ উত্তর পেলাম না।", history: [] };

    console.log("data[0]:", data[0], "data[1]:", data[1]); // debug

    // data[1] = history array (most common Gradio pattern)
    const second = data[1];

    if (Array.isArray(second) && second.length > 0) {
      // New Gradio: [{role:"user",content:""}, {role:"assistant",content:""}]
      const last = second[second.length - 1];

      let reply = "";

      if (last?.role === "assistant") {
        // content can be string OR {text:"..."} OR [{type:"text",text:"..."}]
        const c = last.content;
        if (typeof c === "string") reply = c;
        else if (typeof c === "object" && c !== null) {
          if (Array.isArray(c)) {
            reply = c.map(x => x?.text || x?.value || "").join("");
          } else {
            reply = c.text || c.value || c.message || JSON.stringify(c);
          }
        }
      }

      // Fallback: [user_text, bot_text] tuple format
      if (!reply && Array.isArray(last) && last.length === 2) {
        reply = toSafeString(last[1]);
      }

      if (reply) return { reply: String(reply), history: second };
    }

    // data[0] fallback
    if (data[0]) return { reply: toSafeString(data[0]), history: [] };

    return { reply: "⚠️ উত্তর পেলাম না। আবার চেষ্টা করুন।", history: [] };

  } catch (err) {
    console.error("parseGradioResponse error:", err);
    return { reply: "⚠️ Response parse করতে সমস্যা হয়েছে।", history: [] };
  }
}

/* ══════════════════════════════════════════════════════════
   CHATBOT
══════════════════════════════════════════════════════════ */
const ChatBot = ({ isOpen, onClose, activeAlgo }) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "আমি VisualizerAI! 🚀\n\nSorting, Searching, DS, Tree/Graph, LeetCode, C/C++ — সব বিষয়ে সাহায্য করব। কী জানতে চাও?"
  }]);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [client,        setClient]        = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError,   setClientError]   = useState("");

  const historyRef = useRef([]);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  /* ── Connect Gradio ── */
  useEffect(() => {
    if (!isOpen || client || clientLoading) return;
    let cancelled = false;
    const load = async () => {
      setClientLoading(true);
      setClientError("");
      try {
        const c = await Client.connect(HF_SPACE);
        if (!cancelled) setClient(c);
      } catch (err) {
        console.error("Gradio connect:", err);
        if (!cancelled)
          setClientError("❌ AI Space connect হয়নি। Sleep mode এ থাকতে পারে।");
      } finally {
        if (!cancelled) setClientLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  /* ── Safe add message ── */
  const addMsg = (role, text) => {
    /* Ensure text is always a string before setting state */
    const safeText = toSafeString(text) || "(empty response)";
    setMessages(p => [...p, { role, text: safeText }]);
  };

  /* ── Send ── */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    addMsg("user", text);
    setInput("");
    setLoading(true);

    if (!client) {
      addMsg("assistant",
        clientLoading ? "⏳ AI লোড হচ্ছে, একটু অপেক্ষা করুন..." :
        clientError   ? clientError :
                        "❌ AI connect হয়নি। Page refresh করুন।"
      );
      setLoading(false);
      return;
    }

    const contextMsg = activeAlgo
      ? `[Viewing: ${activeAlgo} in Algorithm Visualizer]\n\n${text}`
      : text;

    try {
      const result = await client.predict("/answer_question", {
        message: contextMsg,
        history: historyRef.current,
      });

      console.log("Raw Gradio data:", result?.data); // debug — keep for now

      const { reply, history } = parseGradioResponse(result?.data, text);

      /* Update history ref */
      if (history.length > 0) historyRef.current = history;
      else historyRef.current = [
        ...historyRef.current,
        { role: "user",      content: text  },
        { role: "assistant", content: reply },
      ];

      addMsg("assistant", reply);

    } catch (err) {
      console.error("Gradio predict:", err);
      const msg = err?.message || "";
      if (msg.includes("503") || msg.includes("sleep") || msg.includes("unavailable")) {
        addMsg("assistant", "😴 Space টি sleep mode এ ছিল। ৩০ সেকেন্ড পরে আবার try করুন।");
      } else if (msg.includes("abort") || msg.includes("AbortError")) {
        addMsg("assistant", "⏱️ Request timeout হয়েছে। আবার চেষ্টা করুন।");
      } else {
        addMsg("assistant", `❌ Error: ${msg || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{ role: "assistant", text: "Chat clear হয়েছে! আবার জিজ্ঞেস করো। 😊" }]);
  };

  const SUGGESTIONS = [
    "Bubble Sort কীভাবে কাজ করে?",
    "Binary Search explain করো",
    "Stack vs Queue পার্থক্য?",
    "BFS vs DFS কখন কোনটা?",
    "C pointer কী?",
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-6 z-[100] flex flex-col rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden"
      style={{ width:"370px", bottom:"88px", maxHeight:"calc(100vh - 110px)", height:"520px", background:"#0b0e17" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800 bg-[#0f1320]">
        <div className="relative">
          <div className="p-1.5 bg-emerald-500/15 rounded-xl border border-emerald-500/25">
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f1320] ${
            client        ? "bg-green-400" :
            clientLoading ? "bg-amber-400 animate-pulse" :
                            "bg-red-400"
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-none flex items-center gap-2">
            VisualizerAI
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
              client        ? "bg-green-900/40 text-green-400"  :
              clientLoading ? "bg-amber-900/40 text-amber-400" :
                              "bg-red-900/40 text-red-400"
            }`}>
              {client ? "Online" : clientLoading ? "Connecting…" : "Offline"}
            </span>
          </p>
          <p className="text-[10px] text-emerald-400 mt-0.5 truncate">
            {activeAlgo ? `📍 ${activeAlgo}` : "Algorithm & CS Tutor"}
          </p>
        </div>
        <button onClick={clearChat} title="Clear chat"
          className="text-slate-600 hover:text-slate-300 transition p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0">
          <Trash2 size={14} />
        </button>
        <button onClick={onClose}
          className="text-slate-600 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth:"thin" }}>

        {clientLoading && (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-3 py-2.5 text-[11px] text-amber-400 flex items-center gap-2">
            <span className="animate-spin">⚙️</span>
            AI Space connect হচ্ছে…
          </div>
        )}

        {clientError && !client && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl px-3 py-2.5 text-[11px] text-red-400">
            {clientError}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-emerald-400" />
              </div>
            )}
            {/* ✅ text is always a string — no crash */}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-blue-600/80 text-white rounded-br-sm"
                : "bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-bl-sm"
            }`}>
              {String(m.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0">
              <Bot size={13} className="text-emerald-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0,1,2].map(j => (
                <span key={j} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay:`${j*0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Suggestion chips ── */}
      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
          {SUGGESTIONS.map((s, i) => (
            <button key={i}
              onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-[11px] bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-xl transition">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className="px-4 py-3 border-t border-slate-800 bg-[#0f1320] flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={client ? "Algorithm সম্পর্কে জিজ্ঞেস করুন…" : "AI connecting…"}
          disabled={!client || loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 transition disabled:opacity-50"
        />
        <button onClick={sendMessage}
          disabled={loading || !input.trim() || !client}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 p-2.5 rounded-xl transition active:scale-95 flex-shrink-0">
          <Send size={15} className="text-white" />
        </button>
      </div>

      <div className="px-4 pb-2.5 text-center">
        <p className="text-[9px] text-slate-700">
          Powered by <span className="text-emerald-700">codevigo/VisualizerAI</span> · Hugging Face
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════════════ */
const Layout = () => {
  const [selectedAlgo,       setSelectedAlgo]       = useState("");
  const [selectedPathAlgo,   setSelectedPathAlgo]   = useState("");
  const [selectedGraphAlgo,  setSelectedGraphAlgo]  = useState("");
  const [selectedSearchAlgo, setSelectedSearchAlgo] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const { isDark } = useTheme();
  const activeAlgo = selectedAlgo || selectedPathAlgo || selectedGraphAlgo || selectedSearchAlgo;
  const location   = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <Header
        selectedAlgo={selectedAlgo}              setSelectedAlgo={setSelectedAlgo}
        selectedPathAlgo={selectedPathAlgo}      setSelectedPathAlgo={setSelectedPathAlgo}
        selectedGraphAlgo={selectedGraphAlgo}    setSelectedGraphAlgo={setSelectedGraphAlgo}
        selectedSearchAlgo={selectedSearchAlgo}  setSelectedSearchAlgo={setSelectedSearchAlgo}
        showCode={showCode}                      setShowCode={setShowCode}
        showChat={showChat}                      setShowChat={setShowChat}
      />

      <main className="flex-grow">
        <Outlet context={{
          selectedAlgo,       setSelectedAlgo,
          selectedPathAlgo,   setSelectedPathAlgo,
          selectedGraphAlgo,  setSelectedGraphAlgo,
          selectedSearchAlgo, setSelectedSearchAlgo,
          showCode,           setShowCode,
        }} />
      </main>

      <Footer />

      <ChatBot
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        activeAlgo={activeAlgo || location.pathname.replace("/", "")}
      />

      {/* Floating button */}
      <button
        onClick={() => setShowChat(p => !p)}
        className={`fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          showChat
            ? "bg-[#0f1320] border border-slate-600 text-slate-400"
            : "bg-[#0f1320] border border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
        }`}
        title="VisualizerAI"
        style={{ boxShadow: showChat
          ? "0 8px 32px rgba(0,0,0,0.5)"
          : "0 0 24px rgba(16,185,129,0.25), 0 8px 32px rgba(0,0,0,0.5)"
        }}
      >
        {showChat ? <X size={20} /> : <Bot size={22} />}
        {!showChat && (
          <span className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-ping opacity-30 pointer-events-none" />
        )}
      </button>
    </div>
  );
};

export default Layout;


// Thi code for only used when don't work personal AI chat bot then active Groq API AI 
// import React, { useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import Header from './header';
// import Footer from './Footer';
// import { Bot, Send, X, Sparkles } from 'lucide-react';
// import { useTheme } from './ThemeContext'; // ✅ import

// const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// /* ══════════════════════════════════════════════════════════
//    GLOBAL CHATBOT
// ══════════════════════════════════════════════════════════ */
// const ChatBot = ({ isOpen, onClose, activeAlgo }) => {
//   const [messages, setMessages] = useState([{
//     role: "assistant",
//     text: "আমি Visualizer Assistant! Sorting, Searching, DS, Tree/Graph, LeetCode, C/C++ Roadmap সম্পর্কে যেকোনো প্রশ্ন করুন। 🚀"
//   }]);
//   const [input, setInput]     = useState("");
//   const [loading, setLoading] = useState(false);
//   const bottomRef = React.useRef(null);

//   React.useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const systemPrompt = `You are an expert algorithm, data structures and programming tutor inside an Algorithm Visualizer web app.
// Topics: Sorting (Bubble, Quick, Insertion, Selection, Merge), Searching (Linear, Binary, Jump, Fibonacci, Interpolation), Data Structures (Stack, Queue, Linked List, DLL), Tree/Graph (BFS, DFS), LeetCode problems, C Programming, C++ Programming.
// ${activeAlgo ? `User is currently viewing: ${activeAlgo}.` : ""}
// Answer clearly, under 200 words unless asked for detail. If user writes Bengali, reply in Bengali.`;

//   const sendMessage = async () => {
//     const text = input.trim();
//     if (!text || loading) return;
//     const userMsg = { role: "user", text };
//     setMessages(p => [...p, userMsg]);
//     setInput("");
//     setLoading(true);
//     try {
//       const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
//         body: JSON.stringify({
//           model: "llama-3.3-70b-versatile",
//           messages: [
//             { role: "system", content: systemPrompt },
//             ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
//             { role: "user", content: text }
//           ],
//           max_tokens: 512, temperature: 0.7,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setMessages(p => [...p, { role: "assistant", text: `❌ API Error: ${data?.error?.message}` }]); return; }
//       setMessages(p => [...p, { role: "assistant", text: data?.choices?.[0]?.message?.content || "⚠️ কোনো উত্তর পেলাম না।" }]);
//     } catch (err) {
//       setMessages(p => [...p, { role: "assistant", text: "❌ Network error: " + err.message }]);
//     } finally { setLoading(false); }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed right-6 z-[100] flex flex-col rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden"
//       style={{ width: "360px", bottom: "88px", maxHeight: "calc(100vh - 110px)", height: "500px", background: "#0b0e17" }}>
//       <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-[#0f1320]">
//         <div className="p-1.5 bg-emerald-500/15 rounded-xl border border-emerald-500/25">
//           <Sparkles size={16} className="text-emerald-400" />
//         </div>
//         <div className="flex-1">
//           <p className="text-sm font-bold text-white leading-none">Visualizer AI</p>
//           <p className="text-[10px] text-emerald-400 mt-0.5">
//             {activeAlgo ? `Viewing: ${activeAlgo}` : "Ask me anything"}
//           </p>
//         </div>
//         <button onClick={onClose} className="text-slate-600 hover:text-white transition p-1"><X size={16} /></button>
//       </div>

//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
//         {messages.map((m, i) => (
//           <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
//             {m.role === "assistant" && (
//               <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
//                 <Bot size={12} className="text-emerald-400" />
//               </div>
//             )}
//             <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words ${
//               m.role === "user"
//                 ? "bg-blue-600/80 text-white rounded-br-sm"
//                 : "bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-bl-sm"
//             }`}>{m.text}</div>
//           </div>
//         ))}
//         {loading && (
//           <div className="flex justify-start">
//             <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
//               <Bot size={12} className="text-emerald-400" />
//             </div>
//             <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl px-4 py-3 flex items-center gap-1.5">
//               {[0, 1, 2].map(i => (
//                 <span key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
//                   style={{ animationDelay: `${i * 0.15}s` }} />
//               ))}
//             </div>
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       <div className="px-4 py-3 border-t border-slate-800 bg-[#0f1320] flex gap-2">
//         <input
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
//           placeholder="Algorithm সম্পর্কে জিজ্ঞেস করুন…"
//           className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 transition"
//         />
//         <button onClick={sendMessage} disabled={loading || !input.trim()}
//           className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 p-2.5 rounded-xl transition active:scale-95">
//           <Send size={15} className="text-white" />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════
//    LAYOUT
// ══════════════════════════════════════════════════════════ */
// const Layout = () => {
//   const [selectedAlgo,       setSelectedAlgo]       = useState("");
//   const [selectedPathAlgo,   setSelectedPathAlgo]   = useState("");
//   const [selectedGraphAlgo,  setSelectedGraphAlgo]  = useState("");
//   const [selectedSearchAlgo, setSelectedSearchAlgo] = useState("");
//   const [showCode,  setShowCode]  = useState(false);
//   const [showChat,  setShowChat]  = useState(false);

//   const { isDark } = useTheme(); // ✅ theme state নাও

//   const activeAlgo = selectedAlgo || selectedPathAlgo || selectedGraphAlgo || selectedSearchAlgo;
//   const location = useLocation();

//   return (
//     // ✅ isDark এর উপর ভিত্তি করে 'dark' class যোগ/সরানো হচ্ছে
//     <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
//       <Header
//         selectedAlgo={selectedAlgo}              setSelectedAlgo={setSelectedAlgo}
//         selectedPathAlgo={selectedPathAlgo}      setSelectedPathAlgo={setSelectedPathAlgo}
//         selectedGraphAlgo={selectedGraphAlgo}    setSelectedGraphAlgo={setSelectedGraphAlgo}
//         selectedSearchAlgo={selectedSearchAlgo}  setSelectedSearchAlgo={setSelectedSearchAlgo}
//         showCode={showCode}                      setShowCode={setShowCode}
//         showChat={showChat}                      setShowChat={setShowChat}
//       />

//       <main className="flex-grow">
//         <Outlet context={{
//           selectedAlgo,       setSelectedAlgo,
//           selectedPathAlgo,   setSelectedPathAlgo,
//           selectedGraphAlgo,  setSelectedGraphAlgo,
//           selectedSearchAlgo, setSelectedSearchAlgo,
//           showCode,           setShowCode,
//         }} />
//       </main>

//       <Footer />

//       <ChatBot
//         isOpen={showChat}
//         onClose={() => setShowChat(false)}
//         activeAlgo={activeAlgo || location.pathname.replace("/", "")}
//       />

//       <button
//         onClick={() => setShowChat(prev => !prev)}
//         className={`fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90
//           ${showChat
//             ? "bg-[#0f1320] border border-slate-600 text-slate-400"
//             : "bg-[#0f1320] border border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
//           }`}
//         title="AI Assistant"
//         style={{ boxShadow: showChat ? "0 8px 32px rgba(0,0,0,0.5)" : "0 0 24px rgba(16,185,129,0.25), 0 8px 32px rgba(0,0,0,0.5)" }}
//       >
//         {showChat ? <X size={20} /> : <Bot size={22} />}
//         {!showChat && (
//           <span className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-ping opacity-30 pointer-events-none" />
//         )}
//       </button>
//     </div>
//   );
// };

// export default Layout;