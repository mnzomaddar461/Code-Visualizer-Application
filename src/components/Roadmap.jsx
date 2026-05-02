import React, { useState } from 'react';
import ResourcesHub from './ResourcesHub';
import {
  CheckCircle, ChevronRight, RotateCcw, ChevronUp, Sparkles,
  // Chapter icons — professional Lucide replacements
  Rocket, Package, Zap, GitBranch, RefreshCw, Puzzle,
  LayoutList, Pointer, Type, Database, Cpu, Binary,
  // C++ specific
  Code2, Layers, Dna, BookMarked, FlaskConical,
} from 'lucide-react';

/* ── Map chapter id → Lucide icon ── */
const C_ICONS = {
  1: Rocket,      // Introduction
  2: Package,     // Variables & Data Types
  3: Zap,         // Operators
  4: GitBranch,   // Control Flow
  5: RefreshCw,   // Loops
  6: Puzzle,      // Functions
  7: LayoutList,  // Arrays
  8: Pointer,     // Pointers
  9: Type,        // Strings
  10: Database,   // Structures & File I/O
};

const CPP_ICONS = {
  1: Rocket,      // Introduction
  2: Package,     // Variables
  3: Zap,         // Operators
  4: GitBranch,   // Control Flow
  5: RefreshCw,   // Loops
  6: Puzzle,      // Functions
  7: LayoutList,  // Arrays & Vectors
  8: Pointer,     // Pointers & References
  9: Layers,      // OOP Classes
  10: Dna,        // OOP Inheritance
  11: BookMarked, // STL
  12: FlaskConical,// Modern C++
};

const ACCENT = {
  blue: {
    badge:       "bg-blue-500/10 border-blue-500/20 text-blue-400",
    btn:         "bg-blue-600 hover:bg-blue-500 shadow-blue-900/30",
    ring:        "border-blue-500",
    glow:        "shadow-[0_0_18px_rgba(59,130,246,0.25)]",
    progress:    "bg-blue-500",
    tag:         "bg-blue-900/30 text-blue-400",
    correct:     "bg-green-900/40 border-green-500/40 text-green-400",
    wrong:       "bg-red-900/40 border-red-500/40 text-red-400",
    chevron:     "text-blue-400",
    resourceBtn: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] border-0",
    iconBg:      "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  purple: {
    badge:       "bg-purple-500/10 border-purple-500/20 text-purple-400",
    btn:         "bg-purple-600 hover:bg-purple-500 shadow-purple-900/30",
    ring:        "border-purple-500",
    glow:        "shadow-[0_0_18px_rgba(168,85,247,0.25)]",
    progress:    "bg-purple-500",
    tag:         "bg-purple-900/30 text-purple-400",
    correct:     "bg-green-900/40 border-green-500/40 text-green-400",
    wrong:       "bg-red-900/40 border-red-500/40 text-red-400",
    chevron:     "text-purple-400",
    resourceBtn: "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] border-0",
    iconBg:      "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
};

const TheoryBlock = ({ text }) => {
  const parts = text.trim().split(/(```[\s\S]*?```)/g);
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-400">
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const code = part.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-blue-300 text-[13px] overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              {code}
            </pre>
          );
        }
        return (
          <div key={i} className="space-y-1">
            {part.trim().split("\n").map((line, j) => {
              if (line.startsWith("**") && line.endsWith("**"))
                return <p key={j} className="font-bold text-slate-200 mt-3 text-[15px]">{line.replace(/\*\*/g,"")}</p>;
              if (line.startsWith("- "))
                return <p key={j} className="ml-4 before:content-['•'] before:mr-2 before:text-slate-600 text-[15px]">{line.slice(2)}</p>;
              if (line.startsWith("⚠️"))
                return <p key={j} className="bg-amber-900/20 border border-amber-700/30 rounded-lg px-3 py-2 text-amber-400 text-[13px]">{line}</p>;
              if (line.trim() === "") return <div key={j} className="h-1"/>;
              return <p key={j} className="text-[15px]">{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
};

const QuizSection = ({ quiz, ac }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const select = (qi, oi) => { if (!submitted) setAnswers(prev => ({ ...prev, [qi]: oi })); };
  const submit = () => {
    let s = 0;
    quiz.forEach((q, qi) => { if (answers[qi] === q.ans) s++; });
    setScore(s); setSubmitted(true);
  };
  const reset = () => { setAnswers({}); setSubmitted(false); setScore(0); };

  return (
    <div className="space-y-5 mt-2">
      {quiz.map((q, qi) => (
        <div key={qi} className="space-y-2">
          <p className="text-[15px] font-semibold text-slate-300">
            <span className="text-slate-600 font-mono mr-2">{qi+1}.</span>{q.q}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[qi] === oi;
              const isCorrect  = submitted && oi === q.ans;
              const isWrong    = submitted && isSelected && oi !== q.ans;
              return (
                <button key={oi} onClick={() => select(qi, oi)}
                  className={`text-left text-[14px] px-3 py-2.5 rounded-xl border transition-all font-medium ${
                    isCorrect ? `${ac.correct} border` :
                    isWrong   ? `${ac.wrong} border` :
                    isSelected ? `bg-slate-700/60 ${ac.ring} border text-white` :
                    "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                  }`}>
                  <span className="font-mono text-[11px] mr-2 text-slate-600">{String.fromCharCode(65+oi)}.</span>
                  {opt}
                  {isCorrect && " ✓"}
                  {isWrong   && " ✗"}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button onClick={submit}
          disabled={Object.keys(answers).length < quiz.length}
          className={`w-full py-3 rounded-2xl font-bold text-base text-white shadow-lg transition active:scale-95 disabled:opacity-40 ${ac.btn}`}>
          Submit Quiz
        </button>
      ) : (
        <div className="space-y-3">
          <div className={`rounded-2xl p-4 text-center border ${
            score === quiz.length ? "bg-green-900/30 border-green-500/30 text-green-400" :
            score >= quiz.length/2 ? "bg-amber-900/30 border-amber-500/30 text-amber-400" :
            "bg-red-900/30 border-red-500/30 text-red-400"
          }`}>
            <p className="text-2xl font-extrabold">{score}/{quiz.length}</p>
            <p className="text-[12px] mt-1 uppercase tracking-widest">
              {score === quiz.length ? "🎉 Perfect!" : score >= quiz.length/2 ? "👍 Good job!" : "📖 Review again"}
            </p>
          </div>
          <button onClick={reset}
            className="w-full border border-slate-700 py-2.5 rounded-xl text-slate-500 hover:bg-slate-800 text-base font-bold flex items-center justify-center gap-2 transition">
            <RotateCcw size={14}/> Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

const ChapterCard = ({ chapter, index, ac, completedSet, markComplete, iconMap }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("theory");
  const isCompleted = completedSet.has(chapter.id);

  // Get professional Lucide icon
  const IconComponent = iconMap?.[chapter.id] ?? Code2;

  return (
    <div className={`bg-[#0b0e17] rounded-2xl border transition-all duration-300 ${
      isCompleted ? `${ac.ring} ${ac.glow}` : "border-slate-800/60"
    }`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        {/* Professional icon instead of emoji */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${
          isCompleted
            ? "bg-green-900/30 border-green-500/30 text-green-400"
            : `${ac.iconBg} border`
        }`}>
          {isCompleted
            ? <CheckCircle size={22} className="text-green-400" />
            : <IconComponent size={22} />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-600">Chapter {String(index+1).padStart(2,"0")}</span>
            {isCompleted && <span className="text-[11px] text-green-400 font-bold">Completed</span>}
          </div>
          <p className="text-base font-bold text-slate-200 leading-tight">{chapter.title}</p>
          <p className="text-[13px] text-slate-500 mt-0.5 truncate">{chapter.description}</p>
        </div>

        {open
          ? <ChevronUp size={17} className={ac.chevron}/>
          : <ChevronRight size={17} className="text-slate-600"/>}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-800/40">
          <div className="flex gap-1 mt-4 mb-4 bg-slate-900/50 rounded-xl p-1">
            {[["theory","📖 Theory"],["quiz","🧪 Quiz"]].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
                  tab === key ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"
                }`}>
                {label}
              </button>
            ))}
          </div>

          {tab === "theory" && (
            <div className="space-y-4">
              <TheoryBlock text={chapter.theory}/>
              <button
                onClick={() => markComplete(chapter.id)}
                disabled={isCompleted}
                className={`w-full py-3 rounded-2xl font-bold text-base shadow-lg transition active:scale-95 disabled:opacity-60 text-white ${ac.btn}`}>
                {isCompleted ? "✅ Completed!" : "Mark as Complete"}
              </button>
            </div>
          )}
          {tab === "quiz" && <QuizSection quiz={chapter.quiz} ac={ac}/>}
        </div>
      )}
    </div>
  );
};

const Roadmap = ({ chapters, accentColor, title, subtitle, icon, resources }) => {
  const [completed, setCompleted] = useState(new Set());
  const [showResources, setShowResources] = useState(false);
  const ac = ACCENT[accentColor] ?? ACCENT.blue;
  const pct = Math.round((completed.size / chapters.length) * 100);
  const iconMap = accentColor === 'purple' ? CPP_ICONS : C_ICONS;

  const markComplete = (id) => setCompleted(prev => new Set([...prev, id]));

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-4 ${ac.badge}`}>
            {icon} {title}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            {title} <span className="text-slate-500 font-medium">0 to Hero</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto">{subtitle}</p>

          {/* Progress */}
          <div className="mt-8 bg-[#0b0e17] rounded-2xl border border-slate-800/60 p-5 max-w-sm mx-auto">
            <div className="flex justify-between text-[12px] font-bold text-slate-500 mb-2">
              <span>Learning Progress</span>
              <span>{completed.size}/{chapters.length} chapters</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${ac.progress}`} style={{width:`${pct}%`}}/>
            </div>
            <p className={`text-2xl font-extrabold mt-2 ${pct===100?"text-green-400":""}`}>
              {pct}%
              {pct === 100 && <span className="text-base font-normal text-green-400 ml-2">🎉 Completed!</span>}
            </p>
          </div>
        </div>

        {/* ════ HIGHLIGHTED RESOURCES BUTTON ════ */}
        {resources && (
          <div className="text-center mb-10">
            <div className="relative inline-block">
              {/* Glow ring */}
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 ${
                accentColor === 'purple'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500'
              }`} />
              <button
                onClick={() => setShowResources(!showResources)}
                className={`relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 active:scale-95 ${
                  showResources
                    ? `${ac.resourceBtn} scale-[0.98]`
                    : `${ac.resourceBtn}`
                }`}>
                <Sparkles size={18} />
                {showResources ? "Hide Learning Resources" : "Show Learning Resources"}
                <Sparkles size={18} />
              </button>
            </div>
            <p className="text-[12px] text-slate-600 mt-3">
              YouTube channels, websites, books & practice platforms
            </p>
          </div>
        )}

        {/* Resources Hub */}
        {showResources && resources && (
          <div className="mb-12">
            <ResourcesHub resources={resources} language={title.split(" ")[0]} />
          </div>
        )}

        {/* Chapters */}
        <div className="space-y-4">
          {chapters.map((ch, i) => (
            <ChapterCard
              key={ch.id}
              chapter={ch}
              index={i}
              ac={ac}
              completedSet={completed}
              markComplete={markComplete}
              iconMap={iconMap}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Roadmap;