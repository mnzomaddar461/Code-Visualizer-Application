import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, X, Check, Download } from "lucide-react";
import { useLang } from "./Languagecontext";

const STORAGE_KEY = "algoviz_tour_done";

/* ── Tour steps — বাংলা ও ইংরেজি দুটোই আছে ── */
const STEPS = [
  {
    selector: '[data-tour="sorting"]',
    icon: "📊",
    title:   { bn: "Sorting Visualizer",       en: "Sorting Visualizer" },
    route:   { bn: "Route: /",                 en: "Route: /" },
    desc:    { bn: "৫টি sorting algorithm live animation সহ দেখো। প্রতিটি compare ও swap real-time এ track হয়।",
               en: "Watch 5 sorting algorithms with live animation. Every compare & swap is tracked in real-time." },
    items: [
      { bn: "Bubble, Quick, Merge, Insertion, Selection Sort", en: "Bubble, Quick, Merge, Insertion, Selection Sort" },
      { bn: "Live bar animation + step log",                   en: "Live bar animation + step log" },
      { bn: "Compare & Swap counter live update",              en: "Compare & Swap counter live update" },
      { bn: "Custom array input + random generator",           en: "Custom array input + random generator" },
    ],
    arrowDir: "up",   // card নিচে, arrow উপরে element কে দেখাবে
  },
  {
    selector: '[data-tour="searching"]',
    icon: "🔍",
    title: { bn: "Searching Algorithms",     en: "Searching Algorithms" },
    route: { bn: "Route: / (Searching tab)", en: "Route: / (Searching tab)" },
    desc:  { bn: "৫টি searching algorithm-এ L, M, R pointer visualization সহ target element খুঁজে দেখো।",
             en: "Find target elements with L/M/R pointer visualization across 5 searching algorithms." },
    items: [
      { bn: "Linear, Binary, Jump, Fibonacci, Interpolation", en: "Linear, Binary, Jump, Fibonacci, Interpolation" },
      { bn: "L / M / R pointer indicator",                    en: "L / M / R pointer indicator" },
      { bn: "Custom array ও target input",                    en: "Custom array & target input" },
      { bn: "Step-by-step probe log",                         en: "Step-by-step probe log" },
    ],
    arrowDir: "up",
  },
  {
    selector: '[data-tour="ds"]',
    icon: "📦",
    title: { bn: "Data Structures",     en: "Data Structures" },
    route: { bn: "Route: / (DS tab)",   en: "Route: / (DS tab)" },
    desc:  { bn: "Stack, Queue, Linked List ও Doubly Linked List — interactive operation সহ visual node দেখো।",
             en: "Stack, Queue, Linked List & Doubly Linked List — see visual nodes with interactive operations." },
    items: [
      { bn: "Push, Pop, Enqueue, Dequeue",          en: "Push, Pop, Enqueue, Dequeue" },
      { bn: "Insert ও Delete with animation",        en: "Insert & Delete with animation" },
      { bn: "Visual node + arrow representation",    en: "Visual node + arrow representation" },
      { bn: "Doubly linked list prev/next arrows",   en: "Doubly linked list prev/next arrows" },
    ],
    arrowDir: "up",
  },
  {
    selector: '[data-tour="tree"]',
    icon: "🌳",
    title: { bn: "Tree & Graph Traversal",      en: "Tree & Graph Traversal" },
    route: { bn: "Route: / (Tree/Graph tab)",   en: "Route: / (Tree/Graph tab)" },
    desc:  { bn: "নিজে node ও edge add করে BFS/DFS traversal live দেখো। Node drag করে reposition করা যায়।",
             en: "Add nodes & edges manually and watch BFS/DFS traversal live. Drag to reposition nodes." },
    items: [
      { bn: "Tree BFS ও DFS traversal",          en: "Tree BFS & DFS traversal" },
      { bn: "Graph BFS ও DFS traversal",         en: "Graph BFS & DFS traversal" },
      { bn: "Node/edge manually add করো",        en: "Manually add nodes & edges" },
      { bn: "Drag to reposition + live queue",    en: "Drag to reposition + live queue" },
    ],
    arrowDir: "up",
  },
  {
    selector: '[data-tour="compiler"]',
    icon: "💻",
    title: { bn: "Online Compiler (IDE)",    en: "Online Compiler (IDE)" },
    route: { bn: "Route: /compiler",         en: "Route: /compiler" },
    desc:  { bn: "C, C++, Python লেখো ও সরাসরি browser থেকে run করো। কোনো installation লাগবে না।",
             en: "Write C, C++, Python and run directly from the browser. No installation needed." },
    items: [
      { bn: "CodeMirror 6 — syntax highlight, auto-bracket", en: "CodeMirror 6 — syntax highlight, auto-bracket" },
      { bn: "C/C++ → Wandbox API (cloud compile)",           en: "C/C++ → Wandbox API (cloud compile)" },
      { bn: "Python → Pyodide (browser WASM)",               en: "Python → Pyodide (browser WASM)" },
      { bn: "stdin input + sample programs",                 en: "stdin input + sample programs" },
    ],
    arrowDir: "up",
  },
  {
    selector: '[data-tour="resources"]',
    icon: "📚",
    title: { bn: "Resources",                          en: "Resources" },
    route: { bn: "LeetCode · C Roadmap · C++ Roadmap", en: "LeetCode · C Roadmap · C++ Roadmap" },
    desc:  { bn: "LeetCode 150 curated problems + C ও C++ structured learning roadmap — সব এক জায়গায়।",
             en: "LeetCode 150 curated problems + structured C & C++ learning roadmaps — all in one place." },
    items: [
      { bn: "১০০ টি curated LeetCode problem (40E·30M·20H·10B)", en: "100 curated LeetCode problems (40E·30M·20H·10B)" },
      { bn: "Difficulty ও category অনুযায়ী filter",              en: "Filter by difficulty & category" },
      { bn: "C Roadmap — ১০টি chapter + quiz",                   en: "C Roadmap — 10 chapters + quiz" },
      { bn: "C++ Roadmap — ১০টি chapter + quiz",                 en: "C++ Roadmap — 10 chapters + quiz" },
    ],
    arrowDir: "up",
  },
  {
    selector: '[data-tour="chatbot"]',
    icon: "🤖",
    title: { bn: "AI Chatbot",              en: "AI Chatbot" },
    route: { bn: "Hugging Face Gradio",     en: "Hugging Face Gradio" },
    desc:  { bn: "Context-aware AI assistant — জানে তুমি কোন algorithm দেখছো এবং সেই অনুযায়ী উত্তর দেয়।",
             en: "Context-aware AI assistant — knows which algorithm you're viewing and responds accordingly." },
    items: [
      { bn: "Algorithm-context aware responses",   en: "Algorithm-context aware responses" },
      { bn: "Quick question এর জন্য suggestion chips", en: "Suggestion chips for quick questions" },
      { bn: "Online / Offline indicator",          en: "Online / Offline indicator" },
      { bn: "Chat clear + session history",        en: "Clear chat + session history" },
    ],
    arrowDir: "up",
  },
];

/* ── Card position calculation ── */
function calcPos(rect, cardW = 308, cardH = 330) {
  const gap = 16;
  let top  = rect.bottom + gap;
  let left = rect.left + rect.width / 2 - cardW / 2; // center align under element

  // উপরে জায়গা না থাকলে নিচে রাখো
  if (top + cardH > window.innerHeight - 8) top = rect.top - cardH - gap;
  if (left + cardW > window.innerWidth  - 8) left = window.innerWidth - cardW - 8;
  if (left < 8) left = 8;
  if (top  < 8) top  = 8;

  return { top, left, elCenterX: rect.left + rect.width / 2, elBottom: rect.bottom, elTop: rect.top };
}

/* ── Arrow SVG — card এর উপর বা নিচে ── */
function CardArrow({ pos, elCenterX }) {
  if (!pos || elCenterX === undefined) return null;

  // arrow কোন দিকে — card উপরে গেলে নিচে arrow, card নিচে গেলে উপরে arrow
  const cardIsBelow = pos.top > (pos.elBottom || 0);
  const arrowLeft   = Math.max(12, Math.min(elCenterX - pos.left - 10, 308 - 32));

  if (cardIsBelow) {
    // card নিচে → উপরে arrow (▲)
    return (
      <div
        style={{
          position: "absolute",
          top: -10,
          left: arrowLeft,
          width: 0,
          height: 0,
          borderLeft:   "10px solid transparent",
          borderRight:  "10px solid transparent",
          borderBottom: "10px solid rgba(59,130,246,0.5)",
          filter: "drop-shadow(0 -2px 4px rgba(59,130,246,0.3))",
        }}
      />
    );
  } else {
    // card উপরে → নিচে arrow (▼)
    return (
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: arrowLeft,
          width: 0,
          height: 0,
          borderLeft:  "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop:   "10px solid rgba(59,130,246,0.5)",
          filter: "drop-shadow(0 2px 4px rgba(59,130,246,0.3))",
        }}
      />
    );
  }
}

export default function OnboardingTour({ onClose, docUrl = "/documentation" }) {
  const { isBn } = useLang();
  const [step,   setStep]   = useState(0);
  const [pos,    setPos]    = useState(null);
  const [fade,   setFade]   = useState(false);
  const [isDone, setIsDone] = useState(false);
  const litEl = useRef(null);
  const total = STEPS.length;

  /* ── Spotlight + position ── */
  useEffect(() => {
    if (litEl.current) {
      Object.assign(litEl.current.style, { boxShadow: "", position: "", zIndex: "", borderRadius: "" });
      litEl.current = null;
    }
    if (isDone) return;

    function attach() {
      const el = document.querySelector(STEPS[step]?.selector);
      if (!el) {
        const t = setTimeout(attach, 100);
        return () => clearTimeout(t);
      }

      Object.assign(el.style, {
        boxShadow:    "0 0 0 9999px rgba(0,0,0,0.65)",
        position:     "relative",
        zIndex:       "9999",
        borderRadius: "8px",
      });
      litEl.current = el;

      const rect = el.getBoundingClientRect();
      setPos(calcPos(rect));

      const onResize = () => setPos(calcPos(el.getBoundingClientRect()));
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    const cleanup = attach();
    return () => { if (typeof cleanup === "function") cleanup(); };
  }, [step, isDone]);

  useEffect(() => () => {
    if (litEl.current) {
      Object.assign(litEl.current.style, { boxShadow: "", position: "", zIndex: "", borderRadius: "" });
    }
  }, []);

  function goTo(next) {
    setFade(true);
    setTimeout(() => {
      if (next >= total) setIsDone(true);
      else setStep(Math.max(0, next));
      setFade(false);
    }, 180);
  }

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "true");
    if (litEl.current) {
      Object.assign(litEl.current.style, { boxShadow: "", position: "", zIndex: "", borderRadius: "" });
    }
    onClose?.();
  }

  const f   = STEPS[step];
  const top = pos?.top ?? 80;
  const left = pos?.left ?? 16;

  /* ── UI labels ── */
  const ui = {
    finish:   isBn ? "শেষ"          : "Finish",
    next:     isBn ? "পরে"          : "Next",
    prev:     isBn ? "আগে"          : "Prev",
    allDone:  isBn ? "সব feature দেখা শেষ!" : "All features explored!",
    doneMsg:  isBn ? "AlgoViz Pro তোমার DSA শেখার পুরো সফরটা আরও সহজ করে দিতে এখানে আছে।"
                   : "AlgoViz Pro is here to make your entire DSA learning journey easier.",
    viewDoc:  isBn ? "Full Documentation দেখো" : "View Full Documentation",
    restart:  isBn ? "আবার দেখো"   : "Restart Tour",
    start:    isBn ? "শুরু করো →"  : "Get Started →",
    docLabel: isBn ? "📄 AlgoViz Documentation" : "📄 AlgoViz Documentation",
    view:     isBn ? "দেখো"         : "View",
  };

  /* ── Completion screen ── */
  if (isDone) {
    return (
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 10000, width: 290 }}
        className="bg-[#0d1117] border border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600" />
        <div className="p-5 flex flex-col items-center text-center gap-3">
          <span className="text-4xl">🎉</span>
          <p className="text-white text-sm font-semibold">{ui.allDone}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{ui.doneMsg}</p>
          <a href={docUrl} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium
                       bg-green-900/40 hover:bg-green-900/60 border border-green-500/30
                       text-green-400 rounded-xl py-2.5 transition-colors">
            <Download size={12} /> {ui.viewDoc}
          </a>
          <div className="flex gap-2 w-full">
            <button onClick={() => { setIsDone(false); setStep(0); }}
              className="flex-1 text-xs border border-gray-700 text-gray-400 hover:bg-gray-800 rounded-xl py-2 transition-colors">
              {ui.restart}
            </button>
            <button onClick={handleClose}
              className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 transition-colors font-medium">
              {ui.start}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Tour card ── */
  return (
    <div
      style={{
        position:      "fixed",
        top,
        left,
        zIndex:        10000,
        width:         308,
        opacity:       fade ? 0 : 1,
        transition:    "opacity 0.18s ease, top 0.28s ease, left 0.28s ease",
        pointerEvents: fade ? "none" : "auto",
      }}
      className="bg-[#0d1117] border border-blue-500/30 rounded-2xl shadow-2xl overflow-visible"
    >
      {/* ── Arrow pointer — element দিকে ── */}
      <CardArrow pos={pos} elCenterX={pos?.elCenterX} />

      {/* Top gradient line */}
      <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl" />

      <div className="p-4">

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl leading-none">{f.icon}</span>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">{f.title[isBn ? "bn" : "en"]}</p>
              <p className="text-blue-400/80 text-[10px] font-mono mt-0.5">{f.route[isBn ? "bn" : "en"]}</p>
            </div>
          </div>
          <button onClick={handleClose} aria-label="Tour বন্ধ করো"
            className="text-gray-600 hover:text-gray-300 transition-colors mt-0.5 ml-2 flex-shrink-0">
            <X size={13} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-[11px] leading-relaxed mb-3">{f.desc[isBn ? "bn" : "en"]}</p>

        {/* Feature list */}
        <ul className="flex flex-col gap-1.5 mb-4">
          {f.items.map((item, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-400">
              <Check size={10} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <span>{item[isBn ? "bn" : "en"]}</span>
            </li>
          ))}
        </ul>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-3">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === step  ? "w-4 bg-blue-500"  :
                i <  step   ? "w-1.5 bg-blue-900" :
                               "w-1.5 bg-gray-700"
              }`}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => goTo(step - 1)}
            className={`flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg
                        border border-gray-700/80 text-gray-400 hover:bg-gray-800 transition-colors
                        ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
            <ArrowLeft size={11} /> {ui.prev}
          </button>

          <span className="text-[10px] text-gray-600 tabular-nums">{step + 1} / {total}</span>

          <button onClick={() => goTo(step + 1)}
            className="flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg
                       bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium">
            {step === total - 1 ? ui.finish : ui.next}
            <ArrowRight size={11} />
          </button>
        </div>

        {/* Doc footer */}
        <div className="mt-3 pt-3 border-t border-gray-800/60 flex items-center justify-between">
          <span className="text-[10px] text-gray-600">{ui.docLabel}</span>
          <a href={docUrl} target="_blank" rel="noopener noreferrer"
            className="text-[10px] text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors">
            <Download size={9} /> {ui.view}
          </a>
        </div>
      </div>
    </div>
  );
}