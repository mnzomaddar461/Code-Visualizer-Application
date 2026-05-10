import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, RotateCcw, Copy, Check, ArrowLeft,
  Terminal, Clock, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';

/* ── CodeMirror 6 ── */
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands';
import { indentOnInput, bracketMatching, foldGutter, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

/* ══════════════════════════════════════════════════════════
   APIs
══════════════════════════════════════════════════════════ */
const WANDBOX_URL = "https://wandbox.org/api/compile.json";

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

/* ── Pyodide (Python in browser) ── */
let pyodideInstance = null;

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
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
    let output = "";
    pyodide.setStdout({ batched: (t) => { output += t + "\n"; } });
    pyodide.setStderr({ batched: (t) => { output += t + "\n"; } });
    try {
      await pyodide.runPythonAsync(code);
      return { stdout: output.trimEnd(), stderr: "", hasError: false };
    } catch (err) {
      return { stdout: "", stderr: err.message, hasError: true };
    }
  } catch (err) {
    return { stdout: "", stderr: "Failed to load Python: " + err.message, hasError: true };
  }
}

/* ══════════════════════════════════════════════════════════
   LANGUAGE CONFIGS
══════════════════════════════════════════════════════════ */
const LANGUAGES = {
  c: {
    label: "C", icon: "/letter-c.png", color: "#3b82f6",
    accentBg: "bg-blue-500/15", accentBorder: "border-blue-500/40",
    btnBg: "bg-blue-600 hover:bg-blue-500",
    fileName: "main.c",
    cmLang: cpp(),   // C uses cpp() extension
    defaultCode: `#include <stdio.h>

// Bubble Sort
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
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
    printf("=== C Demo ===\\n\\n");

    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;

    printf("Before: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);

    bubbleSort(arr, n);

    printf("\\nAfter : ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);

    printf("\\n\\n5! = %d\\n", factorial(5));
    printf("7! = %d\\n", factorial(7));

    return 0;
}`,
  },

  cpp: {
    label: "C++", icon: "/c-.png", color: "#8b5cf6",
    accentBg: "bg-purple-500/15", accentBorder: "border-purple-500/40",
    btnBg: "bg-purple-600 hover:bg-purple-500",
    fileName: "main.cpp",
    cmLang: cpp(),
    defaultCode: `#include <iostream>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;

// Template
template <typename T>
T maxOf(T a, T b) { return (a > b) ? a : b; }

// Class
class Student {
private:
    string name;
    double gpa;
public:
    Student(string n, double g) : name(n), gpa(g) {}
    void display() const {
        cout << name << " | GPA: " << gpa
             << " | " << (gpa >= 3.7 ? "A" : "B") << endl;
    }
};

int main() {
    cout << "=== C++ Demo ===" << endl << endl;

    // STL Vector
    vector<int> nums = {5, 2, 8, 1, 9, 3, 7};
    sort(nums.begin(), nums.end());
    cout << "Sorted: ";
    for (auto x : nums) cout << x << " ";
    cout << endl;

    // Map
    map<string, int> freq = {{"hello", 3}, {"world", 1}, {"cpp", 5}};
    cout << "\\nWord freq:" << endl;
    for (auto& [w, c] : freq) cout << "  " << w << ": " << c << endl;

    // Template
    cout << "\\nmaxOf(3,7)   = " << maxOf(3, 7) << endl;
    cout << "maxOf(3.5,2.1)= " << maxOf(3.5, 2.1) << endl;

    // Lambda
    auto square = [](int x) { return x * x; };
    cout << "\\nSquares: ";
    for (int i = 1; i <= 6; i++) cout << square(i) << " ";
    cout << endl;

    // OOP
    cout << "\\nStudents:" << endl;
    vector<Student> students = {{"Alice",3.9},{"Bob",3.5},{"Carol",3.8}};
    for (auto& s : students) s.display();

    return 0;
}`,
  },

  python: {
    label: "Python", icon: "/python.png", color: "#f59e0b",
    accentBg: "bg-amber-500/15", accentBorder: "border-amber-500/40",
    btnBg: "bg-amber-500 hover:bg-amber-400",
    fileName: "main.py",
    cmLang: python(),
    defaultCode: `# Python Demo

print("=== Python Demo ===\\n")

# List + sorting
nums = [5, 2, 8, 1, 9, 3, 7]
print(f"Original : {nums}")
nums.sort()
print(f"Sorted   : {nums}")

# Dictionary
student = {"name": "Alice", "age": 20, "gpa": 3.9}
print(f"\\nStudent  : {student['name']}, GPA: {student['gpa']}")

# Recursion
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)

fib = [fibonacci(i) for i in range(10)]
print(f"\\nFibonacci: {fib}")

# List comprehension
squares = [x**2 for x in range(1, 8)]
print(f"Squares  : {squares}")

# Class
class Animal:
    def __init__(self, name): self.name = name
    def speak(self): return "..."

class Dog(Animal):
    def speak(self): return "Woof!"
class Cat(Animal):
    def speak(self): return "Meow!"

print()
for a in [Dog("Rex"), Cat("Kitty"), Dog("Buddy")]:
    print(f"  {a.name:8} -> {a.speak()}")
`,
  },
};

/* ── Samples ── */
const SAMPLES = {
  c: [
    { title: "Linked List", code: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

void push(struct Node** head, int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = val;
    n->next = *head;
    *head = n;
}

void print(struct Node* head) {
    while (head) { printf("%d -> ", head->data); head = head->next; }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    push(&head, 30);
    push(&head, 20);
    push(&head, 10);
    printf("List: "); print(head);
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
        printf("Not found\\n");
    return 0;
}` },
    { title: "Stack Array", code: `#include <stdio.h>
#define MAX 100

int stack[MAX], top = -1;

void push(int val) { stack[++top] = val; }
int pop()          { return stack[top--]; }
int peek()         { return stack[top]; }
int isEmpty()      { return top == -1; }

int main() {
    push(10); push(20); push(30); push(40);
    printf("Stack (top first): ");
    while (!isEmpty()) printf("%d ", pop());
    printf("\\n");
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
    if (val < root->val) root->left  = insert(root->left, val);
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
    for (int v : {5, 3, 7, 1, 4, 6, 8})
        root = insert(root, v);
    cout << "Inorder BST: ";
    inorder(root);
    cout << endl;
    return 0;
}` },
    { title: "Stack STL", code: `#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isBalanced(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            if (c == ')' && st.top() != '(') return false;
            if (c == ']' && st.top() != '[') return false;
            if (c == '}' && st.top() != '{') return false;
            st.pop();
        }
    }
    return st.empty();
}

int main() {
    string tests[] = {"([]{})", "([)]", "{[()]}", "((("};
    for (const auto& t : tests) {
        cout << t << " -> "
             << (isBalanced(t) ? "Balanced" : "Not Balanced")
             << endl;
    }
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
    cout << "BFS order: ";
    while (!q.empty()) {
        int v = q.front(); q.pop();
        cout << v << " ";
        for (int u : adj[v]) {
            if (!visited[u]) { visited[u] = true; q.push(u); }
        }
    }
    cout << endl;
}

int main() {
    int n = 7;
    vector<vector<int>> adj(n);
    auto addEdge = [&](int u, int v) {
        adj[u].push_back(v); adj[v].push_back(u);
    };
    addEdge(0,1); addEdge(0,2);
    addEdge(1,3); addEdge(1,4);
    addEdge(2,5); addEdge(2,6);
    bfs(adj, 0, n);
    return 0;
}` },
  ],
  python: [
    { title: "Quick Sort", code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left  = [x for x in arr if x < pivot]
    mid   = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

nums = [3, 6, 8, 10, 1, 2, 1, 9, 4, 7]
print("Before:", nums)
print("After :", quick_sort(nums))` },
    { title: "Graph BFS", code: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue   = deque([start])
    order   = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order

def dfs(graph, node, visited=None):
    if visited is None: visited = set()
    visited.add(node)
    result = [node]
    for n in graph[node]:
        if n not in visited:
            result += dfs(graph, n, visited)
    return result

graph = {0:[1,2], 1:[0,3,4], 2:[0,5], 3:[1], 4:[1], 5:[2]}
print("BFS:", bfs(graph, 0))
print("DFS:", dfs(graph, 0))` },
    { title: "OOP + Sort", code: `class Student:
    def __init__(self, name, gpa):
        self.name = name
        self.gpa  = gpa

    def grade(self):
        if self.gpa >= 3.7: return "A"
        if self.gpa >= 3.3: return "B"
        return "C"

    def __repr__(self):
        return f"{self.name} (GPA: {self.gpa:.2f}, Grade: {self.grade()})"

students = [
    Student("Alice",  3.9),
    Student("Bob",    3.2),
    Student("Carol",  3.7),
    Student("David",  3.5),
    Student("Emma",   3.8),
]

# Sort by GPA descending
students.sort(key=lambda s: s.gpa, reverse=True)

print("=== Student Rankings ===")
for i, s in enumerate(students, 1):
    print(f"  {i}. {s}")` },
  ],
};

/* ══════════════════════════════════════════════════════════
   CodeMirror Editor Hook
══════════════════════════════════════════════════════════ */
function useCodeMirror({ value, onChange, language, color }) {
  const editorRef = useRef(null);
  const viewRef   = useRef(null);
  const langComp  = useRef(new Compartment());
  const isUpdating = useRef(false);

  /* ── Custom dark theme matching project style ── */
  const projectTheme = EditorView.theme({
    "&": {
      backgroundColor: "#080c14",
      color: "#e2e8f0",
      fontSize: "13px",
      height: "100%",
      fontFamily: "'JetBrains Mono','Fira Code',monospace",
    },
    ".cm-content": {
      padding: "14px 14px 14px 0",
      lineHeight: "1.65rem",
      caretColor: color,
      minHeight: "400px",
    },
    ".cm-line": { padding: "0 4px" },
    ".cm-gutters": {
      backgroundColor: "#080c14",
      borderRight: "1px solid #1e293b",
      color: "#334155",
      minWidth: "44px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 10px 0 6px",
      minWidth: "36px",
      textAlign: "right",
      fontSize: "11px",
    },
    ".cm-activeLine": { backgroundColor: "#0f172a" },
    ".cm-activeLineGutter": { backgroundColor: "#0f172a" },
    ".cm-selectionBackground, ::selection": { backgroundColor: "#1e3a5f !important" },
    ".cm-cursor": { borderLeftColor: color, borderLeftWidth: "2px" },
    ".cm-matchingBracket": {
      backgroundColor: "#1e3a5f",
      outline: `1px solid ${color}`,
      borderRadius: "2px",
    },
    ".cm-tooltip": { backgroundColor: "#0f1320", border: "1px solid #334155", borderRadius: "8px" },
    ".cm-tooltip-autocomplete": { backgroundColor: "#0f1320" },
    ".cm-tooltip-autocomplete ul li[aria-selected]": { backgroundColor: "#1e3a5f" },
    ".cm-scroller": { overflowX: "auto" },
    /* Scrollbar */
    ".cm-scroller::-webkit-scrollbar": { width: "5px", height: "5px" },
    ".cm-scroller::-webkit-scrollbar-thumb": { background: "#334155", borderRadius: "4px" },
    ".cm-scroller::-webkit-scrollbar-track": { background: "transparent" },
  }, { dark: true });

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        /* Core features */
        history(),
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),           // ← auto closing brackets
        foldGutter(),
        autocompletion(),          // ← autocomplete

        /* Syntax highlighting */
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        oneDark,                   // ← VS Code dark theme
        projectTheme,              // ← our custom overrides

        /* Language */
        langComp.current.of(language),

        /* Keymaps */
        keymap.of([
          indentWithTab,           // ← Tab to indent
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
        ]),

        /* Auto resize — grows with content */
        EditorView.lineWrapping,

        /* On change callback */
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isUpdating.current) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });

    const view = new EditorView({ state: startState, parent: editorRef.current });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
  }, []); // mount only once

  /* ── Sync external value changes (language switch, sample load) ── */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      isUpdating.current = true;
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
      isUpdating.current = false;
    }
  }, [value]);

  /* ── Switch language extension ── */
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: langComp.current.reconfigure(language) });
  }, [language]);

  return editorRef;
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

  const lang = LANGUAGES[activeLang];

  const handleCodeChange = useCallback((val) => {
    setCodes(p => ({ ...p, [activeLang]: val }));
  }, [activeLang]);

  /* ── CodeMirror instance ── */
  const editorRef = useCodeMirror({
    value:    codes[activeLang],
    onChange: handleCodeChange,
    language: lang.cmLang,
    color:    lang.color,
  });

  const switchLang = (l) => {
    setActiveLang(l);
    setOutput(""); setRunTime(null); setHasError(false);
  };

  const loadSample = (code) => {
    setCodes(p => ({ ...p, [activeLang]: code }));
    setOutput(""); setRunTime(null); setHasError(false);
  };

  const resetCode = () => {
    setCodes(p => ({ ...p, [activeLang]: lang.defaultCode }));
    setOutput(""); setRunTime(null); setHasError(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codes[activeLang]);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  /* ── Run ── */
  const runCode = async () => {
    setIsRunning(true); setOutput(""); setHasError(false); setRunTime(null);
    const t0 = Date.now();
    if (activeLang === "python" && !pyodideInstance) setPyLoading(true);

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

          {/* Language tabs + samples */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            {Object.entries(LANGUAGES).map(([key, l]) => (
              <button key={key} onClick={() => switchLang(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all duration-200 ${
                  activeLang === key
                    ? `${l.accentBg} ${l.accentBorder} text-white`
                    : "bg-slate-900/50 border-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                }`}>
                <img src={l.icon} alt={l.label} className="w-5 h-5 object-contain"
                  onError={e => { e.target.style.display = "none"; }} />
                {l.label}
              </button>
            ))}

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

        {/* ── Editor + Output grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── EDITOR PANEL ── */}
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
                  <img src={lang.icon} alt={lang.label} className="w-4 h-4 object-contain"
                    onError={e => { e.target.style.display="none"; }} />
                  {lang.label} Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">
                  {codes[activeLang].split("\n").length} lines
                </span>
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

            {/* ── CodeMirror editor mount point ── */}
            <div
              ref={editorRef}
              className="flex-1 overflow-auto"
              style={{ minHeight: "440px", maxHeight: "640px" }}
            />

            {/* Run button */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320] flex-shrink-0">
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

          {/* ── OUTPUT PANEL ── */}
          <div className="flex flex-col rounded-2xl border border-slate-800/60 overflow-hidden bg-[#0b0e17]">

            {/* Output toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-sm">▶</span>
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
                      ? <><AlertCircle size={11} /> Error</>
                      : <><CheckCircle2 size={11} /> Success</>}
                  </span>
                )}
              </div>
            </div>

            {/* Output content */}
            <div className="flex-1 p-5 overflow-y-auto"
              style={{ minHeight: "440px", maxHeight: "640px", fontFamily: "'JetBrains Mono',monospace" }}>
              {isRunning ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
                  <Loader2 size={32} className="animate-spin" style={{ color: lang.color }} />
                  <p className="text-sm">
                    {pyLoading ? "Loading Python runtime (first run only)…" : "Compiling and running…"}
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

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-800/60 bg-[#0f1320] flex-shrink-0">
              <div className="flex items-center justify-between text-[10px] text-slate-600">
                <span className="font-mono">
                  {activeLang === "python"
                    ? "🐍 Powered by Pyodide (Python 3 · runs in browser)"
                    : "🔧 Powered by Wandbox (GCC latest)"}
                </span>
                <span>Free · No login · Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tips ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { icon:"⌨️", title:"Tab to indent",      desc:"Tab key indents selected code automatically" },
            { icon:"🔤", title:"Syntax highlighting", desc:"VS Code–style colors for keywords, strings, functions" },
            { icon:"🔧", title:"Auto bracket close",  desc:"Type ( [ { and the closing bracket appears automatically" },
            { icon:"⚡", title:"No setup needed",     desc:"C/C++ via Wandbox · Python via Pyodide (browser)" },
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