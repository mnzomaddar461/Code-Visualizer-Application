export const CPP_CHAPTERS = [
  {
    id: 1,
    title: "Introduction to C++",
    icon: "🚀",
    description: "C++ কী, C থেকে পার্থক্য, প্রথম program।",
    theory: `
C++ হলো C language এর extension যা Bjarne Stroustrup 1979 সালে তৈরি করেন। C++ Object-Oriented Programming (OOP) support করে।

**C vs C++:**
| Feature       | C          | C++              |
|---------------|------------|------------------|
| Paradigm      | Procedural | OOP + Procedural |
| I/O           | printf/scanf | cout/cin       |
| String        | char array | std::string      |
| Classes       | ❌         | ✅               |

**প্রথম C++ Program:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!" << endl;
    return 0;
}
\`\`\`

**cout vs printf:**
\`\`\`cpp
cout << "Hello " << name << endl;  // C++ way
printf("Hello %s\\n", name);        // C way
\`\`\`

**Input:**
\`\`\`cpp
int age;
cin >> age;  // scanf এর বদলে
\`\`\`
    `,
    quiz: [
      { q: "C++ কে তৈরি করেন?", options:["Dennis Ritchie","James Gosling","Bjarne Stroustrup","Guido van Rossum"], ans: 2 },
      { q: "C++ তে output এর জন্য কী ব্যবহার হয়?", options:["printf","cout","print","output"], ans: 1 },
      { q: "endl কী করে?", options:["Error দেয়","New line + buffer flush","শুধু new line","কিছু না"], ans: 1 },
    ],
  },
  {
    id: 2,
    title: "Variables, Types & References",
    icon: "📦",
    description: "C++ data types, auto keyword, references।",
    theory: `
**C++ New Data Types:**
\`\`\`cpp
bool isTrue = true;       // boolean
string name = "Alice";    // string (C++ way)
auto x = 42;              // compiler বুঝে নেবে int
auto pi = 3.14;           // compiler বুঝে নেবে double
\`\`\`

**Reference (&)** — pointer এর সহজ version:
\`\`\`cpp
int a = 10;
int &ref = a;  // ref is an alias for a

ref = 20;
cout << a;  // 20 — a ও পরিবর্তন হয়ে গেছে!
\`\`\`

**Constants:**
\`\`\`cpp
const int MAX = 100;   // পরিবর্তন করা যাবে না
// MAX = 200;          // Error!
\`\`\`

**String operations:**
\`\`\`cpp
#include <string>
string s1 = "Hello";
string s2 = " World";
string s3 = s1 + s2;  // "Hello World"
cout << s3.length();  // 11
cout << s3[0];        // 'H'
\`\`\`
    `,
    quiz: [
      { q: "auto keyword কী করে?", options:["Variable delete করে","Type automatically detect করে","Pointer তৈরি করে","Loop চালায়"], ans: 1 },
      { q: "Reference এবং pointer এর মধ্যে পার্থক্য?", options:["কোনো পার্থক্য নেই","Reference NULL হতে পারে না","Pointer ব্যবহার করা যায় না","Reference faster"], ans: 1 },
      { q: "const variable কি পরে change করা যায়?", options:["হ্যাঁ","না","শুধু function এ","শুধু main এ"], ans: 1 },
    ],
  },
  {
    id: 3,
    title: "Functions & Overloading",
    icon: "🧩",
    description: "Default parameters, function overloading, inline functions।",
    theory: `
**Default Parameters:**
\`\`\`cpp
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << "!" << endl;
}

greet("Alice");           // Hello, Alice!
greet("Bob", "Hi");       // Hi, Bob!
\`\`\`

**Function Overloading** — same name, different parameters:
\`\`\`cpp
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
string add(string a, string b) { return a + b; }

cout << add(1, 2);        // 3
cout << add(1.5, 2.5);    // 4.0
cout << add("Hi", " All");// Hi All
\`\`\`

**Pass by Reference:**
\`\`\`cpp
void swap(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
swap(x, y);
cout << x << " " << y;  // 10 5
\`\`\`

**Inline Function:**
\`\`\`cpp
inline int square(int x) { return x * x; }
\`\`\`
    `,
    quiz: [
      { q: "Function overloading মানে কী?", options:["একটা function বারবার call করা","Same name, different parameters","Same name, same parameters","Recursion"], ans: 1 },
      { q: "Default parameter কোথায় দিতে হয়?", options:["প্রথম parameter এ","শেষ parameter এ","যেকোনো জায়গায়","শুধু main এ"], ans: 1 },
      { q: "Pass by reference কেন useful?", options:["Speed বাড়ায়","Original value modify করতে পারি","Memory save করে","সবগুলো"], ans: 3 },
    ],
  },
  {
    id: 4,
    title: "OOP — Classes & Objects",
    icon: "🏗️",
    description: "Class definition, objects, constructors, access specifiers।",
    theory: `
**Class** হলো object এর blueprint।

\`\`\`cpp
class Car {
private:
    string brand;
    int speed;

public:
    // Constructor
    Car(string b, int s) {
        brand = b;
        speed = s;
    }

    // Method
    void display() {
        cout << brand << " runs at " << speed << " km/h" << endl;
    }

    // Getter
    int getSpeed() { return speed; }
};

int main() {
    Car car1("Toyota", 120);
    car1.display();  // Toyota runs at 120 km/h
    return 0;
}
\`\`\`

**Access Specifiers:**
- \`private\` — শুধু class এর ভেতরে access
- \`public\` — যেকোনো জায়গা থেকে access
- \`protected\` — class ও subclass থেকে access

**this pointer:**
\`\`\`cpp
void setSpeed(int speed) {
    this->speed = speed;  // this = current object
}
\`\`\`
    `,
    quiz: [
      { q: "private member কে access করতে পারে?", options:["শুধু class এর ভেতরে","সবাই","শুধু main","শুধু subclass"], ans: 0 },
      { q: "Constructor কী?", options:["Object delete করে","Object তৈরির সময় automatically call হয়","Return করে","Static method"], ans: 1 },
      { q: "this pointer কী refer করে?", options:["Parent class","Current object","Static member","NULL"], ans: 1 },
    ],
  },
  {
    id: 5,
    title: "Inheritance & Polymorphism",
    icon: "🧬",
    description: "Inheritance types, virtual functions, method overriding।",
    theory: `
**Inheritance** — একটা class অন্য class থেকে properties নেয়:

\`\`\`cpp
class Animal {
public:
    string name;
    void eat() { cout << name << " is eating" << endl; }
    virtual void sound() { cout << "Some sound" << endl; }
};

class Dog : public Animal {
public:
    Dog(string n) { name = n; }
    void sound() override { cout << "Woof!" << endl; }
};

class Cat : public Animal {
public:
    Cat(string n) { name = n; }
    void sound() override { cout << "Meow!" << endl; }
};

int main() {
    Animal* a1 = new Dog("Rex");
    Animal* a2 = new Cat("Kitty");
    a1->sound();  // Woof!
    a2->sound();  // Meow!
    return 0;
}
\`\`\`

**virtual** keyword দিলে runtime তে সঠিক function call হয় (Runtime Polymorphism)।

**Abstract Class:**
\`\`\`cpp
class Shape {
public:
    virtual double area() = 0;  // pure virtual
};
\`\`\`
    `,
    quiz: [
      { q: "virtual function কেন ব্যবহার করা হয়?", options:["Speed বাড়াতে","Runtime polymorphism এর জন্য","Memory save করতে","Inheritance বন্ধ করতে"], ans: 1 },
      { q: "= 0 দিয়ে function declare করলে সেটা কী?", options:["Static","Inline","Pure virtual","Abstract"], ans: 2 },
      { q: "public inheritance মানে কী?", options:["শুধু private inherit হয়","Parent এর public member child এও public","সব private হয়","কিছুই inherit হয় না"], ans: 1 },
    ],
  },
  {
    id: 6,
    title: "STL — Vector & Map",
    icon: "📚",
    description: "Standard Template Library — vector, map, set, pair।",
    theory: `
STL হলো C++ এর built-in data structures এবং algorithms এর collection।

**Vector** (dynamic array):
\`\`\`cpp
#include <vector>
vector<int> v = {1, 2, 3};

v.push_back(4);    // add to end
v.pop_back();      // remove from end
v.size();          // 3
v[0];              // 1

// Traverse
for (int x : v) cout << x << " ";
// or
for (int i = 0; i < v.size(); i++) cout << v[i];
\`\`\`

**Map** (key-value pairs):
\`\`\`cpp
#include <map>
map<string, int> age;

age["Alice"] = 25;
age["Bob"] = 30;

cout << age["Alice"];  // 25

for (auto &pair : age) {
    cout << pair.first << ": " << pair.second << endl;
}
\`\`\`

**Set** (unique elements, sorted):
\`\`\`cpp
#include <set>
set<int> s = {3, 1, 4, 1, 5};
// Stores: {1, 3, 4, 5}  — duplicates removed, sorted

s.insert(6);
s.count(3);  // 1 if exists
\`\`\`
    `,
    quiz: [
      { q: "vector এ শেষে element add করতে কোন function?", options:["add()","insert()","push_back()","append()"], ans: 2 },
      { q: "map এ কী ধরনের data store হয়?", options:["শুধু int","Key-value pairs","Sorted array","Queue"], ans: 1 },
      { q: "set এ duplicate element রাখা যায়?", options:["হ্যাঁ","না","শুধু int এর জন্য","Depends"], ans: 1 },
    ],
  },
  {
    id: 7,
    title: "STL — Algorithms",
    icon: "⚡",
    description: "sort, find, binary_search, accumulate এবং আরো।",
    theory: `
\`#include <algorithm>\` দিয়ে অনেক powerful built-in algorithm পাওয়া যায়।

**Sorting:**
\`\`\`cpp
vector<int> v = {5, 2, 8, 1, 9};
sort(v.begin(), v.end());              // ascending
sort(v.begin(), v.end(), greater<int>()); // descending
\`\`\`

**Find & Search:**
\`\`\`cpp
auto it = find(v.begin(), v.end(), 8);
if (it != v.end()) cout << "Found at index: " << it - v.begin();

binary_search(v.begin(), v.end(), 8);  // true/false (sorted array তে)
\`\`\`

**Min / Max:**
\`\`\`cpp
cout << *min_element(v.begin(), v.end());  // smallest
cout << *max_element(v.begin(), v.end());  // largest
\`\`\`

**Accumulate (sum):**
\`\`\`cpp
#include <numeric>
int sum = accumulate(v.begin(), v.end(), 0);
\`\`\`

**Reverse:**
\`\`\`cpp
reverse(v.begin(), v.end());
\`\`\`

**Lambda function** (modern C++):
\`\`\`cpp
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // custom descending sort
});
\`\`\`
    `,
    quiz: [
      { q: "sort() কোন order এ sort করে by default?", options:["Descending","Ascending","Random","No sort"], ans: 1 },
      { q: "binary_search() কোন ধরনের array তে কাজ করে?", options:["যেকোনো","Sorted","Reversed","Empty"], ans: 1 },
      { q: "accumulate() কী করে?", options:["Sort করে","সব element এর sum দেয়","Max বের করে","Remove করে"], ans: 1 },
    ],
  },
  {
    id: 8,
    title: "Templates",
    icon: "🧪",
    description: "Function templates, class templates, generic programming।",
    theory: `
Template দিয়ে type-independent generic code লেখা যায়।

**Function Template:**
\`\`\`cpp
template <typename T>
T maxOf(T a, T b) {
    return (a > b) ? a : b;
}

cout << maxOf(3, 7);        // 7 (int)
cout << maxOf(3.5, 2.1);    // 3.5 (double)
cout << maxOf('a', 'z');    // z (char)
\`\`\`

**Class Template:**
\`\`\`cpp
template <typename T>
class Stack {
private:
    vector<T> data;
public:
    void push(T val) { data.push_back(val); }
    T pop() {
        T val = data.back();
        data.pop_back();
        return val;
    }
    bool empty() { return data.empty(); }
};

Stack<int> intStack;
Stack<string> strStack;
\`\`\`

**Multiple Template Types:**
\`\`\`cpp
template <typename K, typename V>
pair<K, V> makePair(K key, V val) {
    return {key, val};
}
\`\`\`
    `,
    quiz: [
      { q: "Template এর সুবিধা কী?", options:["Speed বাড়ায়","Generic/reusable code লেখা যায়","Memory কমায়","OOP support করে"], ans: 1 },
      { q: "template <typename T> এ T কী?", options:["Variable","Type placeholder","Function name","Class name"], ans: 1 },
      { q: "STL vector কি template দিয়ে তৈরি?", options:["হ্যাঁ","না","Depends","কিছু part"], ans: 0 },
    ],
  },
  {
    id: 9,
    title: "Exception Handling",
    icon: "🛡️",
    description: "try-catch-throw দিয়ে error handling।",
    theory: `
Exception handling দিয়ে runtime errors gracefully handle করা যায়।

\`\`\`cpp
#include <stdexcept>

double divide(double a, double b) {
    if (b == 0) {
        throw runtime_error("Division by zero!");
    }
    return a / b;
}

int main() {
    try {
        cout << divide(10, 2);  // 5
        cout << divide(10, 0);  // throws!
    }
    catch (runtime_error &e) {
        cout << "Error: " << e.what() << endl;
    }
    catch (...) {
        cout << "Unknown error!" << endl;
    }
    return 0;
}
\`\`\`

**Custom Exception:**
\`\`\`cpp
class NegativeException : public exception {
public:
    const char* what() const noexcept override {
        return "Negative number not allowed!";
    }
};

void checkPositive(int n) {
    if (n < 0) throw NegativeException();
}
\`\`\`
    `,
    quiz: [
      { q: "exception throw করতে কোন keyword?", options:["raise","error","throw","exception"], ans: 2 },
      { q: "catch(...) কী catch করে?", options:["শুধু runtime_error","শুধু int","সব ধরনের exception","কিছুই না"], ans: 2 },
      { q: "e.what() কী return করে?", options:["Error code","Error message","Line number","NULL"], ans: 1 },
    ],
  },
  {
    id: 10,
    title: "Modern C++ (C++11/14/17)",
    icon: "✨",
    description: "auto, range-for, smart pointers, lambda, structured bindings।",
    theory: `
Modern C++ অনেক বেশি readable এবং safe।

**auto keyword:**
\`\`\`cpp
auto x = 42;           // int
auto s = "hello"s;     // string
auto v = vector<int>{1,2,3};
\`\`\`

**Range-based for:**
\`\`\`cpp
vector<int> v = {1, 2, 3, 4, 5};
for (auto x : v) cout << x << " ";         // copy
for (auto &x : v) x *= 2;                  // modify
for (const auto &x : v) cout << x << " "; // read-only
\`\`\`

**Smart Pointers** (raw pointer এর safe alternative):
\`\`\`cpp
#include <memory>
unique_ptr<int> p1 = make_unique<int>(42);  // auto-delete
shared_ptr<int> p2 = make_shared<int>(100); // shared ownership

cout << *p1;  // 42
// delete লাগবে না — automatically free হয়
\`\`\`

**Structured Bindings (C++17):**
\`\`\`cpp
map<string,int> m = {{"a",1},{"b",2}};
for (auto &[key, val] : m) {
    cout << key << ": " << val << endl;
}
\`\`\`

**nullptr** (NULL এর safe version):
\`\`\`cpp
int* p = nullptr;  // NULL এর বদলে
\`\`\`
    `,
    quiz: [
      { q: "unique_ptr এর সুবিধা কী?", options:["Faster","Automatically memory free করে","Multiple owner হতে পারে","Thread safe"], ans: 1 },
      { q: "nullptr কেন NULL এর চেয়ে ভালো?", options:["Faster","Type safe","Smaller","কোনো পার্থক্য নেই"], ans: 1 },
      { q: "Range-based for এ & দিলে কী হয়?", options:["Copy হয়","Original modify করা যায়","Error হয়","Slow হয়"], ans: 1 },
    ],
  },
];