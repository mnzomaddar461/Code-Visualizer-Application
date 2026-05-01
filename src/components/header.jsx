import React, { useState } from 'react';
import { Zap, Code2, ChevronDown, Bot, Menu, X, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  selectedAlgo,         setSelectedAlgo,
  selectedPathAlgo,     setSelectedPathAlgo,
  selectedGraphAlgo,    setSelectedGraphAlgo,
  selectedSearchAlgo,   setSelectedSearchAlgo,
  showCode,             setShowCode,
  showChat,             setShowChat,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const resetAll = () => {
    setSelectedAlgo(""); setSelectedPathAlgo("");
    setSelectedGraphAlgo(""); setSelectedSearchAlgo("");
  };

  const handleSorting   = (val) => { setSelectedAlgo(val); setSelectedPathAlgo(""); setSelectedGraphAlgo(""); setSelectedSearchAlgo(""); setMenuOpen(false); navigate("/"); };
  const handleSearching = (val) => { setSelectedSearchAlgo(val); setSelectedAlgo(""); setSelectedPathAlgo(""); setSelectedGraphAlgo(""); setMenuOpen(false); navigate("/"); };
  const handleDS        = (val) => { setSelectedPathAlgo(val); setSelectedAlgo(""); setSelectedGraphAlgo(""); setSelectedSearchAlgo(""); setMenuOpen(false); navigate("/"); };
  const handleGraph     = (val) => { setSelectedGraphAlgo(val); setSelectedAlgo(""); setSelectedPathAlgo(""); setSelectedSearchAlgo(""); setMenuOpen(false); navigate("/"); };

  const handleResources = (val) => {
    if (!val) return;
    setMenuOpen(false);
    /* App.jsx এর route এর সাথে মিলিয়ে দেওয়া হয়েছে */
    if      (val === "leetcode-150") navigate("/leetcode-150");
    else if (val === "c-roadmap")    navigate("/c-roadmap");
    else if (val === "cpp-roadmap")  navigate("/cpp-roadmap");
  };

  /* ── Reusable selects ── */
  const DesktopSelect = ({ value, onChange, borderCls, hoverCls, focusCls, chevronCls, placeholder, minW = "min-w-[110px]", children }) => (
    <div className="relative group flex-shrink-0">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`appearance-none bg-slate-900/80 border ${borderCls} px-3 py-2 pr-8 rounded-xl text-[11px] font-semibold outline-none cursor-pointer text-slate-300 ${hoverCls} transition-all ${focusCls} ${minW}`}>
        <option value="" disabled hidden>{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={12} className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none ${chevronCls}`} />
    </div>
  );

  const MobileSelect = ({ value, onChange, borderCls, focusCls, placeholder, children }) => (
    <div className="relative w-full">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`appearance-none w-full bg-slate-900/60 border ${borderCls} px-4 py-3 pr-9 rounded-xl text-sm font-semibold outline-none cursor-pointer text-slate-300 ${focusCls} transition-all`}>
        <option value="" disabled hidden>{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060913]/95 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl">

      {/* ══ TOP BAR ══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3.5 flex justify-between items-center gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          onClick={() => { resetAll(); setMenuOpen(false); navigate("/"); }}>
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Zap size={20} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-none">
              Code <span className="text-slate-500 font-medium">Visualizer</span>
            </h1>
            <p className="hidden sm:block text-slate-600 text-[8px] uppercase tracking-widest font-bold mt-1 group-hover:text-blue-400 transition-colors">
              Sorting · Searching · DS · Graphs
            </p>
          </div>
        </div>

        {/* ══ DESKTOP (xl+) ══ */}
        <div className="hidden xl:flex items-center gap-2 flex-wrap justify-end">
          <DesktopSelect value={selectedAlgo} onChange={handleSorting}
            borderCls="border-slate-700/50" hoverCls="hover:border-blue-500/40"
            focusCls="focus:border-blue-500/50" chevronCls="group-hover:text-blue-500"
            placeholder="Sorting">
            <option value="Bubble Sort">Bubble Sort</option>
            <option value="Quick Sort">Quick Sort</option>
            <option value="Insertion Sort">Insertion Sort</option>
            <option value="Merge Sort">Merge Sort</option>
            <option value="Selection Sort">Selection Sort</option>
          </DesktopSelect>

          <DesktopSelect value={selectedSearchAlgo} onChange={handleSearching}
            borderCls="border-amber-700/40" hoverCls="hover:border-amber-500/60"
            focusCls="focus:border-amber-500/70" chevronCls="group-hover:text-amber-500"
            placeholder="Searching">
            <option value="Linear Search">Linear Search</option>
            <option value="Binary Search">Binary Search</option>
            <option value="Jump Search">Jump Search</option>
            <option value="Fibonacci Search">Fibonacci Search</option>
            <option value="Interpolation Search">Interpolation Search</option>
          </DesktopSelect>

          <DesktopSelect value={selectedPathAlgo} onChange={handleDS}
            borderCls="border-slate-700/50" hoverCls="hover:border-green-500/40"
            focusCls="focus:border-green-500/50" chevronCls="group-hover:text-green-500"
            placeholder="Data Structure" minW="min-w-[120px]">
            <option value="Stack">Stack (LIFO)</option>
            <option value="Queue">Queue (FIFO)</option>
            <option value="Linked List">Linked List</option>
            <option value="Double Linked List">Double Linked List</option>
          </DesktopSelect>

          <DesktopSelect value={selectedGraphAlgo} onChange={handleGraph}
            borderCls="border-purple-700/40" hoverCls="hover:border-purple-500/60"
            focusCls="focus:border-purple-500/70" chevronCls="group-hover:text-purple-500"
            placeholder="Tree / Graph" minW="min-w-[115px]">
            <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Tree ──</option>
            <option value="Tree BFS">Tree BFS</option>
            <option value="Tree DFS">Tree DFS</option>
            <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Graph ──</option>
            <option value="Graph BFS">Graph BFS</option>
            <option value="Graph DFS">Graph DFS</option>
          </DesktopSelect>

          {/* Resources */}
          <div className="relative group flex-shrink-0">
            <select onChange={e => handleResources(e.target.value)} value=""
              className="appearance-none bg-blue-500/10 border border-blue-500/30 px-3 py-2 pr-8 rounded-xl text-[11px] font-bold outline-none cursor-pointer text-blue-400 hover:bg-blue-500/20 transition-all focus:border-blue-500 min-w-[105px]">
              <option value="" disabled hidden>Resources</option>
              <option value="leetcode-150" className="bg-[#060913] text-white">LeetCode</option>
              <option value="c-roadmap"    className="bg-[#060913] text-white">C Roadmap</option>
              <option value="cpp-roadmap"  className="bg-[#060913] text-white">C++ Roadmap</option>
            </select>
            <BookOpen size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-slate-700/50 mx-0.5" />

          <button onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-xl border transition-all duration-300 flex-shrink-0 ${showCode ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-white hover:border-slate-500"}`}>
            <Code2 size={17} />
          </button>
          <button onClick={() => setShowChat && setShowChat(p => !p)}
            className={`p-2 rounded-xl border transition-all duration-300 flex-shrink-0 ${showChat ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/50"}`}
            title="AI Assistant">
            <Bot size={17} />
          </button>
        </div>

        {/* ══ TABLET (md–xl) ══ */}
        <div className="hidden md:flex xl:hidden items-center gap-2">
          <div className="relative group">
            <select value={selectedAlgo || ""} onChange={e => handleSorting(e.target.value)}
              className="appearance-none bg-slate-900/80 border border-slate-700/50 px-3 py-2 pr-8 rounded-xl text-[11px] font-semibold outline-none cursor-pointer text-slate-300 hover:border-blue-500/40 transition-all min-w-[100px]">
              <option value="" disabled hidden>Sorting</option>
              <option value="Bubble Sort">Bubble Sort</option>
              <option value="Quick Sort">Quick Sort</option>
              <option value="Insertion Sort">Insertion Sort</option>
              <option value="Merge Sort">Merge Sort</option>
              <option value="Selection Sort">Selection Sort</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <div className="relative group">
            <select value={selectedSearchAlgo || ""} onChange={e => handleSearching(e.target.value)}
              className="appearance-none bg-slate-900/80 border border-amber-700/40 px-3 py-2 pr-8 rounded-xl text-[11px] font-semibold outline-none cursor-pointer text-slate-300 hover:border-amber-500/60 transition-all min-w-[100px]">
              <option value="" disabled hidden>Searching</option>
              <option value="Linear Search">Linear Search</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Jump Search">Jump Search</option>
              <option value="Fibonacci Search">Fibonacci Search</option>
              <option value="Interpolation Search">Interpolation Search</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <button onClick={() => setMenuOpen(p => !p)}
            className={`p-2 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 flex-shrink-0 ${menuOpen ? "border-blue-500 text-blue-400 bg-blue-500/10" : "border-slate-700 text-slate-400 bg-slate-800/60 hover:text-white"}`}>
            <Menu size={15} />
            <span className="text-[10px]">More</span>
          </button>

          <div className="w-px h-5 bg-slate-700/50" />

          <button onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-xl border transition-all flex-shrink-0 ${showCode ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-white"}`}>
            <Code2 size={16} />
          </button>
          <button onClick={() => setShowChat && setShowChat(p => !p)}
            className={`p-2 rounded-xl border transition-all flex-shrink-0 ${showChat ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800/60 border-slate-700 text-slate-500 hover:text-emerald-400"}`}>
            <Bot size={16} />
          </button>
        </div>

        {/* ══ MOBILE ══ */}
        <div className="flex md:hidden items-center gap-1.5">
          <button onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-xl border transition-all ${showCode ? "bg-blue-500/20 border-blue-500 text-blue-400" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
            <Code2 size={16} />
          </button>
          <button onClick={() => setShowChat && setShowChat(p => !p)}
            className={`p-2 rounded-xl border transition-all ${showChat ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800/60 border-slate-700 text-slate-500"}`}>
            <Bot size={16} />
          </button>
          <button onClick={() => setMenuOpen(p => !p)}
            className={`p-2 rounded-xl border transition-all ${menuOpen ? "border-blue-500 text-blue-400 bg-blue-500/10" : "border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white"}`}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ══ DROPDOWN MENU ══ */}
      {menuOpen && (
        <div className="border-t border-slate-800/60 bg-[#060913]/98 backdrop-blur-xl px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="max-w-lg mx-auto space-y-3">

            {/* Resources */}
            <div>
              <p className="text-[9px] uppercase tracking-widest text-blue-400 font-bold mb-2 px-1 flex items-center gap-1.5">
                <BookOpen size={10} /> Learning Resources
              </p>
              <MobileSelect value="" onChange={handleResources}
                borderCls="border-blue-500/30" focusCls="focus:border-blue-500"
                placeholder="📚 Select Resource">
                <option value="leetcode-150">🔥 LeetCode Problems (100)</option>
                <option value="c-roadmap">🅒 C Language Roadmap</option>
                <option value="cpp-roadmap">⚡ C++ Roadmap</option>
              </MobileSelect>
            </div>

            {/* Mobile only — Sorting */}
            <div className="md:hidden">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">Sorting</p>
              <MobileSelect value={selectedAlgo} onChange={handleSorting}
                borderCls="border-slate-700/50" focusCls="focus:border-blue-500/50"
                placeholder="Select Sorting">
                <option value="Bubble Sort">Bubble Sort</option>
                <option value="Quick Sort">Quick Sort</option>
                <option value="Insertion Sort">Insertion Sort</option>
                <option value="Merge Sort">Merge Sort</option>
                <option value="Selection Sort">Selection Sort</option>
              </MobileSelect>
            </div>

            {/* Mobile only — Searching */}
            <div className="md:hidden">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">Searching</p>
              <MobileSelect value={selectedSearchAlgo} onChange={handleSearching}
                borderCls="border-amber-700/40" focusCls="focus:border-amber-500/70"
                placeholder="Select Searching">
                <option value="Linear Search">Linear Search</option>
                <option value="Binary Search">Binary Search</option>
                <option value="Jump Search">Jump Search</option>
                <option value="Fibonacci Search">Fibonacci Search</option>
                <option value="Interpolation Search">Interpolation Search</option>
              </MobileSelect>
            </div>

            {/* DS */}
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">Data Structure</p>
              <MobileSelect value={selectedPathAlgo} onChange={handleDS}
                borderCls="border-slate-700/50" focusCls="focus:border-green-500/50"
                placeholder="Select Data Structure">
                <option value="Stack">Stack (LIFO)</option>
                <option value="Queue">Queue (FIFO)</option>
                <option value="Linked List">Linked List</option>
                <option value="Double Linked List">Double Linked List</option>
              </MobileSelect>
            </div>

            {/* Tree/Graph */}
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2 px-1">Tree / Graph</p>
              <MobileSelect value={selectedGraphAlgo} onChange={handleGraph}
                borderCls="border-purple-700/40" focusCls="focus:border-purple-500/70"
                placeholder="Select Tree / Graph">
                <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Tree ──</option>
                <option value="Tree BFS">Tree BFS (Level Order)</option>
                <option value="Tree DFS">Tree DFS (Pre-order)</option>
                <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Graph ──</option>
                <option value="Graph BFS">Graph BFS</option>
                <option value="Graph DFS">Graph DFS</option>
              </MobileSelect>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;