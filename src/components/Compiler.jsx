import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, RotateCcw, Copy, Check, ArrowLeft,
  Terminal, Clock, AlertCircle, CheckCircle2,
  Loader2
} from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   OneCompiler API — 100% Free, No API Key, No Card
   Docs: https://onecompiler.com/api
══════════════════════════════════════════════════════════ */
const ONECOMPILER_URL = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";

/* ── Fallback: Wandbox API (C/C++ only, free, Japan) ── */
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

/* ══════════════════════════════════════════════════════════
   LANGUAGE CONFIGS
══════════════════════════════════════════════════════════ */
const LANGUAGES = {
  c: {
    label: "C",
    icon: "🅒",
    color: "#3b82f6",
    accentBg: "bg-blue-500/15",
    accentBorder: "border-blue-500/40",
    badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    btnBg: "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40",
    wandboxCompiler: "gcc-head",
    wandboxLang: "C",
    fileName: "main.c",
    defaultCode: `#include <stdio.h>

// Bubble Sort
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}

// Factorial (recursion)
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("=== C Programming Demo ===\\n\\n");

    // Variables & I/O
    int age = 20;
    float gpa = 3.85;
    char name[] = "Code Visualizer";
    printf("Name : %s\\n", name);
    printf("Age  : %d\\n", age);
    printf("GPA  : %.2f\\n\\n", gpa);

    // Bubble Sort
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    printf("Before sort: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    bubbleSort(arr, n);
    printf("\\nAfter sort : ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);

    // Recursion
    printf("\\n\\n5! = %d\\n", factorial(5));
    printf("10! = %d\\n", factorial(10));

    // Loop pattern
    printf("\\nStar pattern:\\n");
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= i; j++) printf("* ");
        printf("\\n");
    }

    return 0;
}`,
  },

  cpp: {
    label: "C++",
    icon: "⚡",
    color: "#8b5cf6",
    accentBg: "bg-purple-500/15",
    accentBorder: "border-purple-500/40",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    btnBg: "bg-purple-600 hover:bg-purple-500 shadow-purple-900/40",
    wandboxCompiler: "gcc-head",
    wandboxLang: "C++",
    fileName: "main.cpp",
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
#include <string>
using namespace std;

// Template function
template <typename T>
T maxOf(T a, T b) { return (a > b) ? a : b; }

// Class example
class Student {
private:
    string name;
    double gpa;
public:
    Student(string n, double g) : name(n), gpa(g) {}
    void display() const {
        cout << name << " | GPA: " << gpa
             << " | Grade: " << (gpa >= 3.7 ? "A" : "B") << endl;
    }
    double getGPA() const { return gpa; }
};

int main() {
    cout << "=== C++ Programming Demo ===" << endl << endl;

    // STL Vector + sort
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7, 4, 6};
    sort(nums.begin(), nums.end());
    cout << "Sorted vector: ";
    for (auto x : nums) cout << x << " ";
    cout << endl;

    // Map
    map<string, int> freq;
    string words[] = {"hello", "world", "hello", "cpp", "world", "hello"};
    for (auto& w : words) freq[w]++;
    cout << "\\nWord frequency:" << endl;
    for (auto& [word, count] : freq)
        cout << "  " << word << ": " << count << endl;

    // Template
    cout << "\\nmaxOf(3, 7)   = " << maxOf(3, 7) << endl;
    cout << "maxOf(3.5,2.1)= " << maxOf(3.5, 2.1) << endl;

    // Lambda
    auto square = [](int x) { return x * x; };
    cout << "\\nSquares: ";
    for (int i = 1; i <= 6; i++) cout << square(i) << " ";
    cout << endl;

    // OOP
    cout << "\\nStudent List:" << endl;
    vector<Student> students = {
        {"Alice", 3.9}, {"Bob", 3.5}, {"Carol", 3.8}
    };
    for (auto& s : students) s.display();

    return 0;
}`,
  },

  python: {
    label: "Python",
    icon: "🐍",
    color: "#f59e0b",
    accentBg: "bg-amber-500/15",
    accentBorder: "border-amber-500/40",
    badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
    btnBg: "bg-amber-500 hover:bg-amber-400 shadow-amber-900/40",
    fileName: "main.py",
    defaultCode: `# Python Programming Demo

print("=== Python Demo ===\\n")

# List + sorting
nums = [5, 2, 8, 1, 9, 3, 7]
print(f"Original : {nums}")
nums.sort()
print(f"Sorted   : {nums}")

# Dictionary
student = {"name": "Alice", "age": 20, "gpa": 3.9}
print(f"\\nStudent  : {student['name']}")
print(f"GPA      : {student['gpa']}")

# Function + recursion
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)

print(f"\\nFibonacci(10) = {fibonacci(10)}")
print(f"Fib series  : {[fibonacci(i) for i in range(10)]}")

# List comprehension
squares = [x**2 for x in range(1, 8)]
print(f"\\nSquares : {squares}")
evens   = [x for x in range(20) if x % 2 == 0]
print(f"Evens   : {evens}")

# Class
class Student:
    def __init__(self, name, gpa):
        self.name = name
        self.gpa  = gpa
    def grade(self):
        return "A" if self.gpa >= 3.7 else "B"
    def __str__(self):
        return f"{self.name} | GPA: {self.gpa} | Grade: {self.grade()}"

print("\\nStudent List:")
students = [Student("Alice",3.9), Student("Bob",3.5), Student("Carol",3.8)]
for s in sorted(students, key=lambda x: x.gpa, reverse=True):
    print(f"  {s}")

# Pattern
print("\\nStar Pattern:")
for i in range(1, 6):
    print("* " * i)
`,
  },
};

/* ── Sample programs ── */
const SAMPLES = {
  c: [
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
    int n = 10, target = 23;
    int idx = binarySearch(arr, n, target);
    if (idx != -1)
        printf("Found %d at index %d\\n", target, idx);
    else
        printf("%d not found\\n", target);
    return 0;
}` },
    { title: "Stack (Array)", code: `#include <stdio.h>
#define MAX 100

int stack[MAX], top = -1;

void push(int val) {
    if (top < MAX-1) stack[++top] = val;
    else printf("Stack Overflow!\\n");
}

int pop() {
    if (top >= 0) return stack[top--];
    printf("Stack Underflow!\\n");
    return -1;
}

int main() {
    push(10); push(20); push(30); push(40);
    printf("Stack (top->bottom): ");
    for (int i = top; i >= 0; i--)
        printf("%d ", stack[i]);
    printf("\\nPopped: %d\\n", pop());
    printf("New top: %d\\n", stack[top]);
    return 0;
}` },
  ],
  cpp: [
    { title: "BST", code: `#include <iostream>
using namespace std;

struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {
    if (!root) return new Node(val);
    if (val < root->val) root->left  = insert(root->left,  val);
    else                 root->right = insert(root->right, val);
    return root;
}

void inorder(Node* root) {
    if (!root) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}

int main() {
    Node* root = nullptr;
    int vals[] = {5, 3, 7, 1, 4, 6, 8};
    for (int v : vals) root = insert(root, v);
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
        if (c=='(' || c=='[' || c=='{') st.push(c);
        else {
            if (st.empty()) return false;
            if (c==')' && st.top()!='(') return false;
            if (c==']' && st.top()!='[') return false;
            if (c=='}' && st.top()!='{') return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    string tests[] = {"([]{})", "([)]", "{[()]}", "((("};
    for (auto& t : tests)
        cout << t << " -> " << (isBalanced(t) ? "Balanced" : "Not Balanced") << endl;
    return 0;
}` },
    { title: "Graph BFS", code: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

void bfs(vector<vector<int>>& adj, int start, int n) {
    vector<bool> visited(n, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    cout << "BFS: ";
    while (!q.empty()) {
        int v = q.front(); q.pop();
        cout << v << " ";
        for (int u : adj[v])
            if (!visited[u]) { visited[u]=true; q.push(u); }
    }
    cout << endl;
}

int main() {
    int n = 6;
    vector<vector<int>> adj(n);
    auto addEdge = [&](int u, int v) { adj[u].push_back(v); adj[v].push_back(u); };
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
print("BFS from 0:", bfs(graph, 0))

def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    result = [node]
    for n in graph[node]:
        if n not in visited:
            result += dfs(graph, n, visited)
    return result

print("DFS from 0:", dfs(graph, 0))` },
    { title: "OOP Example", code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self): return "Woof!"

class Cat(Animal):
    def speak(self): return "Meow!"

class Duck(Animal):
    def speak(self): return "Quack!"

animals = [Dog("Rex"), Cat("Kitty"), Duck("Donald"), Dog("Buddy")]
for a in animals:
    print(f"{a.name:8} says: {a.speak()}")

# Polymorphism
print(f"\\nAll Dogs: {[a.name for a in animals if isinstance(a, Dog)]}")` },
  ],
};

/* ══════════════════════════════════════════════════════════
   WANDBOX API call (C / C++ — free, no key)
══════════════════════════════════════════════════════════ */
async function runWithWandbox(code, lang) {
  const compiler = lang === "cpp" ? "gcc-head" : "gcc-head-c";
  const options  = lang === "cpp" ? "warning,c++17" : "warning,c11";

  const res = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler,
      code,
      options,
      "compiler-option-raw": lang === "cpp" ? "-std=c++17" : "-std=c11",
    }),
  });
  const data = await res.json();
  const stderr  = data?.compiler_error || data?.runtime_error || "";
  const stdout  = data?.program_output || "";
  return { stdout, stderr, hasError: !!stderr && !stdout };
}

/* ══════════════════════════════════════════════════════════
   PYODIDE-style Python fallback: use skulpt or pythonanywhere
   Simplest: use client-side fetch to a free Python API
══════════════════════════════════════════════════════════ */
async function runPython(code) {
  /* Using rextester.com free API */
  const formData = new URLSearchParams();
  formData.append("LanguageChoiceWrapper", "5"); // Python 3
  formData.append("Program", code);
  formData.append("Input", "");
  formData.append("CompilerArgs", "");

  const res = await fetch("https://rextester.com/rundotnet/api", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  const data = await res.json();
  const stderr = data?.Errors || "";
  const stdout = data?.Result || "";
  return { stdout, stderr, hasError: !!stderr && !stdout };
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
  const [lineCount, setLineCount] = useState(LANGUAGES.c.defaultCode.split("\n").length);

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

  /* ── Run code ── */
  const runCode = async () => {
    setIsRunning(true); setOutput(""); setHasError(false); setRunTime(null);
    const t0 = Date.now();

    try {
      let result;
      if (activeLang === "python") {
        result = await runPython(codes.python);
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
              <p className="text-slate-500 text-sm mt-0.5">Write, run and test C / C++ / Python — no setup needed</p>
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
                <span className="text-base">{l.icon}</span> {l.label}
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
                  <span>{lang.icon}</span> {lang.label} Editor
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
                  ? <><Loader2 size={16} className="animate-spin" /> Compiling & Running…</>
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
                    {hasError ? <><AlertCircle size={11}/> Error</> : <><CheckCircle2 size={11}/> Success</>}
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
                  <p className="text-sm">Compiling and running…</p>
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
                <span className="font-mono flex items-center gap-2">
                  {activeLang === "python"
                    ? "🐍 Powered by Rextester (Python 3)"
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
            { icon:"⚡", title:"No setup needed", desc:"Code runs on remote servers — C/C++ via Wandbox, Python via Rextester" },
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