import React from 'react';
import { Zap, Code2, ChevronDown, Bot, Search } from 'lucide-react';

const Header = ({
  selectedAlgo,        setSelectedAlgo,
  selectedPathAlgo,    setSelectedPathAlgo,
  selectedGraphAlgo,   setSelectedGraphAlgo,
  selectedSearchAlgo,  setSelectedSearchAlgo,  // ← নতুন
  showCode,            setShowCode,
  showChat,            setShowChat,
}) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060913]/90 backdrop-blur-xl border-b border-slate-800/60 py-4 px-6 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setSelectedAlgo("");
            setSelectedPathAlgo("");
            setSelectedGraphAlgo("");
            setSelectedSearchAlgo("");
          }}
        >
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Zap size={22} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
              Code <span className="text-slate-500 font-medium">Visualizer</span>
            </h1>
            <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold mt-1.5 transition-colors group-hover:text-blue-400">
              Sorting, Searching, DS & Graphs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">

          {/* ── Sorting ── */}
          <div className="relative group">
            <select
              value={selectedAlgo}
              onChange={e => {
                setSelectedAlgo(e.target.value);
                setSelectedPathAlgo("");
                setSelectedGraphAlgo("");
                setSelectedSearchAlgo("");
              }}
              className="appearance-none bg-slate-900/80 border border-slate-700/50 px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 hover:border-blue-500/40 transition-all focus:border-blue-500/50 min-w-[140px]"
            >
              <option value="" disabled hidden>Sorting</option>
              <option value="Bubble Sort">Bubble Sort</option>
              <option value="Quick Sort">Quick Sort</option>
              <option value="Insertion Sort">Insertion Sort</option>
              <option value="Merge Sort">Merge Sort</option>
              <option value="Selection Sort">Selection Sort</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-blue-500" />
          </div>

          {/* ── Searching ── */}
          <div className="relative group">
            <select
              value={selectedSearchAlgo}
              onChange={e => {
                setSelectedSearchAlgo(e.target.value);
                setSelectedAlgo("");
                setSelectedPathAlgo("");
                setSelectedGraphAlgo("");
              }}
              className="appearance-none bg-slate-900/80 border border-amber-700/40 px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 hover:border-amber-500/60 transition-all focus:border-amber-500/70 min-w-[148px]"
            >
              <option value="" disabled hidden>🔍 Searching</option>
              <option value="Linear Search">Linear Search</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Jump Search">Jump Search</option>
              <option value="Fibonacci Search">Fibonacci Search</option>
              <option value="Interpolation Search">Interpolation Search</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-amber-500" />
          </div>

          {/* ── Data Structure ── */}
          <div className="relative group">
            <select
              value={selectedPathAlgo}
              onChange={e => {
                setSelectedPathAlgo(e.target.value);
                setSelectedAlgo("");
                setSelectedGraphAlgo("");
                setSelectedSearchAlgo("");
              }}
              className="appearance-none bg-slate-900/80 border border-slate-700/50 px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 hover:border-green-500/40 transition-all focus:border-green-500/50 min-w-[148px]"
            >
              <option value="" disabled hidden>Data Structure</option>
              <option value="Stack">Stack (LIFO)</option>
              <option value="Queue">Queue (FIFO)</option>
              <option value="Linked List">Linked List</option>
              <option value="Double Linked List">Double Linked List</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-green-500" />
          </div>

          {/* ── Tree / Graph ── */}
          <div className="relative group">
            <select
              value={selectedGraphAlgo}
              onChange={e => {
                setSelectedGraphAlgo(e.target.value);
                setSelectedAlgo("");
                setSelectedPathAlgo("");
                setSelectedSearchAlgo("");
              }}
              className="appearance-none bg-slate-900/80 border border-purple-700/40 px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 hover:border-purple-500/60 transition-all focus:border-purple-500/70 min-w-[160px]"
            >
              <option value="" disabled hidden>Tree / Graph</option>
              <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Tree ──</option>
              <option value="Tree BFS">  Tree BFS (Level Order)</option>
              <option value="Tree DFS">  Tree DFS (Pre-order)</option>
              <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Graph ──</option>
              <option value="Graph BFS">  Graph BFS</option>
              <option value="Graph DFS">  Graph DFS</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-purple-500" />
          </div>

          {/* ── Code toggle ── */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              showCode
                ? "bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-white hover:border-slate-500"
            }`}
          >
            <Code2 size={19} />
          </button>

          {/* ── AI Chat toggle ── */}
          <button
            onClick={() => setShowChat && setShowChat(prev => !prev)}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              showChat
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50"
            }`}
            title="AI Assistant"
          >
            <Bot size={19} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;