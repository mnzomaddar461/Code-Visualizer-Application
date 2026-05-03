import React from 'react';
import { BarChart3, Binary, GitGraphIcon, SearchCode, Puzzle } from 'lucide-react';
import { useTheme } from './ThemeContext';

const iconStyles = {
  blue:   { bg: "bg-blue-500/10",   border: "border-blue-500/20",   hover: "hover:border-blue-500/50",   text: "text-blue-500"   },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", hover: "hover:border-purple-500/50", text: "text-purple-400" },
  green:  { bg: "bg-green-500/10",  border: "border-green-500/20",  hover: "hover:border-green-500/50",  text: "text-green-400"  },
  red:    { bg: "bg-red-500/10",    border: "border-red-500/20",    hover: "hover:border-red-500/50",    text: "text-red-400"    },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50", text: "text-yellow-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", hover: "hover:border-orange-500/50", text: "text-orange-400" },
  pink:   { bg: "bg-pink-500/10",   border: "border-pink-500/20",   hover: "hover:border-pink-500/50",   text: "text-pink-400"   },
};

const floatingSnippets = [
  { code: `for(let i=0;i<n;i++){\n  swap(arr,i,j);\n}`,                         r:"-8deg",  d:"18s", delay:"0s",  o:0.25, left:"2%",  dark:"#60a5fa", light:"#1d4ed8" },
  { code: `if(left<right){\n  mid=Math.floor\n  ((l+r)/2);\n}`,                 r:"5deg",   d:"22s", delay:"3s",  o:0.20, left:"15%", dark:"#a78bfa", light:"#6d28d9" },
  { code: `while(i<arr.length){\n  result.push(arr[i]);\n  i++;\n}`,            r:"-4deg",  d:"16s", delay:"1s",  o:0.28, left:"30%", dark:"#34d399", light:"#047857" },
  { code: `pivot=arr[0];\nleft=arr.filter(\n  x=>x<pivot);`,                    r:"7deg",   d:"20s", delay:"5s",  o:0.22, left:"45%", dark:"#fbbf24", light:"#b45309" },
  { code: `dist[src]=0;\npq.enqueue(src,0);\nvisited=new Set();`,               r:"-6deg",  d:"24s", delay:"2s",  o:0.25, left:"60%", dark:"#ef4444", light:"#b91c1c" },
  { code: `if(arr[j]>arr[j+1]){\n  [a,b]=[b,a];\n}`,                           r:"3deg",   d:"19s", delay:"7s",  o:0.18, left:"75%", dark:"#60a5fa", light:"#1d4ed8" },
  { code: `return[\n  ...quickSort(left),\n  pivot,\n  ...quickSort(right)\n]`, r:"-10deg", d:"21s", delay:"4s",  o:0.24, left:"85%", dark:"#a78bfa", light:"#6d28d9" },
  { code: `const bfs=(start)=>{\n  queue=[start];\n  while(queue.length)\n}`,  r:"8deg",   d:"17s", delay:"9s",  o:0.20, left:"8%",  dark:"#34d399", light:"#047857" },
  { code: `heuristic(a,b)=>\n  Math.abs(a.x-b.x)+\n  Math.abs(a.y-b.y)`,      r:"-3deg",  d:"23s", delay:"6s",  o:0.18, left:"52%", dark:"#fbbf24", light:"#b45309" },
  { code: `merge(left,right){\n  let result=[];\n  let i=0,j=0;\n}`,            r:"6deg",   d:"15s", delay:"11s", o:0.25, left:"22%", dark:"#ef4444", light:"#b91c1c" },
];

const CIcon = () => (
  <svg viewBox="0 0 128 128" width="40" height="40">
    <path fill="#FC427B" d="M115 16.3c-2.3-4-5.4-7.4-9.2-9.8C101.9 4 97.4 2.5 92.7 2.5H35.3c-4.7 0-9.2 1.5-13.1 3.9-3.8 2.4-6.9 5.8-9.2 9.8L6.6 30.1C4.3 34 3 38.6 3 43.4v41.2c0 4.8 1.3 9.4 3.6 13.3l6.4 11.1c2.3 4 5.4 7.4 9.2 9.8 3.9 2.5 8.4 3.9 13.1 3.9h57.4c4.7 0 9.2-1.5 13.1-3.9 3.8-2.4 6.9-5.8 9.2-9.8l6.4-11.1c2.3-4 3.6-8.5 3.6-13.3V43.4c0-4.8-1.3-9.4-3.6-13.3L115 16.3z"/>
    <path fill="#fff" d="M64 28.9C45.2 28.9 29.9 44.2 29.9 63s15.3 34.1 34.1 34.1c11.3 0 21.3-5.5 27.4-14l-9.8-5.6c-3.9 5.6-10.3 9.3-17.6 9.3-11.7 0-21.2-9.5-21.2-21.2 0-11.7 9.5-21.2 21.2-21.2 7.4 0 13.8 3.8 17.6 9.5l9.8-5.6C85.3 34.5 75.3 28.9 64 28.9z"/>
  </svg>
);

const CppIcon = () => (
  <svg viewBox="0 0 128 128" width="40" height="40">
    <path fill="#F97F51" d="M115 16.3c-2.3-4-5.4-7.4-9.2-9.8C101.9 4 97.4 2.5 92.7 2.5H35.3c-4.7 0-9.2 1.5-13.1 3.9-3.8 2.4-6.9 5.8-9.2 9.8L6.6 30.1C4.3 34 3 38.6 3 43.4v41.2c0 4.8 1.3 9.4 3.6 13.3l6.4 11.1c2.3 4 5.4 7.4 9.2 9.8 3.9 2.5 8.4 3.9 13.1 3.9h57.4c4.7 0 9.2-1.5 13.1-3.9 3.8-2.4 6.9-5.8 9.2-9.8l6.4-11.1c2.3-4 3.6-8.5 3.6-13.3V43.4c0-4.8-1.3-9.4-3.6-13.3L115 16.3z"/>
    <path fill="#fff" d="M64 28.9C45.2 28.9 29.9 44.2 29.9 63s15.3 34.1 34.1 34.1c11.3 0 21.3-5.5 27.4-14l-9.8-5.6c-3.9 5.6-10.3 9.3-17.6 9.3-11.7 0-21.2-9.5-21.2-21.2 0-11.7 9.5-21.2 21.2-21.2 7.4 0 13.8 3.8 17.6 9.5l9.8-5.6C85.3 34.5 75.3 28.9 64 28.9zM91 58h-5v-5h-5v5h-5v5h5v5h5v-5h5zM109 58h-5v-5h-5v5h-5v5h5v5h5v-5h5z"/>
  </svg>
);

const Home = () => {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-700 ease-out relative overflow-hidden min-h-[85vh]">

      <style>{`
        @keyframes floatUpwards {
          0%   { transform: translate3d(0, 110vh, 0) rotate(var(--rotation)); opacity: 0; }
          10%  { opacity: var(--opacity); }
          90%  { opacity: var(--opacity); }
          100% { transform: translate3d(0, -110vh, 0) rotate(var(--rotation)); opacity: 0; }
        }
        .code-snippet {
          position: absolute;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 11px;
          white-space: pre;
          pointer-events: none;
          line-height: 1.5;
          opacity: 0;
          transform: translate3d(0, 110vh, 0) rotate(var(--rotation));
          animation: floatUpwards var(--duration) linear var(--delay) infinite;
          z-index: 0;
          will-change: transform, opacity;
          padding: 4px 8px;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {floatingSnippets.map((item, i) => (
          <pre
            key={i}
            // ✅ "floating-snippet" class যোগ — CSS এ pre:not(.floating-snippet) দিয়ে আলাদা করা হয়েছে
            className="code-snippet floating-snippet"
            style={{
              '--rotation': item.r,
              '--duration': item.d,
              '--delay':    item.delay,
              '--opacity':  isDark ? item.o : item.o * 0.45,
              color:        isDark ? item.dark : item.light,
              left:         item.left,
              top:          '0px',
            }}
          >
            {item.code}
          </pre>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl scale-150"></div>
        </div>

        <h2 className={`text-6xl md:text-7xl font-black mb-5 tracking-tighter leading-tight ${
          isDark
            ? "bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
            : "text-slate-900"
        }`}>
          Visual Learning <br />
          <span className="text-blue-500 text-6xl md:text-8xl" style={{ WebkitTextFillColor: '#3b82f6' }}>
            Redefined.
          </span>
        </h2>

        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed text-lg mb-16 font-medium px-4">
          Welcome to Algorithm Studio. Select an algorithm from the menu to witness the logic of data structures in motion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          <HomeCard icon={<BarChart3 size={32} />}    title="Sorting Arena"                    desc="Explore O(n log n) efficiency through interactive bar animations."                                                                                 color="blue"   isDark={isDark} />
          <HomeCard icon={<Binary size={32} />}       title="Data Structure"                   desc="Witness how Stacks, Queues, and Linked Lists organize and manipulate data in real-time."                                                          color="purple" isDark={isDark} />
          <HomeCard icon={<SearchCode size={32} />}   title="Searching Algorithm"              desc="Master the logic of efficient data retrieval. Watch how Linear Search and Binary Search navigate through datasets to find targets with precision." color="red"    isDark={isDark} />
          <HomeCard icon={<GitGraphIcon size={32} />} title="Graph and Tree"                   desc="Master complex traversals like BFS and DFS by visualizing dynamic nodes and edge connections in real-time."                                      color="green"  isDark={isDark} />
          <div className="md:col-span-2">
            <HomeCard icon={<Puzzle size={32} />}     title="LeetCode 100 problems"            desc="Conquer the top 100 most popular coding problems. Master core data structures and algorithms to ace your next technical interview."              color="yellow" isDark={isDark} />
          </div>
          <div className="md:col-span-2">
            <HomeCard icon={<CIcon />}                title="C Programming Language 0 to Hero!"   desc="Build a rock-solid foundation in logic building. Learn pointers, memory allocation, and efficient algorithms from scratch."                  color="pink"   isDark={isDark} />
          </div>
          <div className="md:col-span-2">
            <HomeCard icon={<CppIcon />}              title="C++ Programming Language 0 to Hero!" desc="Master the power of C++ from scratch. Dive deep into Object-Oriented Programming, Memory Management, and the Standard Template Library (STL)." color="orange" isDark={isDark} />
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeCard = ({ icon, title, desc, color, isDark }) => {
  const style = iconStyles[color];
  return (
    <div className={`relative group p-10 rounded-[2.5rem] backdrop-blur-sm border transition-all duration-500 ${style.hover} hover:-translate-y-2 shadow-xl ${
      isDark ? "bg-[#0b0e17]/40 border-slate-800" : "bg-white/70 border-slate-200"
    }`}>
      <div className="flex flex-col items-start text-left">
        <div className={`p-4 ${style.bg} ${style.border} border rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 ${style.text}`}>
          {icon}
        </div>
        <h4 className={`text-2xl font-bold mb-3 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          {title}
        </h4>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
};

export default Home;