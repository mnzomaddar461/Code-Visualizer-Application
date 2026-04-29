import React, { useState } from 'react';
import { Zap, Code2, ChevronDown, Bot, Menu, X } from 'lucide-react';

const Header = ({
  selectedAlgo,        setSelectedAlgo,
  selectedPathAlgo,    setSelectedPathAlgo,
  selectedGraphAlgo,   setSelectedGraphAlgo,
  selectedSearchAlgo,  setSelectedSearchAlgo,
  showCode,            setShowCode,
  showChat,            setShowChat,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const resetAll = () => {
    setSelectedAlgo("");
    setSelectedPathAlgo("");
    setSelectedGraphAlgo("");
    setSelectedSearchAlgo("");
  };

  const handleSorting = (val) => {
    setSelectedAlgo(val);
    setSelectedPathAlgo("");
    setSelectedGraphAlgo("");
    setSelectedSearchAlgo("");
    setMenuOpen(false);
  };

  const handleSearching = (val) => {
    setSelectedSearchAlgo(val);
    setSelectedAlgo("");
    setSelectedPathAlgo("");
    setSelectedGraphAlgo("");
    setMenuOpen(false);
  };

  const handleDS = (val) => {
    setSelectedPathAlgo(val);
    setSelectedAlgo("");
    setSelectedGraphAlgo("");
    setSelectedSearchAlgo("");
    setMenuOpen(false);
  };

  const handleGraph = (val) => {
    setSelectedGraphAlgo(val);
    setSelectedAlgo("");
    setSelectedPathAlgo("");
    setSelectedSearchAlgo("");
    setMenuOpen(false);
  };

  /* reusable select for mobile menu */
  const MobileSelect = ({ value, onChange, borderColor, hoverColor, focusColor, placeholder, chevronColor, children }) => (
    <div className="relative group w-full">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`appearance-none w-full bg-slate-900/80 border ${borderColor} px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 ${hoverColor} transition-all ${focusColor}`}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {children}
      </select>
      <ChevronDown size={13} className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none ${chevronColor}`} />
    </div>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060913]/90 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl transition-all duration-300">

      {/* ── Top bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          onClick={() => { resetAll(); setMenuOpen(false); }}
        >
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Zap size={22} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-none">
              Code <span className="text-slate-500 font-medium">Visualizer</span>
            </h1>
            <p className="hidden sm:block text-slate-600 text-[9px] uppercase tracking-widest font-bold mt-1.5 transition-colors group-hover:text-blue-400">
              Sorting, Searching, DS & Graphs
            </p>
          </div>
        </div>

        {/* ── Desktop nav (lg+) ── */}
        <div className="hidden lg:flex items-center gap-2.5">

          {/* Sorting */}
          <div className="relative group">
            <select
              value={selectedAlgo}
              onChange={e => handleSorting(e.target.value)}
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

          {/* Searching */}
          <div className="relative group">
            <select
              value={selectedSearchAlgo}
              onChange={e => handleSearching(e.target.value)}
              className="appearance-none bg-slate-900/80 border border-amber-700/40 px-4 py-2.5 pr-9 rounded-xl text-xs font-semibold outline-none cursor-pointer text-slate-300 hover:border-amber-500/60 transition-all focus:border-amber-500/70 min-w-[148px]"
            >
              <option value="" disabled hidden>Searching</option>
              <option value="Linear Search">Linear Search</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Jump Search">Jump Search</option>
              <option value="Fibonacci Search">Fibonacci Search</option>
              <option value="Interpolation Search">Interpolation Search</option>
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover:text-amber-500" />
          </div>

          {/* Data Structure */}
          <div className="relative group">
            <select
              value={selectedPathAlgo}
              onChange={e => handleDS(e.target.value)}
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

          {/* Tree / Graph */}
          <div className="relative group">
            <select
              value={selectedGraphAlgo}
              onChange={e => handleGraph(e.target.value)}
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

          {/* Code toggle */}
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

          {/* AI Chat toggle */}
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

        {/* ── Mobile right: icon buttons + hamburger ── */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setShowCode(!showCode)}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              showCode
                ? "bg-blue-500/20 border-blue-500 text-blue-400"
                : "bg-slate-800/60 border-slate-700 text-slate-500"
            }`}
          >
            <Code2 size={17} />
          </button>
          <button
            onClick={() => setShowChat && setShowChat(prev => !prev)}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              showChat
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-slate-800/60 border-slate-700 text-slate-500"
            }`}
          >
            <Bot size={17} />
          </button>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-white transition-all"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-800/60 bg-[#060913]/98 px-4 py-5 space-y-4">

          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 px-1">Sorting</p>
            <MobileSelect
              value={selectedAlgo} onChange={handleSorting}
              borderColor="border-slate-700/50" hoverColor="hover:border-blue-500/40"
              focusColor="focus:border-blue-500/50" placeholder="Sorting"
              chevronColor="group-hover:text-blue-500"
            >
              <option value="Bubble Sort">Bubble Sort</option>
              <option value="Quick Sort">Quick Sort</option>
              <option value="Insertion Sort">Insertion Sort</option>
              <option value="Merge Sort">Merge Sort</option>
              <option value="Selection Sort">Selection Sort</option>
            </MobileSelect>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 px-1">Searching</p>
            <MobileSelect
              value={selectedSearchAlgo} onChange={handleSearching}
              borderColor="border-amber-700/40" hoverColor="hover:border-amber-500/60"
              focusColor="focus:border-amber-500/70" placeholder="Searching"
              chevronColor="group-hover:text-amber-500"
            >
              <option value="Linear Search">Linear Search</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Jump Search">Jump Search</option>
              <option value="Fibonacci Search">Fibonacci Search</option>
              <option value="Interpolation Search">Interpolation Search</option>
            </MobileSelect>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 px-1">Data Structure</p>
            <MobileSelect
              value={selectedPathAlgo} onChange={handleDS}
              borderColor="border-slate-700/50" hoverColor="hover:border-green-500/40"
              focusColor="focus:border-green-500/50" placeholder="Data Structure"
              chevronColor="group-hover:text-green-500"
            >
              <option value="Stack">Stack (LIFO)</option>
              <option value="Queue">Queue (FIFO)</option>
              <option value="Linked List">Linked List</option>
              <option value="Double Linked List">Double Linked List</option>
            </MobileSelect>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-widest text-slate-600 font-bold mb-1.5 px-1">Tree / Graph</p>
            <MobileSelect
              value={selectedGraphAlgo} onChange={handleGraph}
              borderColor="border-purple-700/40" hoverColor="hover:border-purple-500/60"
              focusColor="focus:border-purple-500/70" placeholder="Tree / Graph"
              chevronColor="group-hover:text-purple-500"
            >
              <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Tree ──</option>
              <option value="Tree BFS">Tree BFS (Level Order)</option>
              <option value="Tree DFS">Tree DFS (Pre-order)</option>
              <option disabled style={{ color:"#6366f1", fontWeight:700 }}>── Graph ──</option>
              <option value="Graph BFS">Graph BFS</option>
              <option value="Graph DFS">Graph DFS</option>
            </MobileSelect>
          </div>

        </div>
      )}

    </header>
  );
};

export default Header;