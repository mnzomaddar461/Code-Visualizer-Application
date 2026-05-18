import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import OnboardingTour from './OnboardingTour';
import { LanguageProvider } from './LanguageContext';
import { Bot, Send, X, Sparkles, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Client } from '@gradio/client';

const HF_SPACE = "codevigo/VisualizerAI-App";
const STORAGE_KEY = "algoviz_tour_done";

function toSafeString(val) {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 2 && typeof val[1] === "string") return val[1];
    return val.map(toSafeString).filter(Boolean).join("\n");
  }
  if (typeof val === "object") {
    if (val.content) return String(val.content);
    if (val.text)    return String(val.text);
    if (val.message) return String(val.message);
    try { return JSON.stringify(val); } catch { return "[object]"; }
  }
  return String(val);
}

function parseGradioResponse(data, userText) {
  try {
    if (!Array.isArray(data) || data.length === 0)
      return { reply: "⚠️ উত্তর পেলাম না।", history: [] };

    const second = data[1];
    if (Array.isArray(second) && second.length > 0) {
      const last = second[second.length - 1];
      let reply = "";
      if (last?.role === "assistant") {
        const c = last.content;
        if (typeof c === "string") reply = c;
        else if (typeof c === "object" && c !== null) {
          if (Array.isArray(c)) reply = c.map(x => x?.text || x?.value || "").join("");
          else reply = c.text || c.value || c.message || JSON.stringify(c);
        }
      }
      if (!reply && Array.isArray(last) && last.length === 2) reply = toSafeString(last[1]);
      if (reply) return { reply: String(reply), history: second };
    }
    if (data[0]) return { reply: toSafeString(data[0]), history: [] };
    return { reply: "⚠️ উত্তর পেলাম না। আবার চেষ্টা করুন।", history: [] };
  } catch (err) {
    return { reply: "⚠️ Response parse করতে সমস্যা হয়েছে।", history: [] };
  }
}

/* ══ CHATBOT ══ */
const ChatBot = ({ isOpen, onClose, activeAlgo }) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "আমি VisualizerAI! 🚀\n\nSorting, Searching, DS, Tree/Graph, LeetCode, C/C++ — সব বিষয়ে সাহায্য করব। কী জানতে চাও?"
  }]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [client, setClient]             = useState(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [clientError, setClientError]   = useState("");

  const historyRef = useRef([]);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 150); }, [isOpen]);

  useEffect(() => {
    if (!isOpen || client || clientLoading) return;
    let cancelled = false;
    const load = async () => {
      setClientLoading(true); setClientError("");
      try {
        const c = await Client.connect(HF_SPACE);
        if (!cancelled) setClient(c);
      } catch (err) {
        if (!cancelled) setClientError("❌ AI Space connect হয়নি। Sleep mode এ থাকতে পারে।");
      } finally {
        if (!cancelled) setClientLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isOpen]);

  const addMsg = (role, text) => {
    const safeText = toSafeString(text) || "(empty response)";
    setMessages(p => [...p, { role, text: safeText }]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    addMsg("user", text);
    setInput("");
    setLoading(true);
    if (!client) {
      addMsg("assistant", clientLoading ? "⏳ AI লোড হচ্ছে..." : clientError || "❌ AI connect হয়নি।");
      setLoading(false); return;
    }
    const contextMsg = activeAlgo ? `[Viewing: ${activeAlgo}]\n\n${text}` : text;
    try {
      const result = await client.predict("/answer_question", { message: contextMsg, history: historyRef.current });
      const { reply, history } = parseGradioResponse(result?.data, text);
      if (history.length > 0) historyRef.current = history;
      else historyRef.current = [...historyRef.current,
        { role: "user", content: text }, { role: "assistant", content: reply }];
      addMsg("assistant", reply);
    } catch (err) {
      const msg = err?.message || "";
      if (msg.includes("503") || msg.includes("sleep"))
        addMsg("assistant", "😴 Space sleep mode এ। ৩০s পরে try করুন।");
      else if (msg.includes("abort"))
        addMsg("assistant", "⏱️ Request timeout। আবার চেষ্টা করুন।");
      else addMsg("assistant", `❌ Error: ${msg || "Unknown error"}`);
    } finally { setLoading(false); }
  };

  const clearChat = () => {
    historyRef.current = [];
    setMessages([{ role: "assistant", text: "Chat clear হয়েছে! আবার জিজ্ঞেস করো। 😊" }]);
  };

  const SUGGESTIONS = [
    "Bubble Sort কীভাবে কাজ করে?", "Binary Search explain করো",
    "Stack vs Queue পার্থক্য?",    "BFS vs DFS কখন কোনটা?", "C pointer কী?",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 z-[100] flex flex-col rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden"
      style={{ width:"370px", bottom:"88px", maxHeight:"calc(100vh - 110px)", height:"520px", background:"#0b0e17" }}>
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-800 bg-[#0f1320]">
        <div className="relative">
          <div className="p-1.5 bg-emerald-500/15 rounded-xl border border-emerald-500/25">
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f1320] ${
            client ? "bg-green-400" : clientLoading ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-none flex items-center gap-2">
            VisualizerAI
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
              client ? "bg-green-900/40 text-green-400" : clientLoading ? "bg-amber-900/40 text-amber-400" : "bg-red-900/40 text-red-400"}`}>
              {client ? "Online" : clientLoading ? "Connecting…" : "Offline"}
            </span>
          </p>
          <p className="text-[10px] text-emerald-400 mt-0.5 truncate">
            {activeAlgo ? `📍 ${activeAlgo}` : "Algorithm & CS Tutor"}
          </p>
        </div>
        <button onClick={clearChat} className="text-slate-600 hover:text-slate-300 transition p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0">
          <Trash2 size={14} />
        </button>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 flex-shrink-0">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth:"thin" }}>
        {clientLoading && (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl px-3 py-2.5 text-[11px] text-amber-400 flex items-center gap-2">
            <span className="animate-spin">⚙️</span> AI Space connect হচ্ছে…
          </div>
        )}
        {clientError && !client && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-xl px-3 py-2.5 text-[11px] text-red-400">{clientError}</div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                <Bot size={13} className="text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words whitespace-pre-wrap ${
              m.role === "user" ? "bg-blue-600/80 text-white rounded-br-sm" : "bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-bl-sm"}`}>
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
              {[0,1,2].map(j => <span key={j} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay:`${j*0.15}s` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-[11px] bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-xl transition">
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-3 border-t border-slate-800 bg-[#0f1320] flex gap-2">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder={client ? "Algorithm সম্পর্কে জিজ্ঞেস করুন…" : "AI connecting…"}
          disabled={!client || loading}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 transition disabled:opacity-50" />
        <button onClick={sendMessage} disabled={loading || !input.trim() || !client}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 p-2.5 rounded-xl transition active:scale-95 flex-shrink-0">
          <Send size={15} className="text-white" />
        </button>
      </div>
      <div className="px-4 pb-2.5 text-center">
        <p className="text-[9px] text-slate-700">Powered by <span className="text-emerald-700">codevigo/VisualizerAI</span> · Hugging Face</p>
      </div>
    </div>
  );
};

/* ══ INNER LAYOUT (LanguageProvider এর ভেতরে) ══ */
const LayoutInner = () => {
  const [selectedAlgo,       setSelectedAlgo]       = useState("");
  const [selectedPathAlgo,   setSelectedPathAlgo]   = useState("");
  const [selectedGraphAlgo,  setSelectedGraphAlgo]  = useState("");
  const [selectedSearchAlgo, setSelectedSearchAlgo] = useState("");
  const [showCode,  setShowCode]  = useState(false);
  const [showChat,  setShowChat]  = useState(false);
  const [showTour,  setShowTour]  = useState(false);

  const { isDark } = useTheme();
  const activeAlgo = selectedAlgo || selectedPathAlgo || selectedGraphAlgo || selectedSearchAlgo;
  const location   = useLocation();

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShowTour(true);
  }, []);

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

      {showTour && (
        <OnboardingTour onClose={() => setShowTour(false)} docUrl="/documentation" />
      )}

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

      <button onClick={() => setShowChat(p => !p)}
        className={`fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          showChat ? "bg-[#0f1320] border border-slate-600 text-slate-400"
                   : "bg-[#0f1320] border border-emerald-500/40 text-emerald-400 hover:border-emerald-400"}`}
        title="VisualizerAI"
        style={{ boxShadow: showChat ? "0 8px 32px rgba(0,0,0,0.5)" : "0 0 24px rgba(16,185,129,0.25), 0 8px 32px rgba(0,0,0,0.5)" }}>
        {showChat ? <X size={20} /> : <Bot size={22} />}
        {!showChat && <span className="absolute inset-0 rounded-2xl border border-emerald-500/30 animate-ping opacity-30 pointer-events-none" />}
      </button>
    </div>
  );
};

/* ══ LAYOUT — LanguageProvider দিয়ে wrap করা ══ */
// const Layout = () => (
//   <LanguageProvider>
//     <LayoutInner />
//   </LanguageProvider>
// );
const Layout = LayoutInner;
export default Layout;