import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './header';
import Home from './home';
import Footer from './Footer';
import {
  Play, RotateCcw, Plus, Trash2, RefreshCw,
  Code2, Pin, ArrowRightLeft, SquareCheck, GitCompare,
  BookOpen, ChevronRight, Layers,
  Bot, Send, X, Sparkles, MessageCircle
} from 'lucide-react';

/* ── Sorting ── */
import { getBubbleSortAnimations }    from "../algorithm/sorting/bubbleSort";
import { getQuickSortAnimations }     from "../algorithm/sorting/quickSort";
import { getSelectionSortAnimations } from "../algorithm/sorting/selectionSort";
import { getInsertionSortAnimations } from "../algorithm/sorting/insertionSort";
import { getMergeSortAnimations }     from "../algorithm/sorting/mergeSort";

/* ── Data Structures ── */
import { stackAction }            from "../algorithm/dataStructures/stack";
import { queueAction }            from "../algorithm/dataStructures/queue";
import { linkedListAction }       from "../algorithm/dataStructures/linkedList";
import { doubleLinkedListAction } from "../algorithm/dataStructures/doubleLinkedList";

/* ── Tree & Graph ── */
import { getTreeBFSAnimations }  from "../algorithm/treeandgraph/treeBFS";
import { getTreeDFSAnimations }  from "../algorithm/treeandgraph/treeDFS";
import { getGraphBFSAnimations } from "../algorithm/treeandgraph/graphBFS";
import { getGraphDFSAnimations } from "../algorithm/treeandgraph/graphDFS";

/* ════════════════════════════════════════════════════════════
  🔑 GEMINI API KEY — replace with your key
════════════════════════════════════════════════════════════ */
const GROQ_API_KEY = "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";

/* ════════════════════════════════════════════════════════════
  COMPLEXITY + DESCRIPTIONS
════════════════════════════════════════════════════════════ */
const ALGO_INFO = {
  "Bubble Sort": {
    time:"O(n²)", space:"O(1)",
    code:"for(i=0; i<n; i++) {\n  for(j=0; j<n-i-1; j++) {\n    if(a[j] > a[j+1])\n      swap(a[j], a[j+1]);\n  }\n}",
    about:"Bubble Sort repeatedly compares adjacent elements and swaps them if they are in the wrong order. The largest unsorted element 'bubbles up' to its correct position after each pass.",
    stepLabels:{ compare:"Comparing adjacent elements", swap:"Swapping — left > right", pivot:"", sorted:"Element reached final position" },
  },
  "Quick Sort": {
    time:"O(n log n)", space:"O(log n)",
    code:"partition(arr,low,high) {\n  pivot=arr[high]; i=low-1;\n  for(j=low;j<high;j++)\n    if(arr[j]<=pivot) swap(++i,j);\n  swap(i+1,high);\n}",
    about:"Quick Sort picks a pivot element, partitions the array so elements ≤ pivot go left and > pivot go right, then recursively sorts each side. Average case is very fast.",
    stepLabels:{ compare:"Comparing with pivot", swap:"Moving element to correct side", pivot:"New pivot selected", sorted:"Pivot placed at final position" },
  },
  "Insertion Sort": {
    time:"O(n²)", space:"O(1)",
    code:"for(i=1;i<n;i++) {\n  key=a[i]; j=i-1;\n  while(j>=0 && a[j]>key){\n    a[j+1]=a[j]; j--;\n  }\n  a[j+1]=key;\n}",
    about:"Insertion Sort builds a sorted portion one element at a time. It picks each element and inserts it into its correct position within the already-sorted part — like sorting playing cards in hand.",
    stepLabels:{ compare:"Checking if element needs to shift left", swap:"Shifting element left to correct position", pivot:"", sorted:"Element inserted at correct position" },
  },
  "Selection Sort": {
    time:"O(n²)", space:"O(1)",
    code:"for(i=0;i<n-1;i++){\n  min=i;\n  for(j=i+1;j<n;j++)\n    if(arr[j]<arr[min]) min=j;\n  swap(arr[min],arr[i]);\n}",
    about:"Selection Sort finds the minimum element from the unsorted part and places it at the beginning. It divides the array into sorted and unsorted regions, growing the sorted part each pass.",
    stepLabels:{ compare:"Scanning for minimum element", swap:"Placing minimum at sorted boundary", pivot:"Current minimum candidate", sorted:"Minimum placed at final position" },
  },
  "Merge Sort": {
    time:"O(n log n)", space:"O(n)",
    code:"mergeSort(arr,l,r) {\n  if(l<r){\n    m=(l+r)/2;\n    mergeSort(arr,l,m);\n    mergeSort(arr,m+1,r);\n    merge(arr,l,m,r);\n  }\n}",
    about:"Merge Sort divides the array in half recursively until single elements remain, then merges them back in sorted order. It guarantees O(n log n) time but needs O(n) extra space.",
    stepLabels:{ compare:"Comparing elements from two halves", swap:"Writing merged element into position", pivot:"", sorted:"Sub-array fully merged" },
  },
  "Stack":              { time:"O(1)", space:"O(n)", about:"Stack follows LIFO (Last In, First Out). Think of a stack of plates — you can only add or remove from the top. Operations: Push (add to top), Pop (remove from top)." },
  "Queue":              { time:"O(1)", space:"O(n)", about:"Queue follows FIFO (First In, First Out). Like a line of people — new people join at the rear, and people leave from the front. Operations: Enqueue (add to rear), Dequeue (remove from front)." },
  "Linked List":        { time:"O(n)", space:"O(n)", about:"Linked List stores elements in nodes where each node points to the next. Unlike arrays, nodes are not contiguous in memory. Insertion/deletion is O(1) if you have the reference, but search is O(n)." },
  "Double Linked List": { time:"O(n)", space:"O(n)", about:"Doubly Linked List is like a Linked List but each node has TWO pointers — next (forward) and prev (backward). This allows traversal in both directions and easier deletion." },
  "Tree BFS": {
    time:"O(V+E)", space:"O(V)",
    code:"queue = [root]\nwhile queue not empty:\n  node = queue.dequeue()\n  visit(node)\n  for child in node.children:\n    queue.enqueue(child)",
    about:"Tree BFS (Breadth First Search) visits nodes level by level — all nodes at depth 1 before depth 2, etc. It uses a Queue. Great for finding shortest path in unweighted trees.",
    stepLabels:{ enqueue:"Added to queue (will visit soon)", visit:"Visiting this node now", edge:"Traversing edge to child", done:"Node fully processed" },
  },
  "Tree DFS": {
    time:"O(V+E)", space:"O(h)",
    code:"dfs(node):\n  visit(node)\n  for child in node.children:\n    dfs(child)",
    about:"Tree DFS (Depth First Search) explores as far as possible along each branch before backtracking. Pre-order visits root first, then children. Uses a Stack (or recursion).",
    stepLabels:{ visit:"Visiting this node now (pre-order)", edge:"Going deeper into subtree", done:"Backtracking from this node" },
  },
  "Graph BFS": {
    time:"O(V+E)", space:"O(V)",
    code:"queue=[start]; visited={start}\nwhile queue:\n  v=queue.dequeue()\n  visit(v)\n  for u in adj[v]:\n    if u not visited:\n      visited.add(u)\n      queue.enqueue(u)",
    about:"Graph BFS explores all neighbors of a node before going deeper. It uses a Queue and a visited set to avoid cycles. Finds shortest path in unweighted graphs.",
    stepLabels:{ enqueue:"Added to queue (neighbor discovered)", visit:"Visiting this node now", edge:"Exploring edge to neighbor", done:"All neighbors of this node explored" },
  },
  "Graph DFS": {
    time:"O(V+E)", space:"O(V)",
    code:"dfs(v,visited):\n  visited.add(v)\n  visit(v)\n  for u in adj[v]:\n    if u not visited:\n      dfs(u,visited)",
    about:"Graph DFS dives deep into one path before exploring others. It uses a Stack (or recursion) and a visited set. Useful for cycle detection, topological sort, and connected components.",
    stepLabels:{ visit:"Visiting this node now", edge:"Going deeper along this edge", done:"Backtracking — all paths from this node explored" },
  },
};

/* ════════════════════════════════════════════════════════════
  NODE COLORS
════════════════════════════════════════════════════════════ */
const NC = {
  default:  { fill:"#1e293b", stroke:"#475569", text:"#94a3b8" },
  queued:   { fill:"#1e3a5f", stroke:"#3b82f6", text:"#93c5fd" },
  visiting: { fill:"#5b21b6", stroke:"#a78bfa", text:"#ffffff" },
  done:     { fill:"#14532d", stroke:"#22c55e", text:"#86efac" },
  selected: { fill:"#1e3a2f", stroke:"#34d399", text:"#6ee7b7" },
};

/* ════════════════════════════════════════════════════════════
  DEFAULT DATA
════════════════════════════════════════════════════════════ */
const DEFAULT_TREE = [
  { id:0, value:"A", x:300, y:55,  children:[1,2] },
  { id:1, value:"B", x:160, y:165, children:[3,4] },
  { id:2, value:"C", x:440, y:165, children:[5,6] },
  { id:3, value:"D", x:80,  y:275, children:[] },
  { id:4, value:"E", x:240, y:275, children:[] },
  { id:5, value:"F", x:360, y:275, children:[] },
  { id:6, value:"G", x:520, y:275, children:[] },
];
const DEFAULT_GRAPH_NODES = [
  { id:0, x:300, y:60  }, { id:1, x:150, y:180 }, { id:2, x:450, y:180 },
  { id:3, x:80,  y:300 }, { id:4, x:220, y:300 }, { id:5, x:380, y:300 }, { id:6, x:520, y:300 },
];
const DEFAULT_GRAPH_EDGES = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];

/* ════════════════════════════════════════════════════════════
  🤖 FLOATING AI CHATBOT
════════════════════════════════════════════════════════════ */
const ChatBot = ({ isOpen, onClose, activeAlgo }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "আমি Visualizer Assistant! Sorting, Data Structures, Tree/Graph সম্পর্কে যেকোনো প্রশ্ন করুন। 🚀",
    }
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const systemPrompt = `You are an expert algorithm and data structures tutor embedded inside an Algorithm Visualizer web app.
The app supports: Bubble Sort, Quick Sort, Insertion Sort, Selection Sort, Merge Sort, Stack, Queue, Linked List, Double Linked List, Tree BFS, Tree DFS, Graph BFS, Graph DFS.
${activeAlgo ? `The user is currently viewing: ${activeAlgo}. Focus explanations on this algorithm when relevant.` : ""}
Answer clearly and concisely. Use simple language. You can use emojis. Keep responses under 200 words unless the user asks for detail.
If the user writes in Bengali, respond in Bengali. Otherwise respond in English.`;

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Build conversation history for Gemini
    const history = [...messages, userMsg].map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemPrompt },
              ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
              { role: "user", content: text },
            ],
            max_tokens: 512,
            temperature: 0.7,
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          const errMsg = data?.error?.message ?? JSON.stringify(data);
          setMessages(prev => [...prev, { role: "assistant", text: `❌ API Error (${res.status}): ${errMsg}` }]);
          return;
        }

        const reply = data?.choices?.[0]?.message?.content;
        if (!reply) {
          setMessages(prev => [...prev, { role: "assistant", text: `⚠️ কোনো উত্তর পেলাম না।` }]);
          return;
        }
        setMessages(prev => [...prev, { role: "assistant", text: reply }]);
            } catch (err) {
              setMessages(prev => [...prev, { role: "assistant", text: "❌ Network error: " + err.message }]);
            } finally {
              setLoading(false);
            }
          };

  if (!isOpen) return null;

  return (
    <div
      className="fixed right-6 z-[100] flex flex-col rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden"
      style={{ width: "360px", bottom: "88px", maxHeight: "calc(100vh - 110px)", height: "500px", background: "#0b0e17" }}
    >
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
        <button onClick={onClose} className="text-slate-600 hover:text-white transition p-1">
          <X size={16} />
        </button>
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
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed break-words overflow-wrap-anywhere overflow-hidden ${
                m.role === "user"
                  ? "bg-blue-600/80 text-white rounded-br-sm"
                  : "bg-slate-800/80 text-slate-200 border border-slate-700/40 rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
              <Bot size={12} className="text-emerald-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
              {[0,1,2].map(i => (
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
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 p-2.5 rounded-xl transition active:scale-95"
        >
          <Send size={15} className="text-white" />
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
  STEP DETAIL PANEL
════════════════════════════════════════════════════════════ */
const StepDetailPanel = ({ algo, steps }) => {
  const info = ALGO_INFO[algo];
  if (!steps.length && !info) return null;
  return (
    <div className="mt-5 space-y-3">
      <div className="bg-[#0a0f1e] rounded-2xl border border-slate-700/40 p-5">
        <div className="flex items-center gap-2 mb-3 text-slate-400">
          <BookOpen size={14} className="text-blue-400" />
          <span className="text-[10px] uppercase tracking-widest font-bold">How it works</span>
        </div>
        <p className="text-slate-400 text-[13px] leading-relaxed">{info?.about}</p>
      </div>
      {steps.length > 0 && (
        <div className="bg-[#0a0f1e] rounded-2xl border border-slate-700/40 p-5">
          <div className="flex items-center gap-2 mb-3 text-slate-400">
            <Layers size={14} className="text-purple-400" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Step Log</span>
            <span className="ml-auto text-[10px] text-slate-600">{steps.length} steps</span>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1" style={{ scrollbarWidth:"thin" }}>
            {steps.map((s, i) => (
              <div key={i}
                className={`flex items-start gap-2.5 rounded-xl px-3 py-2 text-[12px] transition-all
                  ${i === steps.length - 1
                    ? "bg-slate-700/50 border border-slate-600/50"
                    : "bg-slate-900/40"}`}
              >
                <span className="text-slate-600 font-mono text-[10px] mt-0.5 min-w-[20px]">{i + 1}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.color}`} />
                <span className="text-slate-300 leading-snug">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
  TREE INTERACTIVE VISUALIZER
════════════════════════════════════════════════════════════ */
  const TreeVisualizer = ({ algo }) => {
  const [nodes, setNodes]           = useState(() => DEFAULT_TREE.map(n => ({ ...n, children:[...n.children] })));
  const [nodeStates, setNodeStates] = useState({});
  const [activeEdges, setActiveEdges] = useState(new Set());
  const [visitOrder, setVisitOrder] = useState([]);
  const [isRunning, setIsRunning]   = useState(false);
  const [treeSteps, setTreeSteps]   = useState([]);
  const [queue, setQueue]           = useState([]);

  const [selNode,   setSelNode]   = useState(null);
  const [newValue,  setNewValue]  = useState("");
  const [parentSel, setParentSel] = useState("");
  const [editId,    setEditId]    = useState(null);
  const [editVal,   setEditVal]   = useState("");

  const timersRef = useRef([]);
  const info = ALGO_INFO[algo];

  const resetAnim = () => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    setNodeStates({}); setActiveEdges(new Set()); setVisitOrder([]);
    setIsRunning(false); setTreeSteps([]); setQueue([]);
  };

  useEffect(() => { resetAnim(); }, [algo]);

  const nodeMap = {};
  nodes.forEach(n => (nodeMap[n.id] = n));

  const addNode = () => {
    const val = newValue.trim(); if (!val) return;
    const pid = parentSel !== "" ? Number(parentSel) : null;
    const newId = nodes.reduce((m, n) => Math.max(m, n.id), -1) + 1;
    let x = 300, y = 55;
    if (pid !== null) {
      const parent = nodes.find(n => n.id === pid);
      if (parent) { const sibs = nodes.filter(n => parent.children.includes(n.id)); x = parent.x + (sibs.length - 1) * 60; y = parent.y + 110; }
    }
    setNodes([...nodes.map(n => n.id === pid ? { ...n, children:[...n.children, newId] } : n), { id:newId, value:val, x, y, children:[] }]);
    setNewValue(""); setParentSel(""); resetAnim();
  };

  const deleteNode = (delId) => {
    if (nodes.length <= 1) return;
    setNodes(nodes.filter(n => n.id !== delId).map(n => ({ ...n, children:n.children.filter(c => c !== delId) })));
    if (selNode === delId) setSelNode(null); resetAnim();
  };

  const confirmEdit = (id) => {
    if (!editVal.trim()) { setEditId(null); return; }
    setNodes(prev => prev.map(n => n.id === id ? { ...n, value:editVal.trim() } : n));
    setEditId(null); setEditVal("");
  };

  const runAnim = () => {
    resetAnim();
    const anims = algo === "Tree BFS" ? getTreeBFSAnimations(nodes) : getTreeDFSAnimations(nodes);
    if (!anims.length) return;
    setIsRunning(true);
    const DELAY = 700;
    const labels = info?.stepLabels || {};
    let liveQueue = [];

    anims.forEach((a, i) => {
      const t = setTimeout(() => {
        const [type, id1, id2] = a;
        const nodeName = nodeMap[id1]?.value ?? id1;
        const node2Name = nodeMap[id2]?.value ?? id2;

        if (type === "enqueue") {
          liveQueue = [...liveQueue, nodeName];
          setQueue([...liveQueue]);
          setNodeStates(p => ({ ...p, [id1]:"queued" }));
          setTreeSteps(p => [...p, { color:"bg-blue-500", text:`Enqueue "${nodeName}" → Queue: [${liveQueue.join(", ")}]` }]);
        } else if (type === "visit") {
          liveQueue = liveQueue.filter(v => v !== nodeName);
          setQueue([...liveQueue]);
          setNodeStates(p => ({ ...p, [id1]:"visiting" }));
          setVisitOrder(p => [...p, id1]);
          setTreeSteps(p => [...p, { color:"bg-purple-500", text:`Visiting "${nodeName}" — ${labels.visit || "processing node"}` }]);
        } else if (type === "edge") {
          setActiveEdges(p => new Set([...p, `${id1}-${id2}`]));
          setTreeSteps(p => [...p, { color:"bg-indigo-400", text:`Edge: "${nodeName}" → "${node2Name}"` }]);
        } else if (type === "done") {
          setNodeStates(p => ({ ...p, [id1]:"done" }));
          setTreeSteps(p => [...p, { color:"bg-green-500", text:`"${nodeName}" fully processed ✓` }]);
        }

        if (i === anims.length - 1) setIsRunning(false);
      }, i * DELAY);
      timersRef.current.push(t);
    });
  };

  const getC = (id) => NC[nodeStates[id] || (selNode === id ? "selected" : "default")];
  const edgeActive = (a, b) => activeEdges.has(`${a}-${b}`) || activeEdges.has(`${b}-${a}`);
  const edges = nodes.flatMap(n => n.children.map(c => [n.id, c]));
  const visitLabel = visitOrder.map(id => nodeMap[id]?.value ?? id).join(" → ");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-2xl bg-[#060d1a] border border-slate-800/50 overflow-hidden">
        <svg viewBox="0 0 620 320" className="w-full" style={{ minHeight:"260px" }}>
          {edges.map(([a, b]) => {
            const na = nodeMap[a], nb = nodeMap[b]; if (!na || !nb) return null;
            return <line key={`e-${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={edgeActive(a,b) ? "#6366f1" : "#1e293b"} strokeWidth={edgeActive(a,b) ? 2.5 : 1.5}
              strokeLinecap="round" style={{ transition:"stroke 0.3s" }} />;
          })}
          {nodes.map(n => {
            const c = getC(n.id);
            return (
              <g key={`n-${n.id}`} style={{ cursor:"pointer" }} onClick={() => setSelNode(selNode === n.id ? null : n.id)}>
                <circle cx={n.x} cy={n.y} r={24} fill={c.fill} stroke={c.stroke} strokeWidth={selNode===n.id?3:2} style={{ transition:"fill 0.3s,stroke 0.3s" }} />
                {editId === n.id ? (
                  <foreignObject x={n.x-18} y={n.y-10} width={36} height={22}>
                    <input autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")confirmEdit(n.id);if(e.key==="Escape")setEditId(null);}}
                      onBlur={()=>confirmEdit(n.id)}
                      style={{ width:"100%",background:"transparent",border:"none",outline:"none",color:"white",fontWeight:700,fontSize:"13px",textAlign:"center" }} />
                  </foreignObject>
                ) : (
                  <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill={c.text}
                    style={{ fontFamily:"monospace",userSelect:"none" }}
                    onDoubleClick={e=>{e.stopPropagation();setEditId(n.id);setEditVal(n.value);}}>
                    {n.value}
                  </text>
                )}
                {selNode===n.id && !isRunning && (
                  <g onClick={e=>{e.stopPropagation();deleteNode(n.id);}}>
                    <circle cx={n.x+18} cy={n.y-18} r={9} fill="#ef4444" stroke="#fca5a5" strokeWidth={1}/>
                    <text x={n.x+18} y={n.y-18} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="white" fontWeight="900">×</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {algo === "Tree BFS" && isRunning && (
        <div className="bg-[#0f1320] rounded-xl border border-blue-800/40 px-4 py-2.5 flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-widest text-blue-500 font-bold flex-shrink-0">Queue</span>
          <div className="flex gap-2 flex-wrap">
            {queue.length === 0
              ? <span className="text-slate-600 text-xs">empty</span>
              : queue.map((v, i) => (
                  <span key={i} className="bg-blue-900/50 border border-blue-700/40 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-lg">{v}</span>
                ))
            }
          </div>
        </div>
      )}

      {visitLabel && (
        <div className="bg-[#0f1320] rounded-xl border border-slate-700/40 px-4 py-2.5">
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Visit Order</p>
          <p className="text-sm font-bold text-indigo-400 font-mono">{visitLabel}</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap text-[10px] font-semibold text-slate-500 justify-center">
        {[["default","Unvisited"],["queued","Queued"],["visiting","Visiting"],["done","Done"],["selected","Selected"]].map(([s,l]) => (
          <span key={s} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block border" style={{ background:NC[s].fill,borderColor:NC[s].stroke }} />{l}
          </span>
        ))}
      </div>

      <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4 space-y-3">
        <p className="text-[9px] uppercase tracking-widest text-slate-500">Add Node</p>
        <input value={newValue} onChange={e=>setNewValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNode()}
          placeholder="Node value (e.g. H)"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm outline-none focus:border-purple-500 text-slate-200 placeholder-slate-600" />
        <select value={parentSel} onChange={e=>setParentSel(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm outline-none text-slate-300 cursor-pointer">
          <option value="">No parent (new root)</option>
          {nodes.map(n => <option key={n.id} value={n.id}>Parent: {n.value} (id {n.id})</option>)}
        </select>
        <button onClick={addNode} className="w-full bg-purple-600 hover:bg-purple-500 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition active:scale-95">
          <Plus size={15} /> Add Node
        </button>
        {selNode !== null && (
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30 text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">Selected: <span className="text-purple-400">{nodeMap[selNode]?.value}</span></p>
            <p>Double-click node to edit value · Click <span className="text-red-400">×</span> to delete</p>
          </div>
        )}
      </div>

      <button onClick={runAnim} disabled={isRunning}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-purple-900/30 transition active:scale-95 text-sm">
        <Play size={16} fill="currentColor" /> {isRunning ? "Running…" : `Run ${algo}`}
      </button>
      <button onClick={()=>{resetAnim();setNodes(DEFAULT_TREE.map(n=>({...n,children:[...n.children]})));setSelNode(null);}}
        className="w-full border border-slate-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800 text-sm transition">
        <RotateCcw size={14} /> Reset to Default
      </button>

      <StepDetailPanel algo={algo} steps={treeSteps} />
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
  GRAPH INTERACTIVE VISUALIZER
════════════════════════════════════════════════════════════ */
const GraphVisualizer = ({ algo }) => {
  const [gNodes, setGNodes]           = useState(() => DEFAULT_GRAPH_NODES.map(n=>({...n})));
  const [gEdges, setGEdges]           = useState(() => DEFAULT_GRAPH_EDGES.map(e=>[...e]));
  const [nodeStates, setNodeStates]   = useState({});
  const [activeEdges, setActiveEdges] = useState(new Set());
  const [visitOrder, setVisitOrder]   = useState([]);
  const [isRunning, setIsRunning]     = useState(false);
  const [startNode, setStartNode]     = useState(0);
  const [graphSteps, setGraphSteps]   = useState([]);
  const [liveQueue, setLiveQueue]     = useState([]);

  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo,   setEdgeTo]   = useState("");
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);
  const timersRef = useRef([]);
  const info = ALGO_INFO[algo];

  const resetAnim = () => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    setNodeStates({}); setActiveEdges(new Set()); setVisitOrder([]);
    setIsRunning(false); setGraphSteps([]); setLiveQueue([]);
  };

  useEffect(() => { resetAnim(); }, [algo]);

  const nodeMap = {};
  gNodes.forEach(n => (nodeMap[n.id] = n));

  const addNode = () => {
    const newId = gNodes.reduce((m,n)=>Math.max(m,n.id),-1)+1;
    const angle = (newId*137.5*Math.PI)/180;
    const r = 100+(newId%3)*50;
    setGNodes(prev=>[...prev,{ id:newId, x:Math.round(310+r*Math.cos(angle)), y:Math.round(180+r*Math.sin(angle)) }]);
    resetAnim();
  };

  const deleteNode = (id) => {
    setGNodes(prev=>prev.filter(n=>n.id!==id));
    setGEdges(prev=>prev.filter(([a,b])=>a!==id&&b!==id));
    if (startNode===id) setStartNode(gNodes.find(n=>n.id!==id)?.id??0);
    resetAnim();
  };

  const addEdge = () => {
    const a=Number(edgeFrom),b=Number(edgeTo);
    if(isNaN(a)||isNaN(b)||a===b) return;
    if(!gEdges.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a))) setGEdges(prev=>[...prev,[a,b]]);
    setEdgeFrom(""); setEdgeTo(""); resetAnim();
  };

  const deleteEdge = (a,b) => { setGEdges(prev=>prev.filter(([x,y])=>!((x===a&&y===b)||(x===b&&y===a)))); resetAnim(); };

  const onMouseDown = (e,id) => { e.preventDefault(); setDragging(id); };
  const onMouseMove = useCallback((e) => {
    if(dragging===null||!svgRef.current) return;
    const rect=svgRef.current.getBoundingClientRect();
    setGNodes(prev=>prev.map(n=>n.id===dragging?{...n,x:Math.round((e.clientX-rect.left)*(620/rect.width)),y:Math.round((e.clientY-rect.top)*(360/rect.height))}:n));
  },[dragging]);
  const onMouseUp = useCallback(()=>setDragging(null),[]);

  const runAnim = () => {
    resetAnim();
    const anims = algo==="Graph BFS"
      ? getGraphBFSAnimations(gNodes,gEdges,startNode)
      : getGraphDFSAnimations(gNodes,gEdges,startNode);
    if(!anims.length) return;
    setIsRunning(true);
    const DELAY=700;
    const labels=info?.stepLabels||{};
    let lq=[];

    anims.forEach((a,i)=>{
      const t=setTimeout(()=>{
        const [type,id1,id2]=a;
        if(type==="enqueue"){
          lq=[...lq,id1];
          setLiveQueue([...lq]);
          setNodeStates(p=>({...p,[id1]:"queued"}));
          setGraphSteps(p=>[...p,{color:"bg-blue-500",text:`Node ${id1} discovered → Queue: [${lq.join("→")}]`}]);
        } else if(type==="visit"){
          lq=lq.filter(v=>v!==id1);
          setLiveQueue([...lq]);
          setNodeStates(p=>({...p,[id1]:"visiting"}));
          setVisitOrder(p=>[...p,id1]);
          setGraphSteps(p=>[...p,{color:"bg-purple-500",text:`Visiting Node ${id1} — ${labels.visit||"processing"}`}]);
        } else if(type==="edge"){
          setActiveEdges(p=>new Set([...p,`${id1}-${id2}`]));
          setGraphSteps(p=>[...p,{color:"bg-indigo-400",text:`Exploring edge: ${id1} → ${id2}`}]);
        } else if(type==="done"){
          setNodeStates(p=>({...p,[id1]:"done"}));
          setGraphSteps(p=>[...p,{color:"bg-green-500",text:`Node ${id1} fully explored ✓`}]);
        }
        if(i===anims.length-1) setIsRunning(false);
      },i*DELAY);
      timersRef.current.push(t);
    });
  };

  const getC=(id)=>NC[nodeStates[id]||(id===startNode?"selected":"default")];
  const eActive=(a,b)=>activeEdges.has(`${a}-${b}`)||activeEdges.has(`${b}-${a}`);
  const visitLabel=visitOrder.join(" → ");

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="rounded-2xl bg-[#060d1a] border border-slate-800/50 overflow-hidden"
        onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <svg ref={svgRef} viewBox="0 0 620 360" className="w-full" style={{ minHeight:"280px",cursor:dragging!==null?"grabbing":"default" }}>
          {gEdges.map(([a,b])=>{
            const na=nodeMap[a],nb=nodeMap[b]; if(!na||!nb) return null;
            const mx=(na.x+nb.x)/2,my=(na.y+nb.y)/2;
            const active=eActive(a,b);
            return (
              <g key={`e-${a}-${b}`}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={active?"#6366f1":"#334155"} strokeWidth={active?2.5:1.5} strokeLinecap="round" style={{transition:"stroke 0.3s"}}/>
                {!isRunning && (
                  <g onClick={()=>deleteEdge(a,b)} style={{cursor:"pointer"}}>
                    <circle cx={mx} cy={my} r={7} fill="#1e293b" stroke="#ef4444" strokeWidth={1} opacity={0.85}/>
                    <text x={mx} y={my} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#ef4444" fontWeight="900">×</text>
                  </g>
                )}
              </g>
            );
          })}
          {gNodes.map(n=>{
            const c=getC(n.id);
            const isStart=n.id===startNode;
            return (
              <g key={`n-${n.id}`} onMouseDown={e=>onMouseDown(e,n.id)} style={{cursor:dragging===n.id?"grabbing":"grab"}}>
                <circle cx={n.x} cy={n.y} r={24} fill={c.fill} stroke={c.stroke} strokeWidth={isStart?3:2} style={{transition:"fill 0.3s,stroke 0.3s"}}/>
                <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill={c.text} style={{fontFamily:"monospace",userSelect:"none"}}>{n.id}</text>
                {isStart && <text x={n.x} y={n.y-32} textAnchor="middle" fontSize="9" fill="#34d399" fontWeight="700">START</text>}
                {!isRunning && (
                  <g onClick={e=>{e.stopPropagation();deleteNode(n.id);}} style={{cursor:"pointer"}}>
                    <circle cx={n.x+18} cy={n.y-18} r={8} fill="#ef4444" stroke="#fca5a5" strokeWidth={1}/>
                    <text x={n.x+18} y={n.y-18} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="white" fontWeight="900">×</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {algo==="Graph BFS" && isRunning && (
        <div className="bg-[#0f1320] rounded-xl border border-blue-800/40 px-4 py-2.5 flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-widest text-blue-500 font-bold flex-shrink-0">Queue</span>
          <div className="flex gap-2 flex-wrap">
            {liveQueue.length===0
              ? <span className="text-slate-600 text-xs">empty</span>
              : liveQueue.map((v,i)=><span key={i} className="bg-blue-900/50 border border-blue-700/40 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-lg">{v}</span>)
            }
          </div>
        </div>
      )}

      {visitLabel && (
        <div className="bg-[#0f1320] rounded-xl border border-slate-700/40 px-4 py-2.5">
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Visit Order</p>
          <p className="text-sm font-bold text-indigo-400 font-mono">{visitLabel}</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap text-[10px] font-semibold text-slate-500 justify-center">
        {[["selected","Start"],["queued","Queued"],["visiting","Visiting"],["done","Done"]].map(([s,l])=>(
          <span key={s} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block border" style={{background:NC[s].fill,borderColor:NC[s].stroke}}/>{l}
          </span>
        ))}
        <span className="text-slate-700 text-[9px]">| Drag to move nodes</span>
      </div>

      <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4 space-y-3">
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">Start Node</p>
          <select value={startNode} onChange={e=>{setStartNode(Number(e.target.value));resetAnim();}}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-sm outline-none text-slate-300 cursor-pointer">
            {gNodes.map(n=><option key={n.id} value={n.id}>Node {n.id}</option>)}
          </select>
        </div>
        <button onClick={addNode} className="w-full bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition active:scale-95 text-slate-300 border border-slate-700">
          <Plus size={14}/> Add Node
        </button>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5">Add Edge</p>
          <div className="flex gap-2">
            <select value={edgeFrom} onChange={e=>setEdgeFrom(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs outline-none text-slate-300 cursor-pointer">
              <option value="">From</option>{gNodes.map(n=><option key={n.id} value={n.id}>Node {n.id}</option>)}
            </select>
            <select value={edgeTo} onChange={e=>setEdgeTo(e.target.value)} className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs outline-none text-slate-300 cursor-pointer">
              <option value="">To</option>{gNodes.map(n=><option key={n.id} value={n.id}>Node {n.id}</option>)}
            </select>
            <button onClick={addEdge} className="bg-purple-600 hover:bg-purple-500 px-3 rounded-xl font-bold text-sm transition active:scale-95"><Plus size={14}/></button>
          </div>
        </div>
        <p className="text-[10px] text-slate-600">Click <span className="text-red-400">×</span> on node/edge to delete</p>
      </div>

      <button onClick={runAnim} disabled={isRunning}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-purple-900/30 transition active:scale-95 text-sm">
        <Play size={16} fill="currentColor"/> {isRunning?"Running…":`Run ${algo}`}
      </button>
      <button onClick={()=>{resetAnim();setGNodes(DEFAULT_GRAPH_NODES.map(n=>({...n})));setGEdges(DEFAULT_GRAPH_EDGES.map(e=>[...e]));setStartNode(0);}}
        className="w-full border border-slate-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800 text-sm transition">
        <RotateCcw size={14}/> Reset to Default
      </button>

      <StepDetailPanel algo={algo} steps={graphSteps}/>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
  DS STEP LOG
════════════════════════════════════════════════════════════ */
const DSStepLog = ({ algo, log }) => {
  const info = ALGO_INFO[algo];
  return (
    <div className="mt-5 space-y-3">
      <div className="bg-[#0a0f1e] rounded-2xl border border-slate-700/40 p-5">
        <div className="flex items-center gap-2 mb-3 text-slate-400">
          <BookOpen size={14} className="text-green-400"/>
          <span className="text-[10px] uppercase tracking-widest font-bold">How it works</span>
        </div>
        <p className="text-slate-400 text-[13px] leading-relaxed">{info?.about}</p>
      </div>
      {log.length > 0 && (
        <div className="bg-[#0a0f1e] rounded-2xl border border-slate-700/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={14} className="text-purple-400"/>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Operation Log</span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {log.map((entry, i) => (
              <div key={i} className={`flex items-start gap-2.5 rounded-xl px-3 py-2 text-[12px] ${i===log.length-1?"bg-slate-700/50 border border-slate-600/50":"bg-slate-900/40"}`}>
                <span className="text-slate-600 font-mono text-[10px] mt-0.5 min-w-[20px]">{i+1}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${entry.color}`}/>
                <span className="text-slate-300 leading-snug">{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════
  HELPERS
════════════════════════════════════════════════════════════ */
const makeArray   = (size) => Array.from({length:size},()=>Math.floor(Math.random()*270)+30);
const isDLL       = (a) => a==="Double Linked List";
const isSLL       = (a) => a==="Linked List";
const isTreeAlgo  = (a) => a==="Tree BFS"||a==="Tree DFS";
const isGraphAlgo = (a) => a==="Graph BFS"||a==="Graph DFS";
const isTG        = (a) => isTreeAlgo(a)||isGraphAlgo(a);

/* ════════════════════════════════════════════════════════════
  MAIN COMPONENT
════════════════════════════════════════════════════════════ */
const Visualizer = () => {
  const [selectedAlgo,      setSelectedAlgo]      = useState("");
  const [selectedPathAlgo,  setSelectedPathAlgo]  = useState("");
  const [selectedGraphAlgo, setSelectedGraphAlgo] = useState("");
  const [isSorting, setIsSorting] = useState(false);
  const [showCode,  setShowCode]  = useState(false);
  const [showChat,  setShowChat]  = useState(false);   // ← NEW chatbot state

  const [array,     setArray]     = useState([]);
  const [speed,     setSpeed]     = useState(70);
  const [arraySize, setArraySize] = useState(14);

  /* ── NEW: custom array input ── */
  const [customInput,    setCustomInput]    = useState("");
  const [customInputErr, setCustomInputErr] = useState("");
  const [useCustomArray, setUseCustomArray] = useState(false);

  const [pivotIndex,       setPivotIndex]       = useState(null);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices,  setSwappingIndices]  = useState([]);
  const [sortedIndices,    setSortedIndices]    = useState([]);
  const [stepStats,    setStepStats]    = useState({compares:0,swaps:0});
  const [currentStep,  setCurrentStep]  = useState(0);
  const [totalSteps,   setTotalSteps]   = useState(0);
  const [sortSteps,    setSortSteps]    = useState([]);

  const [dsData,     setDsData]     = useState([]);
  const [dsLog,      setDsLog]      = useState([]);
  const [stackInput, setStackInput] = useState("");
  const [queueInput, setQueueInput] = useState("");
  const [llInput,    setLlInput]    = useState("");
  const [dllInput,   setDllInput]   = useState("");

  const isSortingRef = useRef(false);
  const timeoutsRef  = useRef([]);
  const activeAlgo   = selectedAlgo||selectedPathAlgo||selectedGraphAlgo;

  useEffect(()=>{
    resetArray();
    setDsData([]); setDsLog([]);
    setStackInput(""); setQueueInput(""); setLlInput(""); setDllInput("");
    setCustomInput(""); setCustomInputErr(""); setUseCustomArray(false);
    return ()=>clearTimeouts();
  },[selectedAlgo,selectedPathAlgo,selectedGraphAlgo,arraySize]); // eslint-disable-line

  const clearTimeouts = ()=>{timeoutsRef.current.forEach(clearTimeout);timeoutsRef.current=[];};
  const resetVisual = ()=>{
    setPivotIndex(null);setComparingIndices([]);setSwappingIndices([]);setSortedIndices([]);
    setStepStats({compares:0,swaps:0});setCurrentStep(0);setTotalSteps(0);setSortSteps([]);
  };
  const resetArray = ()=>{
    if(isSortingRef.current) return;
    clearTimeouts();setArray(makeArray(arraySize));
    setIsSorting(false);isSortingRef.current=false;resetVisual();
    setUseCustomArray(false);
  };

  /* ── Parse & apply custom array ── */
  const applyCustomArray = () => {
    const parts = customInput.split(",").map(s => s.trim()).filter(Boolean);
    const nums = parts.map(Number);
    if (parts.length === 0) { setCustomInputErr("অন্তত একটি সংখ্যা দিন।"); return; }
    if (nums.some(isNaN))   { setCustomInputErr("শুধু সংখ্যা দিন, comma দিয়ে আলাদা করুন।"); return; }
    if (nums.some(n => n < 1 || n > 300)) { setCustomInputErr("প্রতিটি মান 1–300 এর মধ্যে হতে হবে।"); return; }
    if (nums.length > 30)   { setCustomInputErr("সর্বোচ্চ 30টি সংখ্যা দেওয়া যাবে।"); return; }
    setCustomInputErr("");
    clearTimeouts(); resetVisual();
    setArray(nums);
    setArraySize(nums.length);
    setUseCustomArray(true);
    setIsSorting(false); isSortingRef.current = false;
  };

  const getBarColor=(idx)=>{
    if(sortedIndices.includes(idx))   return "#22c55e";
    if(swappingIndices.includes(idx)) return "#a855f7";
    if(comparingIndices.includes(idx))return "#ef4444";
    if(pivotIndex===idx)              return "#eab308";
    return "#3b82f6";
  };

  /* ── SORT ── */
  const handleSort = ()=>{
    if(isSortingRef.current||!selectedAlgo) return;
    resetVisual();
    let anims=[];
    const snap=[...array];
    try{
      if(selectedAlgo==="Bubble Sort")         anims=getBubbleSortAnimations(snap);
      else if(selectedAlgo==="Quick Sort")     anims=getQuickSortAnimations(snap);
      else if(selectedAlgo==="Insertion Sort") anims=getInsertionSortAnimations(snap);
      else if(selectedAlgo==="Selection Sort") anims=getSelectionSortAnimations(snap);
      else if(selectedAlgo==="Merge Sort")     anims=getMergeSortAnimations(snap);
    }catch(e){console.error(e);return;}
    if(!anims.length) return;

    setTotalSteps(anims.length);setIsSorting(true);isSortingRef.current=true;
    const delay=Math.max(8,(101-speed)*3);
    const workArr=[...snap];let liveC=0,liveS=0;

    anims.forEach((anim,i)=>{
      const t=setTimeout(()=>{
        if(!isSortingRef.current) return;
        const [type,i1,i2,v1,v2]=anim;
        setCurrentStep(i+1);

        if(type==="compare"){
          liveC++;setStepStats({compares:liveC,swaps:liveS});
          setComparingIndices([i1,i2]);setSwappingIndices([]);setPivotIndex(null);
          const a=workArr[i1],b=workArr[i2];
          setSortSteps(p=>[...p,{
            color:"bg-red-500",
            text:`Compare index[${i1}]=${a} vs index[${i2}]=${b} → ${a>b?"left > right, will swap":"left ≤ right, no swap"}`
          }]);
        } else if(type==="swap"){
          liveS++;setStepStats({compares:liveC,swaps:liveS});
          setSwappingIndices([i1,i2]);setComparingIndices([]);
          setSortSteps(p=>[...p,{
            color:"bg-purple-500",
            text:`Swap index[${i1}]=${workArr[i1]} ↔ index[${i2}]=${workArr[i2]}`
          }]);
          workArr[i1]=v1;workArr[i2]=v2;setArray([...workArr]);
        } else if(type==="overwrite"){
          liveC++;setStepStats({compares:liveC,swaps:liveS});
          setSortSteps(p=>[...p,{color:"bg-blue-400",text:`Write ${i2} → index[${i1}] (merge step)`}]);
          workArr[i1]=i2;setArray([...workArr]);
          setComparingIndices([i1]);setSwappingIndices([]);
        } else if(type==="pivot"){
          setPivotIndex(i1);setComparingIndices([]);setSwappingIndices([]);
          setSortSteps(p=>[...p,{color:"bg-yellow-500",text:`New pivot selected: index[${i1}]=${workArr[i1]}`}]);
        } else if(type==="sorted"){
          setSortedIndices(prev=>prev.includes(i1)?prev:[...prev,i1]);
          setSortSteps(p=>[...p,{color:"bg-green-500",text:`index[${i1}]=${workArr[i1]} is now in its final sorted position ✓`}]);
        }

        if(i===anims.length-1){
          setTimeout(()=>{
            isSortingRef.current=false;setIsSorting(false);
            setComparingIndices([]);setSwappingIndices([]);setPivotIndex(null);
            setSortedIndices(Array.from({length:workArr.length},(_,k)=>k));
            setSortSteps(p=>[...p,{color:"bg-green-400",text:"✅ Sorting complete! All elements are in sorted order."}]);
          },delay+120);
        }
      },i*delay);
      timeoutsRef.current.push(t);
    });
  };
  const handleStop=()=>{isSortingRef.current=false;setIsSorting(false);clearTimeouts();resetVisual();};

  /* ── DS ── */
  const getDSInput=()=>({Stack:stackInput,Queue:queueInput,"Linked List":llInput,"Double Linked List":dllInput})[selectedPathAlgo]??"";
  const clearDSInput=()=>{
    if(selectedPathAlgo==="Stack")setStackInput("");
    else if(selectedPathAlgo==="Queue")setQueueInput("");
    else if(selectedPathAlgo==="Linked List")setLlInput("");
    else if(selectedPathAlgo==="Double Linked List")setDllInput("");
  };

  const handleDSUpdate=(action)=>{
    const val=getDSInput();
    if(action==="add"&&val.trim()==="") return;
    let result;
    try{
      if(selectedPathAlgo==="Stack")             result=stackAction([...dsData],action==="add"?"push":"pop",val);
      else if(selectedPathAlgo==="Queue")        result=queueAction([...dsData],action==="add"?"enqueue":"dequeue",val);
      else if(selectedPathAlgo==="Linked List")  result=linkedListAction([...dsData],action==="add"?"insert":"delete",val);
      else if(selectedPathAlgo==="Double Linked List") result=doubleLinkedListAction([...dsData],action==="add"?"insert":"delete",val);
    }catch(e){console.error(e);return;}
    if(!Array.isArray(result)) return;

    const before=dsData.length;
    const after=result.length;
    let logText="";let logColor="bg-blue-500";

    if(selectedPathAlgo==="Stack"){
      if(action==="add"){ logText=`Push "${val}" → Stack top is now "${val}". Size: ${after}`; logColor="bg-orange-500"; }
      else { logText=before>0?`Pop "${dsData[dsData.length-1]}" from top. New top: "${result[result.length-1]??'(empty)'}". Size: ${after}`:`Stack is empty — nothing to pop`; logColor="bg-red-500"; }
    } else if(selectedPathAlgo==="Queue"){
      if(action==="add"){ logText=`Enqueue "${val}" at REAR. Front: "${result[0]}", Rear: "${result[result.length-1]}". Size: ${after}`; logColor="bg-emerald-500"; }
      else { logText=before>0?`Dequeue "${dsData[0]}" from FRONT. New front: "${result[0]??'(empty)'}". Size: ${after}`:`Queue is empty — nothing to dequeue`; logColor="bg-red-500"; }
    } else if(selectedPathAlgo==="Linked List"){
      if(action==="add"){ logText=`Insert node "${val}" at tail. List: ${result.join(" → ")}. Size: ${after}`; logColor="bg-blue-500"; }
      else { const del=before>0?dsData[dsData.length-1]:"(none)"; logText=`Delete node "${del}". List: ${result.length?result.join(" → "):"(empty)"}. Size: ${after}`; logColor="bg-red-500"; }
    } else if(selectedPathAlgo==="Double Linked List"){
      if(action==="add"){ logText=`Insert node "${val}" at tail. DLL: ${result.join(" ⇄ ")}. Size: ${after}`; logColor="bg-cyan-500"; }
      else { const del=before>0?dsData[dsData.length-1]:"(none)"; logText=`Delete node "${del}". DLL: ${result.length?result.join(" ⇄ "):"(empty)"}. Size: ${after}`; logColor="bg-red-500"; }
    }

    setDsLog(prev=>[...prev,{color:logColor,text:logText}]);
    setDsData(result);
    clearDSInput();
  };

  const pct=totalSteps?Math.round((currentStep/totalSteps)*100):0;
  const isListType=isSLL(selectedPathAlgo)||isDLL(selectedPathAlgo);

  /* ════════════════════════════════════════════════════════
    RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 flex flex-col font-sans">
      <Header
        selectedAlgo={selectedAlgo}           setSelectedAlgo={setSelectedAlgo}
        selectedPathAlgo={selectedPathAlgo}   setSelectedPathAlgo={setSelectedPathAlgo}
        selectedGraphAlgo={selectedGraphAlgo} setSelectedGraphAlgo={setSelectedGraphAlgo}
        showCode={showCode}                   setShowCode={setShowCode}
        showChat={showChat}                   setShowChat={setShowChat}
      />

      <main className="pt-28 px-6 max-w-7xl mx-auto w-full flex-grow mb-10">
        {activeAlgo ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* ══ MAIN PANEL ══ */}
            <div className={`${isTG(activeAlgo)?"lg:col-span-2":"lg:col-span-3"} space-y-5`}>
              <div className="bg-[#0b0e17] rounded-[2rem] p-8 border border-slate-800/60 shadow-2xl">

                <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold bg-[#1a1f2e] text-blue-400 px-3 py-1 rounded-full border border-slate-700 uppercase">{ALGO_INFO[activeAlgo]?.time}</span>
                    <span className="text-[10px] font-bold bg-[#1a1f2e] text-blue-400 px-3 py-1 rounded-full border border-slate-700">Space {ALGO_INFO[activeAlgo]?.space}</span>
                  </div>
                  {selectedAlgo && (
                    <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"/> Default</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block"/> Compare</span>
                      <span className="flex items-center gap-1.5"><Pin size={11} className="text-yellow-400"/> Pivot</span>
                      <span className="flex items-center gap-1.5"><ArrowRightLeft size={11} className="text-purple-400"/> Swap</span>
                      <span className="flex items-center gap-1.5"><SquareCheck size={11} className="text-green-400"/> Sorted</span>
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-extrabold mb-5 uppercase tracking-tight">{activeAlgo}</h2>

                {selectedAlgo && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Progress</p>
                      <p className="text-xl font-bold text-blue-400">{pct}<span className="text-xs font-normal text-slate-500">%</span></p>
                      <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-100" style={{width:`${pct}%`}}/></div>
                    </div>
                    <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><GitCompare size={10}/> Comparisons</p>
                      <p className="text-xl font-bold text-red-400">{stepStats.compares}</p>
                    </div>
                    <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><ArrowRightLeft size={10}/> Swaps</p>
                      <p className="text-xl font-bold text-purple-400">{stepStats.swaps}</p>
                    </div>
                  </div>
                )}

                <div className="bg-slate-900/30 rounded-3xl border border-slate-800/40 p-6 flex items-center justify-center overflow-x-auto" style={{minHeight:"320px"}}>
                  {isTG(activeAlgo) ? (
                    <div className="text-slate-600 text-sm text-center select-none">
                      <p className="text-3xl mb-2">👉</p>
                      <p className="text-slate-500">Interactive {isTreeAlgo(activeAlgo)?"Tree":"Graph"} editor is on the right →</p>
                      <p className="text-xs mt-1 text-slate-700">Build your structure, then click Run.</p>
                    </div>
                  ) : selectedPathAlgo ? (
                    <div className={`flex ${selectedPathAlgo==="Stack"?"flex-col-reverse items-center":"flex-row flex-wrap items-center"} py-4`}
                      style={{gap:isListType?"0":"12px"}}>
                      {dsData.length===0 ? (
                        <p className="text-slate-600 text-sm w-full text-center select-none">No elements yet — add values using the controls →</p>
                      ) : (
                        dsData.map((val,i)=>{
                          const isStackTop=selectedPathAlgo==="Stack"&&i===dsData.length-1;
                          const isQueueFront=selectedPathAlgo==="Queue"&&i===0;
                          const isQueueRear=selectedPathAlgo==="Queue"&&i===dsData.length-1;
                          const isFirst=i===0,isLast=i===dsData.length-1,notLast=i<dsData.length-1;
                          return (
                            <div key={`${val}-${i}`} className="relative flex flex-col items-center"
                              style={{animation:"dsIn 0.25s ease",marginRight:isListType&&notLast?(isDLL(selectedPathAlgo)?"52px":"42px"):"0"}}>
                              {isSLL(selectedPathAlgo)&&notLast&&<div className="absolute select-none font-black text-slate-300" style={{right:"-38px",top:"50%",transform:"translateY(-60%)",fontSize:"24px",zIndex:2,textShadow:"0 0 10px rgba(148,163,184,0.6)"}}>→</div>}
                              {isDLL(selectedPathAlgo)&&notLast&&<div className="absolute flex flex-col items-center select-none font-black" style={{right:"-48px",top:"50%",transform:"translateY(-50%)",zIndex:2,gap:"2px"}}>
                                <span style={{fontSize:"18px",color:"#60a5fa",textShadow:"0 0 10px rgba(96,165,250,0.7)",lineHeight:1}}>→</span>
                                <span style={{fontSize:"18px",color:"#f472b6",textShadow:"0 0 10px rgba(244,114,182,0.7)",lineHeight:1}}>←</span>
                              </div>}
                              <div className="flex items-center justify-center font-bold text-sm shadow-lg relative"
                                style={{width:"56px",height:"56px",borderRadius:"12px",color:"white",
                                  background:isStackTop?"linear-gradient(135deg,#f97316,#ea580c)":isQueueFront?"linear-gradient(135deg,#10b981,#059669)":isQueueRear?"linear-gradient(135deg,#8b5cf6,#7c3aed)":isDLL(selectedPathAlgo)&&isFirst?"linear-gradient(135deg,#06b6d4,#0891b2)":isDLL(selectedPathAlgo)&&isLast?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#3b82f6,#2563eb)",
                                  border:isStackTop?"1.5px solid rgba(251,146,60,0.6)":isQueueFront?"1.5px solid rgba(52,211,153,0.5)":isQueueRear?"1.5px solid rgba(167,139,250,0.5)":isDLL(selectedPathAlgo)&&isFirst?"1.5px solid rgba(34,211,238,0.6)":isDLL(selectedPathAlgo)&&isLast?"1.5px solid rgba(251,191,36,0.6)":"1.5px solid rgba(96,165,250,0.3)",
                                  boxShadow:isStackTop?"0 0 16px rgba(249,115,22,0.45)":isQueueFront?"0 0 14px rgba(16,185,129,0.4)":isQueueRear?"0 0 14px rgba(139,92,246,0.4)":isDLL(selectedPathAlgo)&&isFirst?"0 0 14px rgba(6,182,212,0.45)":isDLL(selectedPathAlgo)&&isLast?"0 0 14px rgba(245,158,11,0.45)":"0 4px 12px rgba(37,99,235,0.3)"}}>
                                {isDLL(selectedPathAlgo)&&<>
                                  <span style={{position:"absolute",left:"3px",top:"50%",transform:"translateY(-50%)",width:"5px",height:"5px",borderRadius:"50%",background:isFirst?"rgba(244,114,182,0.3)":"#f472b6",boxShadow:isFirst?"none":"0 0 5px rgba(244,114,182,0.8)"}}/>
                                  <span style={{position:"absolute",right:"3px",top:"50%",transform:"translateY(-50%)",width:"5px",height:"5px",borderRadius:"50%",background:isLast?"rgba(96,165,250,0.3)":"#60a5fa",boxShadow:isLast?"none":"0 0 5px rgba(96,165,250,0.8)"}}/>
                                </>}
                                {val}
                              </div>
                              <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider"
                                style={{minHeight:"14px",color:isStackTop?"#fb923c":isQueueFront?"#34d399":isQueueRear?"#a78bfa":isDLL(selectedPathAlgo)&&isFirst?"#22d3ee":isDLL(selectedPathAlgo)&&isLast?"#fbbf24":"transparent",textShadow:isStackTop?"0 0 8px rgba(249,115,22,0.6)":(isQueueFront||isQueueRear)?"0 0 8px rgba(255,255,255,0.2)":isDLL(selectedPathAlgo)&&(isFirst||isLast)?"0 0 8px rgba(255,255,255,0.2)":"none"}}>
                                {isStackTop?"▲ TOP":isQueueFront?"FRONT ▶":isQueueRear?"◀ REAR":isDLL(selectedPathAlgo)&&isFirst?"◆ HEAD":isDLL(selectedPathAlgo)&&isLast?"TAIL ◆":""}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    <div className="flex items-end justify-center gap-[3px] w-full" style={{height:"290px"}}>
                      {array.map((val,idx)=>{
                        const bgColor=getBarColor(idx),isPivot=pivotIndex===idx,isSwap=swappingIndices.includes(idx),isCmp=comparingIndices.includes(idx),isSortd=sortedIndices.includes(idx);
                        return (
                          <div key={idx} className="relative flex flex-col items-center" style={{height:"290px",justifyContent:"flex-end"}}>
                            {isPivot&&<Pin size={12} className="text-yellow-400 absolute animate-bounce" style={{bottom:val+5}}/>}
                            <div style={{height:`${val}px`,width:`${Math.max(10,Math.floor(470/arraySize))}px`,backgroundColor:bgColor,borderRadius:"4px 4px 0 0",transition:"height 0.08s ease,background-color 0.08s ease",boxShadow:isPivot?"0 0 14px rgba(234,179,8,0.55)":isSwap?"0 0 10px rgba(168,85,247,0.45)":isCmp?"0 0 8px rgba(239,68,68,0.4)":isSortd?"0 0 6px rgba(34,197,94,0.3)":"none"}}/>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {showCode&&ALGO_INFO[activeAlgo]?.code&&(
                  <div className="mt-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-sm">
                    <div className="flex items-center gap-2 mb-3 text-slate-500 border-b border-slate-800 pb-2"><Code2 size={14}/><span className="text-[11px] uppercase tracking-widest">Pseudo Code</span></div>
                    <pre className="text-blue-300 leading-relaxed whitespace-pre-wrap text-[13px]">{ALGO_INFO[activeAlgo]?.code}</pre>
                  </div>
                )}

                {selectedAlgo && <StepDetailPanel algo={selectedAlgo} steps={sortSteps}/>}
                {selectedPathAlgo && <DSStepLog algo={selectedPathAlgo} log={dsLog}/>}
              </div>
            </div>

            {/* ══ SIDEBAR PANEL ══ */}
            <div className={isTG(activeAlgo)?"lg:col-span-2":""}>
              <div className="bg-[#0b0e17] p-7 rounded-[2rem] border border-slate-800 shadow-2xl space-y-6 sticky top-28">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {isTG(activeAlgo)?(isTreeAlgo(activeAlgo)?"Tree Editor":"Graph Editor"):"Controls"}
                </h3>

                {isTreeAlgo(activeAlgo) ? <TreeVisualizer algo={activeAlgo}/>
                : isGraphAlgo(activeAlgo) ? <GraphVisualizer algo={activeAlgo}/>

                : selectedPathAlgo ? (
                  <div className="space-y-3">
                    {selectedPathAlgo==="Stack"&&<input type="text" value={stackInput} onChange={e=>setStackInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleDSUpdate("add")} placeholder="Stack value…" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-orange-500 text-slate-200 placeholder-slate-600"/>}
                    {selectedPathAlgo==="Queue"&&<input type="text" value={queueInput} onChange={e=>setQueueInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleDSUpdate("add")} placeholder="Queue value…" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-emerald-500 text-slate-200 placeholder-slate-600"/>}
                    {selectedPathAlgo==="Linked List"&&<input type="text" value={llInput} onChange={e=>setLlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleDSUpdate("add")} placeholder="Node value…" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-blue-500 text-slate-200 placeholder-slate-600"/>}
                    {selectedPathAlgo==="Double Linked List"&&<input type="text" value={dllInput} onChange={e=>setDllInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleDSUpdate("add")} placeholder="DLL node value…" className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-cyan-500 text-slate-200 placeholder-slate-600"/>}
                    {isDLL(selectedPathAlgo)&&(
                      <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/40 space-y-1.5">
                        <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2">Pointer Legend</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400"><span style={{color:"#60a5fa",fontSize:"14px",fontWeight:"900"}}>→</span><span>next (blue)</span></div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400"><span style={{color:"#f472b6",fontSize:"14px",fontWeight:"900"}}>←</span><span>prev (pink)</span></div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400"><span className="w-3 h-3 rounded-sm inline-block" style={{background:"linear-gradient(135deg,#06b6d4,#0891b2)"}}/><span>HEAD (cyan)</span></div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400"><span className="w-3 h-3 rounded-sm inline-block" style={{background:"linear-gradient(135deg,#f59e0b,#d97706)"}}/><span>TAIL (amber)</span></div>
                      </div>
                    )}
                    <button onClick={()=>handleDSUpdate("add")} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition active:scale-95"><Plus size={16}/> Insert Node</button>
                    <button onClick={()=>handleDSUpdate("remove")} className="w-full border border-red-500/25 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-red-500/10 transition"><Trash2 size={16}/> Delete Node</button>
                    <button onClick={()=>{setDsData([]);setDsLog([]);}} className="w-full border border-slate-700 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800 text-sm transition"><RotateCcw size={16}/> Reset</button>
                  </div>

                ) : (
                  /* ── SORTING CONTROLS ── */
                  <div className="space-y-5">

                    {/* ✅ NEW: Custom Array Input */}
                    <div className="bg-[#0f1320] rounded-2xl border border-slate-700/40 p-4 space-y-2">
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">নিজে Array দিন</p>
                      <p className="text-[10px] text-slate-600">Comma দিয়ে সংখ্যা লিখুন, যেমন: 45, 12, 78, 33</p>
                      {/* input + button একই border-এ */}
                      <div className={`flex items-center bg-slate-900 border rounded-xl overflow-hidden transition ${customInputErr ? "border-red-500/60" : "border-slate-700 focus-within:border-blue-500/70"}`}>
                        <input
                          type="text"
                          value={customInput}
                          onChange={e => { setCustomInput(e.target.value); setCustomInputErr(""); }}
                          onKeyDown={e => e.key === "Enter" && applyCustomArray()}
                          placeholder="45, 12, 78, 33, 5…"
                          disabled={isSorting}
                          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none text-slate-200 placeholder-slate-600 disabled:opacity-40"
                        />
                        <button
                          onClick={applyCustomArray}
                          disabled={isSorting || !customInput.trim()}
                          className="h-full px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-bold tracking-wide border-l border-slate-700 transition active:scale-95 flex-shrink-0"
                        >
                          Set
                        </button>
                      </div>
                      {customInputErr && (
                        <p className="text-[11px] text-red-400">{customInputErr}</p>
                      )}
                      {useCustomArray && !customInputErr && (
                        <p className="text-[11px] text-emerald-400">✓ Custom array set — {array.length}টি সংখ্যা</p>
                      )}
                    </div>

                    {!isSorting?(
                      <button onClick={handleSort} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-900/30 transition active:scale-95"><Play size={18} fill="currentColor"/> Visualize</button>
                    ):(
                      <button onClick={handleStop} className="w-full bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition active:scale-95"><span>■</span> Stop</button>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide"><span>Speed</span><span>{speed}%</span></div>
                      <input type="range" min="10" max="100" value={speed} onChange={e=>setSpeed(Number(e.target.value))} disabled={isSorting} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-40"/>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        <span>Array Size</span>
                        <span>{useCustomArray ? `${array.length} (custom)` : arraySize}</span>
                      </div>
                      <input type="range" min="5" max="30" value={useCustomArray ? array.length : arraySize}
                        onChange={e=>{ setArraySize(Number(e.target.value)); setUseCustomArray(false); setCustomInput(""); }}
                        disabled={isSorting||useCustomArray}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-40"/>
                      {useCustomArray && <p className="text-[10px] text-slate-600">Custom array ব্যবহারে size slider disabled</p>}
                    </div>
                    <button onClick={resetArray} disabled={isSorting} className="w-full bg-slate-800/50 hover:bg-slate-800 py-3 rounded-xl text-[11px] font-bold uppercase text-slate-300 flex items-center justify-center gap-2 border border-slate-700/50 transition disabled:opacity-40"><RefreshCw size={14}/> Generate New Array</button>
                    <button onClick={()=>{handleStop();setTimeout(resetArray,60);}} className="w-full border border-slate-700 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800 text-sm transition"><RotateCcw size={16}/> Reset</button>
                  </div>
                )}
              </div>
            </div>

          </div>
        ):<Home/>}
      </main>

      {/* ════════ FLOATING CHATBOT ════════ */}
      {/* Chat panel */}
      <ChatBot isOpen={showChat} onClose={() => setShowChat(false)} activeAlgo={activeAlgo} />

      {/* Floating bubble button */}
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

      <style>{`
        @keyframes dsIn {
          from{opacity:0;transform:scale(0.65) translateY(8px);}
          to{opacity:1;transform:scale(1) translateY(0);}
        }
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px;}
      `}</style>
      <Footer/>
    </div>
  );
};

export default Visualizer;