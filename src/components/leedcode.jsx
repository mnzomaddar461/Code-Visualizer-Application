import React, { useState, useMemo } from 'react';
import { LEETCODE_PROBLEMS, CATEGORIES, DIFFICULTIES } from './leetcodeData';
import { ExternalLink, Search, Tag, BarChart2, Filter } from 'lucide-react';

const diffColor = {
  Easy:   { bg:"bg-green-900/40",  border:"border-green-500/30",  text:"text-green-400"  },
  Medium: { bg:"bg-amber-900/40",  border:"border-amber-500/30",  text:"text-amber-400"  },
  Hard:   { bg:"bg-red-900/40",    border:"border-red-500/30",    text:"text-red-400"    },
};

const categoryColor = {
  Array:            "bg-blue-900/30 text-blue-400",
  String:           "bg-violet-900/30 text-violet-400",
  "Linked List":    "bg-cyan-900/30 text-cyan-400",
  Stack:            "bg-orange-900/30 text-orange-400",
  "Binary Search":  "bg-sky-900/30 text-sky-400",
  "Sliding Window": "bg-teal-900/30 text-teal-400",
  Tree:             "bg-emerald-900/30 text-emerald-400",
  Graph:            "bg-purple-900/30 text-purple-400",
  DP:               "bg-pink-900/30 text-pink-400",
  Heap:             "bg-rose-900/30 text-rose-400",
  Backtracking:     "bg-indigo-900/30 text-indigo-400",
  "Bit Manipulation":"bg-yellow-900/30 text-yellow-400",
};

const LeetCode = () => {
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filtered = useMemo(() => {
    return LEETCODE_PROBLEMS.filter(p => {
      const matchCat  = category   === "All" || p.category   === category;
      const matchDiff = difficulty === "All" || p.difficulty === difficulty;
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchDiff && matchSearch;
    });
  }, [search, category, difficulty]);

  const counts = useMemo(() => ({
    Easy:   LEETCODE_PROBLEMS.filter(p => p.difficulty === "Easy").length,
    Medium: LEETCODE_PROBLEMS.filter(p => p.difficulty === "Medium").length,
    Hard:   LEETCODE_PROBLEMS.filter(p => p.difficulty === "Hard").length,
  }), []);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            <BarChart2 size={13}/> LeetCode Top 100
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            Top <span className="text-orange-400">100</span> Problems
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Must-solve problems for coding interviews — sorted by category with difficulty filters.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-4 mt-6">
            {Object.entries(counts).map(([diff, cnt]) => (
              <div key={diff} className={`${diffColor[diff].bg} ${diffColor[diff].border} border rounded-2xl px-5 py-3 text-center`}>
                <p className={`text-2xl font-extrabold ${diffColor[diff].text}`}>{cnt}</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">{diff}</p>
              </div>
            ))}
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl px-5 py-3 text-center">
              <p className="text-2xl font-extrabold text-slate-300">{LEETCODE_PROBLEMS.length}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">Total</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 p-4 sm:p-5 mb-8 space-y-4">

          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or tag…"
              className="w-full bg-slate-900/80 border border-slate-700/50 pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-orange-500/50 text-slate-200 placeholder-slate-600 transition"
            />
          </div>

          {/* Difficulty filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold flex items-center gap-1 mr-1"><Filter size={10}/> Difficulty</span>
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  difficulty === d
                    ? d === "Easy"   ? "bg-green-500/20 border-green-500 text-green-400"
                    : d === "Medium" ? "bg-amber-500/20 border-amber-500 text-amber-400"
                    : d === "Hard"   ? "bg-red-500/20 border-red-500 text-red-400"
                    : "bg-slate-700 border-slate-500 text-white"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-500"
                }`}>
                {d}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold flex items-center gap-1 mr-1"><Tag size={10}/> Category</span>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  category === c
                    ? "bg-orange-500/20 border-orange-500 text-orange-400"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-400 hover:border-slate-500"
                }`}>
                {c}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-600">{filtered.length} problems found</p>
        </div>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <p className="text-4xl mb-3">🔍</p>
            <p>No problems match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => {
              const dc = diffColor[p.difficulty];
              const cc = categoryColor[p.category] ?? "bg-slate-800/40 text-slate-400";
              return (
                <a
                  key={p.id}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-[#0b0e17] border border-slate-800/60 rounded-2xl p-5 flex flex-col gap-3 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-900/10 transition-all duration-200 active:scale-[0.98]"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-600 font-mono">#{p.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${dc.bg} ${dc.border} ${dc.text}`}>
                      {p.difficulty}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-bold text-slate-200 group-hover:text-orange-300 transition-colors leading-snug flex-1">
                    {p.title}
                  </p>

                  {/* Category */}
                  <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-lg ${cc}`}>
                    {p.category}
                  </span>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-800/60 text-slate-500 px-2 py-0.5 rounded-md border border-slate-700/40">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 group-hover:text-orange-400 transition-colors mt-auto pt-1 border-t border-slate-800/40">
                    <ExternalLink size={11}/>
                    <span>Solve on LeetCode</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeetCode;