import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, RotateCcw, Copy, Check, ArrowLeft,
  Terminal, Clock, AlertCircle, CheckCircle2, Loader2, ChevronDown
} from 'lucide-react';

import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { indentOnInput, bracketMatching, foldGutter, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

/* ══════════════════════════════════════════════
   APIs
══════════════════════════════════════════════ */
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

async function runWithWandbox(code, lang, stdin = "") {
  const compiler = lang === "cpp" ? "gcc-head" : "gcc-head-c";
  const res = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler,
      code,
      options: lang === "cpp" ? "warning,c++17" : "warning,c11",
      "compiler-option-raw": lang === "cpp" ? "-std=c++17" : "-std=c11",
      stdin,                    // ✅ user এর stdin পাঠানো হচ্ছে
    }),
  });
  const data = await res.json();
  const stderr = data?.compiler_error || data?.runtime_error || "";
  const stdout = data?.program_output || "";
  return { stdout, stderr, hasError: !!stderr && !stdout };
}

/* ── Pyodide ── */
let pyodideInstance = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
  return pyodideInstance;
}

async function runPython(code, stdin = "") {
  try {
    const pyodide = await getPyodide();
    let output = "";

    // ✅ stdin support for Python
    if (stdin.trim()) {
      const lines = stdin.split("\n");
      let lineIdx = 0;
      pyodide.globals.set("__input_lines__", pyodide.toPy(lines));
      await pyodide.runPythonAsync(`
import builtins
_lines = __input_lines__.to_py()
_idx = [0]
def _input(prompt=''):
    import sys
    sys.stdout.write(str(prompt))
    if _idx[0] < len(_lines):
        val = _lines[_idx[0]]
        _idx[0] += 1
        return val
    return ''
builtins.input = _input
      `);
    }

    pyodide.setStdout({ batched: (t) => { output += t + "\n"; } });
    pyodide.setStderr({ batched: (t) => { output += t + "\n"; } });
    await pyodide.runPythonAsync(code);
    return { stdout: output.trimEnd(), stderr: "", hasError: false };
  } catch (err) {
    return { stdout: "", stderr: err.message, hasError: true };
  }
}

/* ══════════════════════════════════════════════
   LANGUAGE CONFIGS
   ✅ cmLang সরানো হয়েছে — module level এ call করলে conflict হয়
══════════════════════════════════════════════ */
const LANGUAGES = {
  c: {
    label: "C", icon: "/letter-c.png", color: "#3b82f6",
    accentBg: "bg-blue-500/15", accentBorder: "border-blue-500/40",
    btnBg: "bg-blue-600 hover:bg-blue-500",
    stdinPlaceholder: "cin এ input দাও (প্রতি লাইনে একটা)…\nExample:\n5\n10",
    defaultCode: `#include <stdio.h>

int main() {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);
    printf("You entered: %d\\n", n);
    printf("Square: %d\\n", n * n);
    return 0;
}`,
  },
  cpp: {
    label: "C++", icon: "/c-.png", color: "#8b5cf6",
    accentBg: "bg-purple-500/15", accentBorder: "border-purple-500/40",
    btnBg: "bg-purple-600 hover:bg-purple-500",
    stdinPlaceholder: "cin এ input দাও (প্রতি লাইনে একটা)…\nExample:\n5\n10",
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int n;
    cout << "Enter count: ";
    cin >> n;

    vector<int> arr(n);
    cout << "Enter " << n << " numbers: ";
    for (int i = 0; i < n; i++) cin >> arr[i];

    sort(arr.begin(), arr.end());

    cout << "Sorted: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
  },
  python: {
    label: "Python", icon: "/python.png", color: "#f59e0b",
    accentBg: "bg-amber-500/15", accentBorder: "border-amber-500/40",
    btnBg: "bg-amber-500 hover:bg-amber-400",
    stdinPlaceholder: "input() এ value দাও (প্রতি লাইনে একটা)…\nExample:\n5\nHello",
    defaultCode: `# Python Demo
n = int(input("Enter a number: "))
print(f"You entered: {n}")
print(f"Square: {n * n}")

nums = [5, 2, 8, 1, 9, 3, 7]
nums.sort()
print(f"Sorted: {nums}")`,
  },
};

/* ── getLang: fresh instance তৈরি করে ── */
const getLang = (id) => id === 'python' ? python() : cpp();

/* ── Samples ── */
const SAMPLES = {
  c: [
    { title: "Linked List", code: `#include <stdio.h>
#include <stdlib.h>
struct Node { int data; struct Node* next; };
void push(struct Node** h, int v) {
    struct Node* n = malloc(sizeof(struct Node));
    n->data = v; n->next = *h; *h = n;
}
void print(struct Node* h) {
    while (h) { printf("%d -> ", h->data); h = h->next; }
    printf("NULL\\n");
}
int main() {
    struct Node* head = NULL;
    push(&head, 30); push(&head, 20); push(&head, 10);
    printf("List: "); print(head);
    return 0;
}` },
    { title: "Binary Search", code: `#include <stdio.h>
int bsearch(int arr[], int n, int t) {
    int l=0, r=n-1;
    while (l<=r) {
        int m = l+(r-l)/2;
        if (arr[m]==t) return m;
        arr[m]<t ? (l=m+1) : (r=m-1);
    }
    return -1;
}
int main() {
    int arr[] = {2,5,8,12,16,23,38,56,72,91};
    int idx = bsearch(arr,10,23);
    idx!=-1 ? printf("Found at %d\\n",idx) : printf("Not found\\n");
}` },
    { title: "User Input", code: `#include <stdio.h>
int main() {
    int a, b;
    printf("Enter two numbers: ");
    scanf("%d %d", &a, &b);
    printf("Sum: %d\\n", a+b);
    printf("Product: %d\\n", a*b);
    printf("Max: %d\\n", a>b?a:b);
    return 0;
}` },
  ],
  cpp: [
    { title: "BST", code: `#include <iostream>
using namespace std;
struct Node { int v; Node *l,*r; Node(int x):v(x),l(0),r(0){} };
Node* ins(Node* r, int v) {
    if (!r) return new Node(v);
    v<r->v ? r->l=ins(r->l,v) : r->r=ins(r->r,v);
    return r;
}
void inorder(Node* r) { if(!r) return; inorder(r->l); cout<<r->v<<" "; inorder(r->r); }
int main() {
    Node* root=0;
    for (int v:{5,3,7,1,4,6,8}) root=ins(root,v);
    cout<<"Inorder: "; inorder(root); cout<<endl;
}` },
    { title: "User Input", code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n; cin >> n;
    vector<int> v(n);
    for (auto& x : v) cin >> x;
    sort(v.begin(), v.end());
    cout << "Sorted: ";
    for (auto x : v) cout << x << " ";
    cout << endl;
    cout << "Max: " << v.back() << ", Min: " << v[0] << endl;
}` },
    { title: "Graph BFS", code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int n=7; vector<vector<int>> adj(n);
    auto add=[&](int u,int v){adj[u].push_back(v);adj[v].push_back(u);};
    add(0,1);add(0,2);add(1,3);add(1,4);add(2,5);add(2,6);
    vector<bool> vis(n,false); queue<int> q;
    vis[0]=true; q.push(0); cout<<"BFS: ";
    while(!q.empty()){int v=q.front();q.pop();cout<<v<<" ";
        for(int u:adj[v])if(!vis[u]){vis[u]=true;q.push(u);}}
    cout<<endl;
}` },
  ],
  python: [
    { title: "User Input", code: `n = int(input("How many numbers? "))
nums = []
for i in range(n):
    nums.append(int(input(f"Enter number {i+1}: ")))
print(f"\\nNumbers: {nums}")
print(f"Sum: {sum(nums)}")
print(f"Average: {sum(nums)/len(nums):.2f}")
print(f"Max: {max(nums)}, Min: {min(nums)}")` },
    { title: "Quick Sort", code: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr)//2]
    return quick_sort([x for x in arr if x<pivot]) + \
           [x for x in arr if x==pivot] + \
           quick_sort([x for x in arr if x>pivot])
nums = [3,6,8,10,1,2,1,9,4,7]
print("Before:", nums)
print("After :", quick_sort(nums))` },
    { title: "OOP", code: `class Student:
    def __init__(self, name, gpa): self.name=name; self.gpa=gpa
    def grade(self): return "A" if self.gpa>=3.7 else "B" if self.gpa>=3.3 else "C"
    def __repr__(self): return f"{self.name}(GPA:{self.gpa:.2f}, {self.grade()})"

students=[Student("Alice",3.9),Student("Bob",3.2),Student("Carol",3.7)]
students.sort(key=lambda s:s.gpa,reverse=True)
for i,s in enumerate(students,1): print(f"  {i}. {s}")` },
  ],
};

/* ══════════════════════════════════════════════
   ✅ FIXED CodeMirror Hook
══════════════════════════════════════════════ */
function useCodeMirror({ value, onChange, langId, color }) {
  const editorRef   = useRef(null);
  const viewRef     = useRef(null);
  const langComp    = useRef(new Compartment());
  const isUpdating  = useRef(false);
  const onChangeRef = useRef(onChange);        // ✅ stale closure fix

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const projectTheme = EditorView.theme({
    "&": { backgroundColor:"#080c14", color:"#e2e8f0", fontSize:"13px", height:"100%", fontFamily:"'JetBrains Mono','Fira Code',monospace" },
    ".cm-content": { padding:"14px 14px 14px 0", lineHeight:"1.65rem", caretColor:color, minHeight:"360px" },
    ".cm-line": { padding:"0 4px" },
    ".cm-gutters": { backgroundColor:"#080c14", borderRight:"1px solid #1e293b", color:"#334155", minWidth:"44px" },
    ".cm-lineNumbers .cm-gutterElement": { padding:"0 10px 0 6px", minWidth:"36px", textAlign:"right", fontSize:"11px" },
    ".cm-activeLine": { backgroundColor:"#0f172a" },
    ".cm-activeLineGutter": { backgroundColor:"#0f172a" },
    ".cm-selectionBackground, ::selection": { backgroundColor:"#1e3a5f !important" },
    ".cm-cursor": { borderLeftColor:color, borderLeftWidth:"2px" },
    ".cm-matchingBracket": { backgroundColor:"#1e3a5f", outline:`1px solid ${color}`, borderRadius:"2px" },
    ".cm-tooltip": { backgroundColor:"#0f1320", border:"1px solid #334155", borderRadius:"8px" },
    ".cm-tooltip-autocomplete": { backgroundColor:"#0f1320" },
    ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor:"#1e3a5f" },
    ".cm-scroller": { overflowX:"auto" },
    ".cm-scroller::-webkit-scrollbar": { width:"5px", height:"5px" },
    ".cm-scroller::-webkit-scrollbar-thumb": { background:"#334155", borderRadius:"4px" },
    ".cm-scroller::-webkit-scrollbar-track": { background:"transparent" },
  }, { dark: true });

  // ✅ Mount একবার
  useEffect(() => {
    if (!editorRef.current) return;
    const state = EditorState.create({
      doc: value,
      extensions: [
        history(), lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(),
        drawSelection(), indentOnInput(), bracketMatching(), closeBrackets(),
        foldGutter(), autocompletion(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark, projectTheme,
        langComp.current.of(getLang(langId)),       // ✅ fresh instance
        keymap.of([indentWithTab, ...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...completionKeymap]),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isUpdating.current)
            onChangeRef.current(update.state.doc.toString()); // ✅ ref দিয়ে
        }),
      ],
    });
    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;
    return () => { view.destroy(); viewRef.current = null; };
  }, []); // eslint-disable-line

  // ✅ External value sync
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const cur = view.state.doc.toString();
    if (cur !== value) {
      isUpdating.current = true;
      view.dispatch({ changes: { from:0, to:cur.length, insert:value } });
      isUpdating.current = false;
    }
  }, [value]);

  // ✅ Language switch
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: langComp.current.reconfigure(getLang(langId)) });
  }, [langId]); // eslint-disable-line

  return editorRef;
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const Compiler = () => {
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState("c");
  const [codes, setCodes] = useState({
    c:      LANGUAGES.c.defaultCode,
    cpp:    LANGUAGES.cpp.defaultCode,
    python: LANGUAGES.python.defaultCode,
  });
  const [stdin,     setStdin]     = useState("");          // ✅ stdin state
  const [showStdin, setShowStdin] = useState(false);       // ✅ toggle
  const [output,    setOutput]    = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runTime,   setRunTime]   = useState(null);
  const [hasError,  setHasError]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [pyLoading, setPyLoading] = useState(false);

  const lang = LANGUAGES[activeLang];

  const handleCodeChange = useCallback((val) => {
    setCodes(p => ({ ...p, [activeLang]: val }));
  }, [activeLang]);

  const editorRef = useCodeMirror({
    value:    codes[activeLang],
    onChange: handleCodeChange,
    langId:   activeLang,          // ✅ langId, not cmLang
    color:    lang.color,
  });

  const switchLang = (l) => { setActiveLang(l); setOutput(""); setRunTime(null); setHasError(false); };
  const loadSample = (code) => { setCodes(p => ({ ...p, [activeLang]: code })); setOutput(""); setRunTime(null); setHasError(false); };
  const resetCode  = () => { setCodes(p => ({ ...p, [activeLang]: lang.defaultCode })); setStdin(""); setOutput(""); setRunTime(null); setHasError(false); };
  const copyCode   = () => { navigator.clipboard.writeText(codes[activeLang]); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const runCode = async () => {
    setIsRunning(true); setOutput(""); setHasError(false); setRunTime(null);
    const t0 = Date.now();
    if (activeLang === "python" && !pyodideInstance) setPyLoading(true);
    try {
      let result;
      if (activeLang === "python") {
        result = await runPython(codes.python, stdin);    // ✅ stdin পাঠানো
        setPyLoading(false);
      } else {
        result = await runWithWandbox(codes[activeLang], activeLang, stdin); // ✅ stdin পাঠানো
      }
      setRunTime(((Date.now() - t0) / 1000).toFixed(2));
      setHasError(result.hasError);
      setOutput(result.stderr || result.stdout || "(No output)");
    } catch (err) {
      setHasError(true);
      setOutput("❌ Network error: " + err.message);
    } finally {
      setIsRunning(false); setPyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm font-semibold mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <Terminal size={22} className="text-slate-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Online <span className="text-blue-400">Compiler</span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">Write, run and test C / C++ / Python — no setup needed</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5 flex-wrap">
            {Object.entries(LANGUAGES).map(([key, l]) => (
              <button key={key} onClick={() => switchLang(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                  activeLang === key
                    ? `${l.accentBg} ${l.accentBorder} text-white`
                    : "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}>
                <img src={l.icon} alt={l.label} className="w-5 h-5 object-contain" onError={e=>e.target.style.display="none"} />
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 ml-auto flex-wrap">
              {(SAMPLES[activeLang]||[]).map((s,i) => (
                <button key={i} onClick={() => loadSample(s.code)}
                  className="px-3 py-2 text-[11px] font-bold bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 hover:text-slate-200 hover:border-slate-500 transition whitespace-nowrap">
                  📄 {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* EDITOR */}
          <div className="flex flex-col rounded-2xl border border-slate-800/60 overflow-hidden bg-[#0b0e17]">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[11px] font-bold font-mono text-slate-500 flex items-center gap-1.5">
                  <img src={lang.icon} alt={lang.label} className="w-4 h-4 object-contain" onError={e=>e.target.style.display="none"} />
                  {lang.label} Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">{codes[activeLang].split("\n").length} lines</span>
                <button onClick={copyCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-700/50 bg-slate-800/50 text-slate-400 hover:text-slate-200 transition">
                  {copied ? <Check size={12} className="text-green-400"/> : <Copy size={12}/>}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={resetCode} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-700/50 bg-slate-800/50 text-slate-400 hover:text-slate-200 transition">
                  <RotateCcw size={12}/> Reset
                </button>
              </div>
            </div>

            {/* CodeMirror */}
            <div ref={editorRef} className="flex-1 overflow-auto" style={{ minHeight:"360px", maxHeight:"560px" }} />

            {/* ✅ STDIN INPUT SECTION */}
<div className="relative rounded-[10px] overflow-hidden bg-[#0b1220] p-[1.2px] shadow-[0_0_40px_rgba(16,185,129,0.06)]">
  
  {/* মাখনের মতো স্মুথ বর্ডার বিম */}
  <style>{`
    @keyframes smoothRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}</style>
  
  <div 
    className="absolute inset-[-200%] pointer-events-none"
    style={{
      background: 'conic-gradient(from 0deg, transparent 70%, #10b981 100%)',
      animation: 'smoothRotate 4s linear infinite'
    }}
  />

  {/* মেইন কন্টেন্ট কন্টেইনার */}
  <div className="relative z-10 w-full h-full rounded-[9px] bg-[#0b1220]">
    
    {/* Header */}
    <button
      onClick={() => setShowStdin(p => !p)}
      className="group w-full flex items-center justify-between px-6 py-5 transition-all duration-300 hover:bg-white/[0.02]"
    >
      {/* Left Side (No Icon) */}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] font-bold tracking-wide text-white">
            Standard Input
          </h3>
          <span className="px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-[10px] font-semibold text-emerald-400 uppercase tracking-widest rounded-sm">
            STDIN
          </span>
        </div>
        <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
          input() / cin / scanf values এখানে দাও <br />
          প্রতি লাইনে একটি value লিখো
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {stdin.trim() && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold rounded-md animate-pulse">
            <span className="w-2 h-2 bg-emerald-400 animate-ping rounded-full" />
            Input Ready
          </div>
        )}

        {/* Circular Arrow Icon */}
        <div className="w-10 h-10 rounded-full border border-slate-700/50 bg-slate-900/40 flex items-center justify-center group-hover:border-emerald-500/30 transition-all duration-300">
          <ChevronDown
            size={18}
            className={`transition-all duration-300 ${
              showStdin ? 'rotate-180 text-emerald-400' : 'text-slate-500 group-hover:text-white'
            }`}
          />
        </div>
      </div>
    </button>

    {/* Expandable Section */}
    <div
      className={`grid transition-all duration-500 ease-in-out ${
        showStdin ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="px-6 pb-6 space-y-4">
          {/* Example Input Box */}
          <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-lg">
            <code className="block text-[13px] font-mono text-emerald-400">
              <span className="text-emerald-400">💡</span>
              <span className="text-[12px] font-semibold text-slate-300">
                Example Input
              </span>
              
              <br /> 5 <br /> 10
            </code>
          </div>

          {/* Textarea */}
          <textarea
            value={stdin}
            onChange={e => setStdin(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-slate-700/60 bg-[#0b1120]/90 px-5 py-4 text-[14px] font-mono text-slate-200 outline-none resize-none focus:border-emerald-500/40 transition-all"
          />
        </div>
      </div>
    </div>
  </div>
</div>
            {/* Run button */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <button onClick={runCode} disabled={isRunning}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-lg transition active:scale-[0.98] disabled:opacity-60 ${lang.btnBg}`}>
                {isRunning
                  ? <><Loader2 size={16} className="animate-spin"/>{pyLoading ? "Loading Python…" : "Compiling & Running…"}</>
                  : <><Play size={16} fill="currentColor"/> Run {lang.label}</>
                }
              </button>
            </div>
          </div>

          {/* OUTPUT */}
          <div className="flex flex-col rounded-2xl border border-slate-800/60 overflow-hidden bg-[#0b0e17]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm">▶</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Output</span>
              </div>
              <div className="flex items-center gap-3">
                {runTime && (
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <Clock size={11}/> {runTime}s
                  </span>
                )}
                {output && !isRunning && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                    hasError ? "bg-red-900/30 border-red-500/30 text-red-400" : "bg-green-900/30 border-green-500/30 text-green-400"
                  }`}>
                    {hasError ? <><AlertCircle size={11}/> Error</> : <><CheckCircle2 size={11}/> Success</>}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 p-5 overflow-y-auto" style={{ minHeight:"440px", maxHeight:"640px", fontFamily:"'JetBrains Mono',monospace" }}>
              {isRunning ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
                  <Loader2 size={32} className="animate-spin" style={{ color:lang.color }}/>
                  <p className="text-sm">{pyLoading ? "Loading Python runtime (first run)…" : "Compiling and running…"}</p>
                  <p className="text-[11px]">This may take a few seconds</p>
                </div>
              ) : output ? (
                <pre className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${hasError ? "text-red-400" : "text-green-300"}`}>
                  {output}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-700">
                  <Terminal size={40} strokeWidth={1}/>
                  <p className="text-sm text-center">Click <span className="text-slate-500 font-bold">Run</span> to execute your code</p>
                  <p className="text-[11px]">Output will appear here</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-mono">
                  {activeLang === "python" ? "🐍 Pyodide (Python 3 · browser)" : "🔧 Wandbox (GCC latest)"}
                </span>
                <span>Free · No login · Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon:"⌨️", title:"Tab to indent",      desc:"Tab key indents code automatically" },
            { icon:"📥", title:"Stdin Support",       desc:"cin/scanf/input() এর জন্য নিচের stdin box ব্যবহার করো" },
            { icon:"🔧", title:"Auto bracket close",  desc:"Type ( [ { — closing bracket automatic আসে" },
            { icon:"⚡", title:"No setup needed",     desc:"C/C++ via Wandbox · Python via Pyodide" },
          ].map((tip,i) => (
            <div key={i} className="bg-[#0b0e17] border border-slate-800/60 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-xl">{tip.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-300">{tip.title}</p>
                <p className="text-[11px] text-slate-600 mt-0.5">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Compiler;