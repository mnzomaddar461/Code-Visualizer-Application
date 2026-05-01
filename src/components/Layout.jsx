import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './header';
import Footer from './Footer';
import { Bot, Send, X, Sparkles } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/* ══════════════════════════════════════════════════════════
   GLOBAL CHATBOT — সব page এ দেখাবে
══════════════════════════════════════════════════════════ */
const ChatBot = ({ isOpen, onClose, activeAlgo }) => {
  const [messages, setMessages] = useState([{
    role: "assistant",
    text: "আমি Visualizer Assistant! Sorting, Searching, DS, Tree/Graph, LeetCode, C/C++ Roadmap সম্পর্কে যেকোনো প্রশ্ন করুন। 🚀"
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const systemPrompt = `You are an expert algorithm, data structures and programming tutor inside an Algorithm Visualizer web app.
Topics: Sorting (Bubble, Quick, Insertion, Selection, Merge), Searching (Linear, Binary, Jump, Fibonacci, Interpolation), Data Structures (Stack, Queue, Linked List, DLL), Tree/Graph (BFS, DFS), LeetCode problems, C Programming, C++ Programming.
${activeAlgo ? `User is currently viewing: ${activeAlgo}.` : ""}
Answer clearly, under 200 words unless asked for detail. If user writes Bengali, reply in Bengali.`;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: "user", text };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
            { role: "user", content: text }
          ],
          max_tokens: 512, temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setMessages(p => [...p, { role: "assistant", text: `❌ API Error: ${data?.error?.message}` }]); return; }
      setMessages(p => [...p, { role: "assistant", text: data?.choices?.[0]?.message?.content || "⚠️ কোনো উত্তর পেলাম না।" }]);
    } catch (err) {
      setMessages(p => [...p, { role: "assistant", text: "❌ Network error: " + err.message }]);
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 z-[100] flex flex-col rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden"
      style={{ width: "360px", bottom: "88px", maxHeight: "calc(100vh - 110px)", height: "500px", background: "#0b0e17" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-[#0f1320]">
        <div className="p-1.5 bg-emerald-500/15 rounded-xl border border-emerald-500/25">
          <Sparkles size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white leading-none">Visualizer AI</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">
            {activeAlgo ? `Viewing: ${activeAlgo}` : "Ask me anything"}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-600 hover:text-white transition p-1"><X size={16} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "thin" }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Bot size={12} className="text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words ${
              m.role === "user"
                ? "bg-blue-600/80 text-white rounded-br-sm"
                : "bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-bl-sm"
            }`}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
              <Bot size={12} className="text-emerald-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-800 bg-[#0f1320] flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Algorithm সম্পর্কে জিজ্ঞেস করুন…"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-[13px] text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/50 transition"
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 p-2.5 rounded-xl transition active:scale-95">
          <Send size={15} className="text-white" />
        </button>
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
  const [showCode,  setShowCode]  = useState(false);
  const [showChat,  setShowChat]  = useState(false);

  const activeAlgo = selectedAlgo || selectedPathAlgo || selectedGraphAlgo || selectedSearchAlgo;
  const location = useLocation();

  /* Resource page এ header algo state pass করা হয় না — শুধু Visualizer page এ */
  const isVisualizerPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 flex flex-col font-sans">
      <Header
        selectedAlgo={selectedAlgo}              setSelectedAlgo={setSelectedAlgo}
        selectedPathAlgo={selectedPathAlgo}      setSelectedPathAlgo={setSelectedPathAlgo}
        selectedGraphAlgo={selectedGraphAlgo}    setSelectedGraphAlgo={setSelectedGraphAlgo}
        selectedSearchAlgo={selectedSearchAlgo}  setSelectedSearchAlgo={setSelectedSearchAlgo}
        showCode={showCode}                      setShowCode={setShowCode}
        showChat={showChat}                      setShowChat={setShowChat}
      />

      {/* Page content */}
      <main className="flex-grow">
        <Outlet context={{
          selectedAlgo,       setSelectedAlgo,
          selectedPathAlgo,   setSelectedPathAlgo,
          selectedGraphAlgo,  setSelectedGraphAlgo,
          selectedSearchAlgo, setSelectedSearchAlgo,
          showCode,           setShowCode,
        }} />
      </main>

      {/* ── Single Footer ── */}
      <Footer />

      {/* ── Global Chatbot (সব page এ) ── */}
      <ChatBot
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        activeAlgo={activeAlgo || location.pathname.replace("/", "")}
      />

      {/* Floating chatbot button */}
      <button
        onClick={() => setShowChat(prev => !prev)}
        className={`fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90
          ${showChat
            ? "bg-[#0f1320] border border-slate-600 text-slate-400"
            : "bg-[#0f1320] border border-emerald-500/40 text-emerald-400 hover:border-emerald-400"
          }`}
        title="AI Assistant"
        style={{ boxShadow: showChat ? "0 8px 32px rgba(0,0,0,0.5)" : "0 0 24px rgba(16,185,129,0.25), 0 8px 32px rgba(0,0,0,0.5)" }}
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