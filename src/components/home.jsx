import React from 'react';
import { Zap, BarChart3, Binary, GitGraph, TreePalm, GitGraphIcon, Trees, AlertOctagonIcon, LeafyGreen } from 'lucide-react';

// সর্টিং এবং পাথফাইন্ডিং আইকনগুলোর জন্য কালার কনফিগ
const iconStyles = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/50",
    text: "text-blue-500"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    hover: "hover:border-purple-500/50",
    text: "text-purple-400"
  },
    green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    hover: "hover:border-green-500/50",
    text: "text-green-400"
  }
};

const floatingSnippets = [
  { code: `for(let i=0;i<n;i++){\n  swap(arr,i,j);\n}`, r: "-8deg", d: "18s", delay: "0s", o: 0.25, left: "2%", color: "#60a5fa" }, 
  { code: `if(left<right){\n  mid=Math.floor\n  ((l+r)/2);\n}`, r: "5deg", d: "22s", delay: "3s", o: 0.20, left: "15%", color: "#a78bfa" }, 
  { code: `while(i<arr.length){\n  result.push(arr[i]);\n  i++;\n}`, r: "-4deg", d: "16s", delay: "1s", o: 0.28, left: "30%", color: "#34d399" }, 
  { code: `pivot=arr[0];\nleft=arr.filter(\n  x=>x<pivot);`, r: "7deg", d: "20s", delay: "5s", o: 0.22, left: "45%", color: "#fbbf24" }, 
  { code: `dist[src]=0;\npq.enqueue(src,0);\nvisited=new Set();`, r: "-6deg", d: "24s", delay: "2s", o: 0.25, left: "60%", color: "#ef4444" }, 
  { code: `if(arr[j]>arr[j+1]){\n  [a,b]=[b,a];\n}`, r: "3deg", d: "19s", delay: "7s", o: 0.18, left: "75%", color: "#60a5fa" }, 
  { code: `return[\n  ...quickSort(left),\n  pivot,\n  ...quickSort(right)\n]`, r: "-10deg", d: "21s", delay: "4s", o: 0.24, left: "85%", color: "#a78bfa" }, 
  { code: `const bfs=(start)=>{\n  queue=[start];\n  while(queue.length)\n}`, r: "8deg", d: "17s", delay: "9s", o: 0.20, left: "8%", color: "#34d399" }, 
  { code: `heuristic(a,b)=>\n  Math.abs(a.x-b.x)+\n  Math.abs(a.y-b.y)`, r: "-3deg", d: "23s", delay: "6s", o: 0.18, left: "52%", color: "#fbbf24" }, 
  { code: `merge(left,right){\n  let result=[];\n  let i=0,j=0;\n}`, r: "6deg", d: "15s", delay: "11s", o: 0.25, left: "22%", color: "#ef4444" },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-700 ease-out relative overflow-hidden min-h-[85vh]">
      
      <style>{`
        @keyframes floatUpwards {
          0% { transform: translate3d(0, 110vh, 0) rotate(var(--rotation)); opacity: 0; }
          10% { opacity: var(--opacity); }
          90% { opacity: var(--opacity); }
          100% { transform: translate3d(0, -110vh, 0) rotate(var(--rotation)); opacity: 0; }
        }
        .code-snippet {
          position: absolute;
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          white-space: pre;
          pointer-events: none;
          line-height: 1.5;
          opacity: 0; 
          transform: translate3d(0, 110vh, 0) rotate(var(--rotation));
          animation: floatUpwards var(--duration) linear var(--delay) infinite;
          z-index: 0;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Background Code Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {floatingSnippets.map((item, i) => (
          <pre
            key={i}
            className="code-snippet"
            style={{
              '--rotation': item.r,
              '--duration': item.d,
              '--delay': item.delay,
              '--opacity': item.o,
              color: item.color,
              left: item.left,
              top: '0px',
            }}
          >
            {item.code}
          </pre>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl scale-150"></div>
          {/* <div className="relative w-28 h-28 bg-[#0b0e17] rounded-[2.5rem] border border-slate-800 flex items-center justify-center shadow-2xl">
            <Zap size={16} className="text-blue-500" strokeWidth={1.5} />
          </div> */}
        </div>

        <h2 className="text-6xl md:text-7xl font-black mb-5 tracking-tighter leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Visual Learning <br />
          <span className="text-blue-500 text-6xl md:text-8xl">Redefined.</span>
        </h2>
        
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed text-lg mb-16 font-medium px-4">
          Welcome to Algorithm Studio. Select an algorithm from the menu to witness the logic of data structures in motion.
        </p>
        
        {/* কার্ড সেকশন */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          <HomeCard 
            icon={<BarChart3 size={32} />}
            title="Sorting Arena"
            desc="Explore O(n log n) efficiency through interactive bar animations."
            color="blue"
          />
          <HomeCard 
            icon={<Binary size={32} />}
            title="Data Structure"
            desc="Witness how Stacks, Queues, and Linked Lists organize and manipulate data in real-time."
            color="purple"
          />
          <div className="md:col-span-2">
            <HomeCard 
              icon={<GitGraphIcon size={32} />}
              title="Graph and Tree"
              desc="Master complex traversals like BFS and DFS by visualizing dynamic nodes and edge connections in real-time."
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeCard = ({ icon, title, desc, color }) => {
  const style = iconStyles[color];
  
  return (
    <div className={`relative group p-10 rounded-[2.5rem] bg-[#0b0e17]/40 backdrop-blur-sm border border-slate-800 transition-all duration-500 ${style.hover} hover:-translate-y-2 shadow-xl hover:shadow-${color}-500/10`}>
      <div className="flex flex-col items-start text-left">
        {/* ✅ আইকন কন্টেইনার - এখানে bg এবং border ফিক্স করা হয়েছে */}
        <div className={`p-4 ${style.bg} ${style.border} border rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500 ${style.text}`}>
          {icon}
        </div>
        <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h4>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
};

export default Home;