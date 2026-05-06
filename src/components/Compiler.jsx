import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, RotateCcw, Copy, Check, ArrowLeft,
  Terminal, Clock, AlertCircle, CheckCircle2,
  Loader2
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════
  Wandbox API — C / C++ (free, no key)
══════════════════════════════════════════════════════════ */
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

/* ══════════════════════════════════════════════════════════
  LANGUAGE CONFIGS
══════════════════════════════════════════════════════════ */
const LANGUAGES = {
  c: {
    label: "C",
    icon: "/letter-c.png",   // public folder image
    useImg: true,
    color: "#3b82f6",
    accentBg: "bg-blue-500/15",
    accentBorder: "border-blue-500/40",
    btnBg: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40",
    fileName: "main.c",
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");

    // Variables
    int a = 10, b = 20;
    printf("Sum of %d and %d = %d\\n", a, b, a + b);

    // Loop
    printf("Numbers 1 to 5: ");
    for (int i = 1; i <= 5; i++) {
        printf("%d ", i);
    }
    printf("\\n");

    return 0;
}`,
  },

  cpp: {
    label: "C++",
    icon: "/c-.png",         // public folder image
    useImg: true,
    color: "#8b5cf6",
    accentBg: "bg-purple-500/15",
    accentBorder: "border-purple-500/40",
    btnBg: "bg-purple-600 hover:bg-purple-500 shadow-purple-900/40",
    fileName: "main.cpp",
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;

    // Vector + sort
    vector<int> nums = {5, 2, 8, 1, 9, 3};
    sort(nums.begin(), nums.end());

    cout << "Sorted: ";
    for (auto x : nums) cout << x << " ";
    cout << endl;

    // Lambda
    auto square = [](int x) { return x * x; };
    cout << "Square of 7 = " << square(7) << endl;

    return 0;
}`,
  },

  python: {
    label: "Python",
    icon: "/python.png",     // public folder image
    useImg: true,
    color: "#f59e0b",
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/40",
    btnBg: "bg-amber-500 hover:bg-amber-400 shadow-amber-900/40",
    fileName: "main.py",
    defaultCode: `print("Hello, World!")

# Variables
name = "Python"
version = 3.12
print(f"Language: {name}, Version: {version}")

# List + loop
nums = [5, 2, 8, 1, 9, 3]
nums.sort()
print(f"Sorted: {nums}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"Squares: {squares}")
`,
  },
};

/* ══════════════════════════════════════════════════════════
  Sample programs
══════════════════════════════════════════════════════════ */
const SAMPLES = {
  c: [
    { title: "Bubble Sort", code: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int t = arr[j]; arr[j] = arr[j+1]; arr[j+1] = t;
            }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    bubbleSort(arr, n);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}` },
    { title: "Linked List", code: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

void push(struct Node** head, int val) {
    struct Node* n = malloc(sizeof(struct Node));
    n->data = val; n->next = *head; *head = n;
}

void print(struct Node* head) {
    while (head) { printf("%d -> ", head->data); head = head->next; }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    push(&head, 30); push(&head, 20); push(&head, 10);
    printf("Linked List: "); print(head);
    return 0;
}` },
    { title: "Binary Search", code: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int idx = binarySearch(arr, 10, 23);
    printf("Found 23 at index: %d\\n", idx);
    return 0;
}` },
  ],
  cpp: [
    { title: "BST", code: `#include <iostream>
using namespace std;
struct Node {
    int val; Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};
Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left = insert(root->left, val);
    else root->right = insert(root->right, val);
    return root;
}
void inorder(Node* root) {
    if (!root) return;
    inorder(root->left); cout << root->val << " "; inorder(root->right);
}
int main() {
    Node* root = nullptr;
    for (int v : {5,3,7,1,4,6,8}) root = insert(root, v);
    cout << "Inorder: "; inorder(root); cout << endl;
    return 0;
}` },
    { title: "Stack STL", code: `#include <iostream>
#include <stack>
#include <string>
using namespace std;
bool isBalanced(string s) {
    stack<char> st;
    for (char c : s) {
        if (c=='('||c=='['||c=='{') st.push(c);
        else {
            if (st.empty()) return false;
            if (c==')'&&st.top()!='(') return false;
            if (c==']'&&st.top()!='[') return false;
            if (c=='}'&&st.top()!='{') return false;
            st.pop();
        }
    }
    return st.empty();
}
int main() {
    for (auto& t : {"([]{})", "([)]", "{[()]}", "((("})
        cout << t << " -> " << (isBalanced(t)?"Balanced":"Not Balanced") << endl;
    return 0;
}` },
    { title: "Graph BFS", code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;
void bfs(vector<vector<int>>& adj, int start, int n) {
    vector<bool> visited(n, false);
    queue<int> q;
    visited[start] = true; q.push(start);
    cout << "BFS: ";
    while (!q.empty()) {
        int v = q.front(); q.pop();
        cout << v << " ";
        for (int u : adj[v]) if (!visited[u]) { visited[u]=true; q.push(u); }
    }
    cout << endl;
}
int main() {
    int n = 6; vector<vector<int>> adj(n);
    auto addEdge = [&](int u, int v){ adj[u].push_back(v); adj[v].push_back(u); };
    addEdge(0,1); addEdge(0,2); addEdge(1,3); addEdge(1,4); addEdge(2,5);
    bfs(adj, 0, n);
    return 0;
}` },
  ],
  python: [
    { title: "Quick Sort", code: `def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr)//2]
    left  = [x for x in arr if x < pivot]
    mid   = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

nums = [3, 6, 8, 10, 1, 2, 1, 9, 4, 7]
print("Before:", nums)
print("After :", quick_sort(nums))` },
    { title: "Graph BFS", code: `from collections import deque

def bfs(graph, start):
    visited, queue, order = {start}, deque([start]), []
    while queue:
        node = queue.popleft()
        order.append(node)
        for n in graph[node]:
            if n not in visited:
                visited.add(n); queue.append(n)
    return order

graph = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1], 5:[2]}
print("BFS from 0:", bfs(graph, 0))` },
    { title: "OOP Example", code: `class Animal:
    def __init__(self, name): self.name = name
    def speak(self): return "..."

class Dog(Animal):
    def speak(self): return "Woof!"
class Cat(Animal):
    def speak(self): return "Meow!"
class Duck(Animal):
    def speak(self): return "Quack!"

animals = [Dog("Rex"), Cat("Kitty"), Duck("Donald"), Dog("Buddy")]
for a in animals:
    print(f"{a.name:8} says: {a.speak()}")` },
  ],
};

/* ══════════════════════════════════════════════════════════
  Wandbox — C / C++
══════════════════════════════════════════════════════════ */
async function runWithWandbox(code, lang) {
  const compiler = lang === "cpp" ? "gcc-head" : "gcc-head-c";
  const res = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler,
      code,
      options: lang === "cpp" ? "warning,c++17" : "warning,c11",
      "compiler-option-raw": lang === "cpp" ? "-std=c++17" : "-std=c11",
    }),
  });
  const data = await res.json();
  const stderr = data?.compiler_error || data?.runtime_error || "";
  const stdout = data?.program_output || "";
  return { stdout, stderr, hasError: !!stderr && !stdout };
}

/* ══════════════════════════════════════════════════════════
  Pyodide — Python (runs 100% in the browser, no API needed)
  We load Pyodide lazily on first Python run.
══════════════════════════════════════════════════════════ */
let pyodideInstance = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;

  // Dynamically load the Pyodide script if not already present
  if (!window.loadPyodide) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  pyodideInstance = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
  });
  return pyodideInstance;
}

async function runPython(code) {
  try {
    const pyodide = await getPyodide();

    // Capture stdout
    let output = "";
    pyodide.setStdout({ batched: (text) => { output += text + "\n"; } });
    pyodide.setStderr({ batched: (text) => { output += text + "\n"; } });

    try {
      await pyodide.runPythonAsync(code);
      return { stdout: output.trimEnd(), stderr: "", hasError: false };
    } catch (err) {
      return { stdout: "", stderr: err.message, hasError: true };
    }
  } catch (err) {
    return { stdout: "", stderr: "Failed to load Python runtime: " + err.message, hasError: true };
  }
}

/* ══════════════════════════════════════════════════════════
  MAIN COMPILER COMPONENT
══════════════════════════════════════════════════════════ */
const Compiler = () => {
  const navigate = useNavigate();

  const [activeLang, setActiveLang] = useState("c");
  const [codes, setCodes] = useState({
    c:      LANGUAGES.c.defaultCode,
    cpp:    LANGUAGES.cpp.defaultCode,
    python: LANGUAGES.python.defaultCode,
  });
  const [output,    setOutput]    = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [runTime,   setRunTime]   = useState(null);
  const [hasError,  setHasError]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [pyLoading, setPyLoading] = useState(false);
  const [lineCount, setLineCount] = useState(
    LANGUAGES.c.defaultCode.split("\n").length
  );

  const lang = LANGUAGES[activeLang];

  const switchLang = (l) => {
    setActiveLang(l);
    setOutput(""); setRunTime(null); setHasError(false);
    setLineCount(codes[l].split("\n").length);
  };

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCodes(p => ({ ...p, [activeLang]: val }));
    setLineCount(val.split("\n").length);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target, s = ta.selectionStart, end = ta.selectionEnd;
      const nv = ta.value.substring(0, s) + "    " + ta.value.substring(end);
      setCodes(p => ({ ...p, [activeLang]: nv }));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + 4; }, 0);
    }
  };

  const runCode = async () => {
    setIsRunning(true); setOutput(""); setHasError(false); setRunTime(null);
    const t0 = Date.now();

    if (activeLang === "python") {
      // Show loading message while Pyodide loads the first time
      if (!pyodideInstance) setPyLoading(true);
    }

    try {
      let result;
      if (activeLang === "python") {
        result = await runPython(codes.python);
        setPyLoading(false);
      } else {
        result = await runWithWandbox(codes[activeLang], activeLang);
      }

      setRunTime(((Date.now() - t0) / 1000).toFixed(2));
      setHasError(result.hasError);
      setOutput(result.stderr || result.stdout || "(No output)");
    } catch (err) {
      setHasError(true);
      setOutput("❌ Network error: " + err.message);
      setRunTime(null);
    } finally {
      setIsRunning(false);
      setPyLoading(false);
    }
  };

  const resetCode = () => {
    setCodes(p => ({ ...p, [activeLang]: lang.defaultCode }));
    setOutput(""); setRunTime(null); setHasError(false);
    setLineCount(lang.defaultCode.split("\n").length);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codes[activeLang]);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = (code) => {
    setCodes(p => ({ ...p, [activeLang]: code }));
    setOutput(""); setRunTime(null); setHasError(false);
    setLineCount(code.split("\n").length);
  };

  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-200 pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-200 text-sm font-semibold mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
              <Terminal size={22} className="text-slate-300" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Online <span className="text-blue-400">Compiler</span>
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Write, run and test C / C++ / Python — no setup needed
              </p>
            </div>
          </div>

          {/* ── Language tabs ── */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            {Object.entries(LANGUAGES).map(([key, l]) => (
              <button key={key} onClick={() => switchLang(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                  activeLang === key
                    ? `${l.accentBg} ${l.accentBorder} text-white`
                    : "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}>
                {/* Image icon from public folder */}
                <img
                  src={l.icon}
                  alt={l.label}
                  className="w-5 h-5 object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {l.label}
              </button>
            ))}

            {/* Sample buttons */}
            <div className="flex gap-2 ml-auto flex-wrap">
              {(SAMPLES[activeLang] || []).map((s, i) => (
                <button key={i} onClick={() => loadSample(s.code)}
                  className="px-3 py-2 text-[11px] font-bold bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 hover:text-slate-200 hover:border-slate-500 transition whitespace-nowrap">
                  📄 {s.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Editor + Output ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── EDITOR ── */}
          <div className="flex flex-col rounded-2xl border border-slate-800/60 overflow-hidden bg-[#0b0e17]">

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-[#0f1320]">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <span className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[11px] font-bold font-mono text-slate-500 flex items-center gap-1.5">
                  <img src={lang.icon} alt={lang.label}
                    className="w-4 h-4 object-contain inline-block"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  {lang.label} Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-700 font-mono">{lineCount} lines</span>
                <button onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-700/50 bg-slate-800/50 text-slate-400 hover:text-slate-200 transition">
                  {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={resetCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-slate-700/50 bg-slate-800/50 text-slate-400 hover:text-slate-200 transition">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>
            </div>

            {/* Code area */}
            <div className="flex overflow-auto" style={{ minHeight: "440px", maxHeight: "560px" }}>
              {/* Line numbers */}
              <div className="select-none text-right px-3 pt-4 pb-4 bg-[#080c14] border-r border-slate-800/40 flex-shrink-0"
                style={{ minWidth: "44px" }}>
                {lines.map(n => (
                  <div key={n} className="text-[11px] font-mono text-slate-700 leading-[1.65rem]">{n}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                value={codes[activeLang]}
                onChange={handleCodeChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                className="flex-1 bg-[#080c14] text-slate-200 text-[13px] font-mono leading-[1.65rem] p-4 resize-none outline-none w-full"
                style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", caretColor: lang.color }}
              />
            </div>

            {/* Run button */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320]">
              <button onClick={runCode} disabled={isRunning}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-lg transition active:scale-[0.98] disabled:opacity-60 ${lang.btnBg}`}>
                {isRunning
                  ? <><Loader2 size={16} className="animate-spin" />
                      {pyLoading ? "Loading Python runtime…" : "Compiling & Running…"}
                    </>
                  : <><Play size={16} fill="currentColor" /> Run {lang.label}</>
                }
              </button>
            </div>
          </div>

          {/* ── OUTPUT ── */}
          <div className="flex flex-col rounded-2xl border border-slate-800/60 overflow-hidden bg-[#0b0e17]">

            {/* Output toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-[#0f1320]">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">▶</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Output</span>
              </div>
              <div className="flex items-center gap-3">
                {runTime && (
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                    <Clock size={11} /> {runTime}s
                  </span>
                )}
                {output && !isRunning && (
                  <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                    hasError
                      ? "bg-red-900/30 border-red-500/30 text-red-400"
                      : "bg-green-900/30 border-green-500/30 text-green-400"
                  }`}>
                    {hasError
                      ? <><AlertCircle size={11}/> Error</>
                      : <><CheckCircle2 size={11}/> Success</>}
                  </span>
                )}
              </div>
            </div>

            {/* Output content */}
            <div className="flex-1 p-4 overflow-y-auto"
              style={{ minHeight: "440px", maxHeight: "560px", fontFamily: "'JetBrains Mono',monospace" }}>
              {isRunning ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
                  <Loader2 size={32} className="animate-spin" style={{ color: lang.color }} />
                  <p className="text-sm">
                    {pyLoading
                      ? "Loading Python runtime (first run only)…"
                      : "Compiling and running…"}
                  </p>
                  <p className="text-[11px]">This may take a few seconds</p>
                </div>
              ) : output ? (
                <pre className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                  hasError ? "text-red-400" : "text-green-300"
                }`}>{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-700">
                  <Terminal size={40} strokeWidth={1} />
                  <p className="text-sm text-center">
                    Click <span className="text-slate-500 font-bold">Run</span> to execute your code
                  </p>
                  <p className="text-[11px]">Output will appear here</p>
                </div>
              )}
            </div>

            {/* Footer info */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320]">
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-mono">
                  {activeLang === "python"
                    ? "🐍 Powered by Pyodide (Python 3 · runs in browser)"
                    : "🔧 Powered by Wandbox (GCC latest)"}
                </span>
                <span>Free · No login · Secure sandbox</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tips ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon:"⌨️", title:"Tab to indent", desc:"Tab key inserts 4 spaces in the editor" },
            { icon:"📄", title:"Sample programs", desc:"Click the sample buttons to load ready-to-run examples" },
            { icon:"⚡", title:"No setup needed", desc:"C/C++ via Wandbox · Python via Pyodide (browser-native)" },
          ].map((tip, i) => (
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