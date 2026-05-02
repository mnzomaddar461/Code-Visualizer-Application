export const CPP_CHAPTERS = [
  {
    id: 1,
    title: "Introduction to C++",
    icon: "🚀",
    description: "C++ কী, C থেকে পার্থক্য, এবং প্রথম program।",
    theory: `
C++ হলো একটি general-purpose programming language যা 1979 সালে Bjarne Stroustrup তৈরি করেন। এটি C এর extension — C এর সব feature আছে, সাথে Object-Oriented Programming (OOP) যোগ হয়েছে।

**কেন C++ শিখবে?**
- Game development (Unreal Engine)
- System software, OS kernels
- High-performance applications
- Competitive programming
- Embedded systems

**প্রথম Program:**
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
\`\`\`

**C vs C++ পার্থক্য:**
- C++ তে \`cout\` ব্যবহার হয়, C তে \`printf\`
- C++ তে \`cin\` ব্যবহার হয়, C তে \`scanf\`
- C++ তে class, object, inheritance আছে
- C++ তে \`new\` এবং \`delete\` দিয়ে memory manage করা যায়

**Namespace:**
\`using namespace std;\` লেখলে প্রতিবার \`std::\` লিখতে হয় না।
    `,
    quiz: [
      { q: "C++ কে তৈরি করেন?", options: ["Dennis Ritchie","Bjarne Stroustrup","Linus Torvalds","James Gosling"], ans: 1 },
      { q: "C++ এ output দিতে কোনটা ব্যবহার হয়?", options: ["printf","print","cout","System.out"], ans: 2 },
      { q: "using namespace std; কেন লেখা হয়?", options: ["Program শুরু করতে","std:: বারবার না লিখতে","Variable declare করতে","Class বানাতে"], ans: 1 },
    ],
  },
  {
    id: 2,
    title: "Variables & Data Types",
    icon: "📦",
    description: "int, float, string, bool — C++ এর data types।",
    theory: `
**Basic Data Types:**
| Type    | Size    | Example           |
|---------|---------|-------------------|
| int     | 4 bytes | 10, -5, 0         |
| float   | 4 bytes | 3.14f             |
| double  | 8 bytes | 3.14159265        |
| char    | 1 byte  | 'A', 'z'          |
| bool    | 1 byte  | true, false       |
| string  | varies  | "Hello"           |

**Example:**
\`\`\`cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 20;
    double height = 5.9;
    char grade = 'A';
    bool isStudent = true;
    string name = "Alice";

    cout << "Name: " << name << endl;
    cout << "Age: " << age << endl;
    cout << "Is Student: " << isStudent << endl;

    return 0;
}
\`\`\`

**auto keyword (C++11):**
\`\`\`cpp
auto x = 10;      // int
auto y = 3.14;    // double
auto z = "Hello"; // const char*
\`\`\`

**Constants:**
\`\`\`cpp
const int MAX = 100;
constexpr double PI = 3.14159;
\`\`\`
    `,
    quiz: [
      { q: "bool type এর সম্ভাব্য values কী কী?", options: ["0 এবং 1","true এবং false","yes এবং no","on এবং off"], ans: 1 },
      { q: "C++ এ string ব্যবহার করতে কোন header লাগে?", options: ["<string.h>","<string>","<str>","<text>"], ans: 1 },
      { q: "auto keyword কী করে?", options: ["Variable delete করে","Type automatically detect করে","Memory allocate করে","Loop চালায়"], ans: 1 },
    ],
  },
  {
    id: 3,
    title: "Operators & Expressions",
    icon: "⚙️",
    description: "Arithmetic, relational, logical, bitwise operators।",
    theory: `
**Arithmetic Operators:**
\`\`\`cpp
int a = 10, b = 3;
cout << a + b;  // 13
cout << a - b;  // 7
cout << a * b;  // 30
cout << a / b;  // 3
cout << a % b;  // 1
\`\`\`

**Relational Operators:**
\`\`\`cpp
a == b  // equal
a != b  // not equal
a > b   // greater
a < b   // less
a >= b  // greater or equal
a <= b  // less or equal
\`\`\`

**Logical Operators:**
\`\`\`cpp
(a > 5) && (b < 5)  // AND
(a > 5) || (b > 5)  // OR
!(a > 5)            // NOT
\`\`\`

**Ternary Operator:**
\`\`\`cpp
int max = (a > b) ? a : b;
string result = (age >= 18) ? "Adult" : "Minor";
\`\`\`

**Increment / Decrement:**
\`\`\`cpp
a++;   // post-increment
++a;   // pre-increment
a--;   // post-decrement
\`\`\`
    `,
    quiz: [
      { q: "10 % 3 এর result কী?", options: ["3","1","0","2"], ans: 1 },
      { q: "Ternary operator এর syntax কী?", options: ["a ? b : c","if a then b","a if b else c","a : b ? c"], ans: 0 },
      { q: "&& operator মানে কী?", options: ["OR","AND","NOT","XOR"], ans: 1 },
    ],
  },
  {
    id: 4,
    title: "Control Flow",
    icon: "🔀",
    description: "if-else, switch-case, ternary দিয়ে decision making।",
    theory: `
**if-else:**
\`\`\`cpp
int marks = 75;

if (marks >= 80) {
    cout << "A grade";
} else if (marks >= 60) {
    cout << "B grade";
} else {
    cout << "C grade";
}
\`\`\`

**switch-case:**
\`\`\`cpp
int day = 3;
switch (day) {
    case 1: cout << "Monday"; break;
    case 2: cout << "Tuesday"; break;
    case 3: cout << "Wednesday"; break;
    default: cout << "Other";
}
\`\`\`

**Range-based conditions (C++17):**
\`\`\`cpp
// if with initializer
if (int x = getValue(); x > 0) {
    cout << "Positive: " << x;
}
\`\`\`

⚠️ switch এ break না দিলে fall-through হয় — পরের সব case চলে!
    `,
    quiz: [
      { q: "switch এ break না দিলে কী হয়?", options: ["Error","পরের case চলে","শুধু default চলে","Program বন্ধ"], ans: 1 },
      { q: "if-else if-else এর কতটি branch execute হয়?", options: ["সবগুলো","শুধু একটি","দুইটি","Depends"], ans: 1 },
      { q: "switch এ কোন data type ব্যবহার করা যায়?", options: ["float","double","string","int এবং char"], ans: 3 },
    ],
  },
  {
    id: 5,
    title: "Loops",
    icon: "🔁",
    description: "for, while, do-while, range-based for loop।",
    theory: `
**for loop:**
\`\`\`cpp
for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
// Output: 0 1 2 3 4
\`\`\`

**while loop:**
\`\`\`cpp
int i = 0;
while (i < 5) {
    cout << i << " ";
    i++;
}
\`\`\`

**do-while loop:**
\`\`\`cpp
int i = 0;
do {
    cout << i << " ";
    i++;
} while (i < 5);
\`\`\`

**Range-based for (C++11) — সবচেয়ে modern:**
\`\`\`cpp
vector<int> nums = {1, 2, 3, 4, 5};
for (int n : nums) {
    cout << n << " ";
}

// auto দিয়ে আরও সহজ
for (auto n : nums) {
    cout << n << " ";
}
\`\`\`

**break ও continue:**
\`\`\`cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) break;
    if (i % 2 == 0) continue;
    cout << i << " ";
}
// Output: 1 3
\`\`\`
    `,
    quiz: [
      { q: "Range-based for loop কোন version এ এসেছে?", options: ["C++98","C++03","C++11","C++20"], ans: 2 },
      { q: "do-while কমপক্ষে কতবার চলে?", options: ["0","1","2","Depends"], ans: 1 },
      { q: "for(;;) মানে কী?", options: ["Error","0 বার","Infinite loop","একবার"], ans: 2 },
    ],
  },
  {
    id: 6,
    title: "Functions",
    icon: "🧩",
    description: "Function overloading, default parameters, recursion।",
    theory: `
**Basic Function:**
\`\`\`cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    cout << add(5, 3);  // 8
}
\`\`\`

**Default Parameters:**
\`\`\`cpp
void greet(string name, string msg = "Hello") {
    cout << msg << ", " << name << "!";
}

greet("Alice");           // Hello, Alice!
greet("Bob", "Welcome");  // Welcome, Bob!
\`\`\`

**Function Overloading (C++ unique feature):**
\`\`\`cpp
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
string add(string a, string b) { return a + b; }

// Compiler automatically picks the right one!
cout << add(5, 3);          // 8 (int version)
cout << add(3.14, 2.71);    // 5.85 (double version)
\`\`\`

**Recursion:**
\`\`\`cpp
int factorial(int n) {
    if (n <= 1) return 1;   // base case
    return n * factorial(n - 1);
}
// factorial(5) = 120
\`\`\`

**Inline Function:**
\`\`\`cpp
inline int square(int x) { return x * x; }
\`\`\`
    `,
    quiz: [
      { q: "Function overloading মানে কী?", options: ["একটি function","একই নামে multiple functions","Recursion","Default parameter"], ans: 1 },
      { q: "Default parameter কোথায় দেওয়া হয়?", options: ["Function call এ","Function definition এর শেষে","Function body তে","Return statement এ"], ans: 1 },
      { q: "inline function কী সুবিধা দেয়?", options: ["Code ছোট হয়","Function call overhead কমে","Memory বাড়ে","Recursion হয়"], ans: 1 },
    ],
  },
  {
    id: 7,
    title: "Arrays & Vectors",
    icon: "📋",
    description: "Static array, dynamic vector, 2D array।",
    theory: `
**Static Array:**
\`\`\`cpp
int nums[5] = {10, 20, 30, 40, 50};
cout << nums[0];  // 10
cout << nums[4];  // 50
\`\`\`

**Vector (Dynamic Array — C++ preferred):**
\`\`\`cpp
#include <vector>
using namespace std;

vector<int> v = {1, 2, 3};
v.push_back(4);     // add at end
v.pop_back();       // remove from end
cout << v.size();   // 3
cout << v[0];       // 1

// Traverse
for (auto x : v) {
    cout << x << " ";
}
\`\`\`

**Useful Vector Methods:**
\`\`\`cpp
v.empty()           // true if empty
v.front()           // first element
v.back()            // last element
v.clear()           // remove all
v.insert(v.begin(), 0)  // insert at front
v.erase(v.begin())      // delete first
\`\`\`

**2D Vector:**
\`\`\`cpp
vector<vector<int>> matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
cout << matrix[1][2];  // 6
\`\`\`
    `,
    quiz: [
      { q: "Vector এ শেষে element যোগ করতে কোন method?", options: ["add()","append()","push_back()","insert()"], ans: 2 },
      { q: "Static array vs Vector এর মূল পার্থক্য?", options: ["কোনো পার্থক্য নেই","Vector dynamic size","Array faster","Vector smaller"], ans: 1 },
      { q: "vector.size() কী return করে?", options: ["Max capacity","Current element count","Last index","Memory size"], ans: 1 },
    ],
  },
  {
    id: 8,
    title: "Pointers & References",
    icon: "👉",
    description: "Pointer, reference, dynamic memory allocation।",
    theory: `
**Pointer:**
\`\`\`cpp
int a = 10;
int* ptr = &a;

cout << a;     // 10 (value)
cout << ptr;   // address
cout << *ptr;  // 10 (dereference)

*ptr = 20;
cout << a;     // 20
\`\`\`

**Reference (C++ unique — C তে নেই):**
\`\`\`cpp
int a = 10;
int& ref = a;  // ref is alias of a

ref = 20;
cout << a;  // 20 — a ও বদলে গেছে!
\`\`\`

**Pass by Reference:**
\`\`\`cpp
void swap(int& x, int& y) {
    int temp = x;
    x = y;
    y = temp;
}

int a = 5, b = 10;
swap(a, b);
cout << a << " " << b;  // 10 5
\`\`\`

**Dynamic Memory:**
\`\`\`cpp
int* p = new int(42);   // allocate
cout << *p;             // 42
delete p;               // free memory!
p = nullptr;

int* arr = new int[5];  // dynamic array
delete[] arr;           // free array!
\`\`\`

⚠️ new দিয়ে নিলে delete দিতে ভুলো না — Memory leak হবে!
    `,
    quiz: [
      { q: "Reference এবং Pointer এর মূল পার্থক্য?", options: ["কোনো পার্থক্য নেই","Reference reassign করা যায় না","Pointer null হয় না","Reference address দেখায়"], ans: 1 },
      { q: "new দিয়ে memory নিলে কীভাবে free করবে?", options: ["free()","remove()","delete","clear()"], ans: 2 },
      { q: "Pass by reference এর সুবিধা কী?", options: ["Copy হয়","Original value বদলানো যায়","Faster always","Memory বাড়ে"], ans: 1 },
    ],
  },
  {
    id: 9,
    title: "OOP — Classes & Objects",
    icon: "🏗️",
    description: "Class, object, constructor, destructor, encapsulation।",
    theory: `
C++ এর সবচেয়ে powerful feature হলো **Object-Oriented Programming**।

**Class ও Object:**
\`\`\`cpp
class Car {
public:
    string brand;
    int speed;

    void drive() {
        cout << brand << " is driving at " << speed << " km/h";
    }
};

int main() {
    Car myCar;
    myCar.brand = "Toyota";
    myCar.speed = 120;
    myCar.drive();
}
\`\`\`

**Constructor ও Destructor:**
\`\`\`cpp
class Student {
public:
    string name;
    int age;

    // Constructor — object তৈরির সময় automatically call হয়
    Student(string n, int a) {
        name = n;
        age = a;
        cout << name << " created!";
    }

    // Destructor — object destroy হওয়ার সময়
    ~Student() {
        cout << name << " destroyed!";
    }
};

Student s("Alice", 20);  // Constructor call
\`\`\`

**Access Specifiers:**
- \`public\` — সবাই access করতে পারে
- \`private\` — শুধু class এর ভেতর থেকে
- \`protected\` — class ও subclass থেকে
    `,
    quiz: [
      { q: "Constructor কখন call হয়?", options: ["Program শুরুতে","Object তৈরির সময়","Function call এ","Program শেষে"], ans: 1 },
      { q: "private member কে access করতে পারে?", options: ["সবাই","শুধু class এর ভেতর","Subclass","Friend function only"], ans: 1 },
      { q: "Destructor এর symbol কী?", options: ["!","~","@","#"], ans: 1 },
    ],
  },
  {
    id: 10,
    title: "OOP — Inheritance & Polymorphism",
    icon: "🧬",
    description: "Inheritance, virtual functions, method overriding।",
    theory: `
**Inheritance:**
\`\`\`cpp
class Animal {
public:
    string name;
    void eat() {
        cout << name << " is eating";
    }
};

// Dog inherits from Animal
class Dog : public Animal {
public:
    void bark() {
        cout << name << " says: Woof!";
    }
};

int main() {
    Dog d;
    d.name = "Rex";
    d.eat();   // inherited from Animal
    d.bark();  // Dog's own method
}
\`\`\`

**Polymorphism (Virtual Functions):**
\`\`\`cpp
class Shape {
public:
    virtual double area() {
        return 0;
    }
};

class Circle : public Shape {
public:
    double radius;
    Circle(double r) : radius(r) {}

    double area() override {
        return 3.14 * radius * radius;
    }
};

class Rectangle : public Shape {
public:
    double w, h;
    Rectangle(double w, double h) : w(w), h(h) {}

    double area() override {
        return w * h;
    }
};

Shape* s1 = new Circle(5);
Shape* s2 = new Rectangle(4, 6);
cout << s1->area();  // 78.5
cout << s2->area();  // 24
\`\`\`

**Types of Inheritance:**
- Single: \`class B : public A\`
- Multiple: \`class C : public A, public B\`
- Multilevel: A → B → C
    `,
    quiz: [
      { q: "virtual function কী কাজ করে?", options: ["Memory allocate করে","Runtime polymorphism enable করে","Inheritance বন্ধ করে","Constructor replace করে"], ans: 1 },
      { q: "override keyword কেন ব্যবহার করা হয়?", options: ["New function বানাতে","Parent এর function replace করছি তা বোঝাতে","Inheritance করতে","Error দেখাতে"], ans: 1 },
      { q: "Multiple inheritance মানে কী?", options: ["একটি class দুইটি parent থেকে inherit করে","একটি child দুইটি child আছে","দুইটি class same parent","Loop inheritance"], ans: 0 },
    ],
  },
  {
    id: 11,
    title: "STL — Standard Template Library",
    icon: "📚",
    description: "vector, map, set, stack, queue — C++ এর built-in data structures।",
    theory: `
STL হলো C++ এর সবচেয়ে powerful feature — ready-made data structures এবং algorithms।

**Map (Key-Value pairs):**
\`\`\`cpp
#include <map>
map<string, int> age;
age["Alice"] = 20;
age["Bob"] = 25;
cout << age["Alice"];  // 20

for (auto& p : age) {
    cout << p.first << ": " << p.second;
}
\`\`\`

**Set (Unique sorted elements):**
\`\`\`cpp
#include <set>
set<int> s = {5, 3, 1, 3, 5};
// Stored as: {1, 3, 5} — duplicates removed!
s.insert(2);
s.count(3);   // 1 if exists
s.erase(3);
\`\`\`

**Stack:**
\`\`\`cpp
#include <stack>
stack<int> st;
st.push(1);
st.push(2);
st.push(3);
cout << st.top();  // 3
st.pop();
\`\`\`

**Queue:**
\`\`\`cpp
#include <queue>
queue<int> q;
q.push(1);
q.push(2);
cout << q.front();  // 1
q.pop();
\`\`\`

**Algorithm Library:**
\`\`\`cpp
#include <algorithm>
vector<int> v = {3, 1, 4, 1, 5};
sort(v.begin(), v.end());     // {1, 1, 3, 4, 5}
reverse(v.begin(), v.end());  // {5, 4, 3, 1, 1}
int mx = *max_element(v.begin(), v.end());  // 5
\`\`\`
    `,
    quiz: [
      { q: "Set এ duplicate রাখা যায় কি?", options: ["হ্যাঁ","না, automatically remove হয়","Depends on type","শুধু int তে"], ans: 1 },
      { q: "Map এ data কীভাবে store হয়?", options: ["Index based","Key-Value pair","Sorted array","Random"], ans: 1 },
      { q: "sort() function কোন header এ আছে?", options: ["<sort>","<vector>","<algorithm>","<stl>"], ans: 2 },
    ],
  },
  {
    id: 12,
    title: "Modern C++ (C++11/14/17/20)",
    icon: "⚡",
    description: "Lambda, auto, smart pointers, move semantics।",
    theory: `
**Lambda Functions:**
\`\`\`cpp
// Traditional function
int add(int a, int b) { return a + b; }

// Lambda — anonymous function
auto add = [](int a, int b) { return a + b; };
cout << add(3, 4);  // 7

// With sort
vector<int> v = {5, 2, 8, 1};
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // descending
});
\`\`\`

**Smart Pointers (no memory leak):**
\`\`\`cpp
#include <memory>

// unique_ptr — একটি owner
unique_ptr<int> p = make_unique<int>(42);
cout << *p;  // 42
// auto deleted when out of scope!

// shared_ptr — multiple owners
shared_ptr<int> p1 = make_shared<int>(10);
shared_ptr<int> p2 = p1;  // both point to same
\`\`\`

**Structured Bindings (C++17):**
\`\`\`cpp
map<string, int> m = {{"Alice", 20}};
for (auto& [name, age] : m) {
    cout << name << ": " << age;
}
\`\`\`

**nullptr (instead of NULL):**
\`\`\`cpp
int* p = nullptr;  // modern way
if (p == nullptr) {
    cout << "No pointer";
}
\`\`\`
    `,
    quiz: [
      { q: "Lambda function কী?", options: ["Virtual function","Anonymous function","Static function","Friend function"], ans: 1 },
      { q: "unique_ptr এর বৈশিষ্ট্য কী?", options: ["Multiple owners","একটি owner, auto delete","Manual delete","Shared memory"], ans: 1 },
      { q: "nullptr কিসের modern replacement?", options: ["void","0","NULL","false"], ans: 2 },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// ═══════════════ RESOURCES SECTION ═══════════════════════
// ═══════════════════════════════════════════════════════════

export const CPP_RESOURCES = {
  youtubeChannels: [
    {
      id: 1,
      name: "Code With Harry",
      language: "Hindi/English",
      subscribers: "3.2M",
      description: "C++ OOP, STL, Modern C++ সব কিছু clear explanations সহ। Beginners থেকে intermediate।",
      videoCount: 60,
      bestFor: "Complete Beginners to Intermediate",
      link: "https://www.youtube.com/@CodeWithHarry",
      thumbnail: "📚",
      highlights: ["OOP concepts", "STL explanations", "Project based"]
    },
    {
      id: 2,
      name: "Errichto",
      language: "English",
      subscribers: "400K",
      description: "Competitive programming এবং C++ advanced concepts এর জন্য বেস্ট। Top coder যিনি teach করেন।",
      videoCount: 100,
      bestFor: "Advanced & Competitive Programming",
      link: "https://www.youtube.com/@Errichto",
      thumbnail: "🏆",
      highlights: ["Competitive programming", "Algorithm optimization", "Interview problems"]
    },
    {
      id: 3,
      name: "Apna College",
      language: "Hindi/English",
      subscribers: "4.5M",
      description: "C++ placements আর interview প্রস্তুতির জন্য। Industry-level content।",
      videoCount: 100,
      bestFor: "Placement & Interview Prep",
      link: "https://www.youtube.com/@ApnaCollege",
      thumbnail: "💼",
      highlights: ["Placement focused", "DSA in C++", "Interview questions"]
    },
    {
      id: 4,
      name: "The Cherno",
      language: "English",
      subscribers: "500K",
      description: "Modern C++, C++ best practices, game development। Very professional approach।",
      videoCount: 200,
      bestFor: "Professional Development",
      link: "https://www.youtube.com/@TheChernoProject",
      thumbnail: "⚙️",
      highlights: ["Modern C++17/20", "Best practices", "In-depth explanations"]
    },
    {
      id: 5,
      name: "Kunal Kushwaha",
      language: "Hindi/English",
      subscribers: "1M",
      description: "C++ সহ DSA, System design, Interview prep সব কিছু। Beginner-friendly।",
      videoCount: 50,
      bestFor: "Beginners to Advanced",
      link: "https://www.youtube.com/@KunalKushwaha",
      thumbnail: "🎯",
      highlights: ["DSA in C++", "Problem solving", "Interview prep"]
    }
  ],
  websites: [
    {
      id: 1,
      name: "GeeksforGeeks",
      category: "Tutorial & Practice",
      url: "https://www.geeksforgeeks.org/c-plus-plus/",
      description: "C++ এর সবচেয়ে comprehensive resource। OOP, STL, Modern C++ সব আছে।",
      rating: 5,
      bestFor: "Reference, DSA, Interview Prep",
      features: ["Detailed tutorials", "STL documentation", "OOP concepts", "Competitive problems"]
    },
    {
      id: 2,
      name: "cppreference.com",
      category: "Reference",
      url: "https://en.cppreference.com/",
      description: "C++ এর official reference documentation। প্রতিটি function এর details।",
      rating: 5,
      bestFor: "Library Reference, Documentation",
      features: ["Complete STL docs", "Code examples", "Performance notes", "Cross references"]
    },
    {
      id: 3,
      name: "LeetCode",
      category: "Practice Platform",
      url: "https://leetcode.com/problems/?topicTags=cpp",
      description: "C++ তে DSA problems solve করার সেরা platform। Interviews এর জন্য perfect।",
      rating: 5,
      bestFor: "Interview Prep, DSA Practice",
      features: ["1000+ problems", "Solution comparisons", "Company-specific", "Premium content"]
    },
    {
      id: 4,
      name: "HackerRank",
      category: "Practice Platform",
      url: "https://www.hackerrank.com/domains/cpp",
      description: "C++ problems এর বিশাল collection। Beginner থেকে advanced।",
      rating: 4.5,
      bestFor: "Structured Learning & Practice",
      features: ["Difficulty levels", "Interactive judge", "Solutions", "Certificates"]
    },
    {
      id: 5,
      name: "Codeforces",
      category: "Competitive Programming",
      url: "https://codeforces.com/",
      description: "World-class competitive programming। Toughest problems এবং contests।",
      rating: 4.5,
      bestFor: "Competitive Programming",
      features: ["Regular contests", "Div 1/2/3/4", "Editorial", "Standings"]
    },
    {
      id: 6,
      name: "C++ STL Tutorial",
      category: "Tutorial",
      url: "https://www.tutorialspoint.com/cplusplus-stl/",
      description: "STL এর complete guide। Containers, algorithms সব detailed।",
      rating: 4,
      bestFor: "STL Learning",
      features: ["Complete coverage", "Examples", "Exercises", "Performance tips"]
    }
  ],
  books: [
    {
      id: 1,
      title: "The C++ Programming Language (4th Edition)",
      author: "Bjarne Stroustrup",
      description: "C++ এর creator দ্বারা লেখা। সবচেয়ে authoritative source। Modern C++ সব features।",
      level: "Intermediate to Advanced",
      rating: 5,
      pages: 1366,
      link: "https://www.amazon.com/C-Programming-Language-4th/dp/0321563840"
    },
    {
      id: 2,
      title: "Effective C++ (3rd Edition)",
      author: "Scott Meyers",
      description: "C++ best practices এবং common mistakes। Professional developers এর জন্য must-read।",
      level: "Advanced",
      rating: 4.8,
      pages: 550,
      link: "https://www.amazon.com/Effective-Specific-Improve-Programs-Designs/dp/0321334876"
    },
    {
      id: 3,
      title: "C++ Primer (5th Edition)",
      author: "Stanley B. Lippman",
      description: "Beginners এর জন্য সেরা। Step-by-step সব explain করা। Very clear writing।",
      level: "Beginner",
      rating: 4.5,
      pages: 976,
      link: "https://www.amazon.com/Primer-5th-Stanley-B-Lippman/dp/0321714113"
    },
    {
      id: 4,
      title: "Competitive Programming",
      author: "Steven Halim, Felix Halim",
      description: "Competitive programming এ master হওয়ার জন্য best book। 1000+ problems।",
      level: "Intermediate to Advanced",
      rating: 4.7,
      pages: 300,
      link: "https://www.amazon.com/Competitive-Programming-3rd-Steve-Halim/dp/B00FG8MNN8"
    }
  ],
  practiceProblems: [
    {
      id: 1,
      platform: "AtCoder",
      difficulty: "Easy to Hard",
      problemCount: "1000+",
      url: "https://atcoder.jp/",
      description: "Japanese platform, beginner-friendly contests, great editorials।"
    },
    {
      id: 2,
      platform: "CodeChef",
      difficulty: "Easy to Hard",
      problemCount: "1000+",
      url: "https://www.codechef.com/problems/",
      description: "Indian platform, monthly contests, community-driven।"
    },
    {
      id: 3,
      platform: "SPOJ",
      difficulty: "Medium to Hard",
      problemCount: "5000+",
      url: "https://www.spoj.com/problems/",
      description: "Classic online judge, diverse problem set, international community।"
    },
    {
      id: 4,
      platform: "Project Euler",
      difficulty: "Medium to Hard",
      problemCount: "700+",
      url: "https://projecteuler.net/",
      description: "Math + Programming problems, perfect for algorithmic thinking।"
    }
  ],
  communities: [
    {
      id: 1,
      name: "Stack Overflow",
      type: "Q&A Forum",
      url: "https://stackoverflow.com/questions/tagged/c%2b%2b",
      description: "C++ এর যেকোনো সমস্যার সমাধান খুঁজবেন এখানে।",
      community: "1M+ C++ experts"
    },
    {
      id: 2,
      name: "Reddit - r/cpp",
      type: "Community Forum",
      url: "https://www.reddit.com/r/cpp/",
      description: "Modern C++ discussions, news, best practices।",
      community: "200K+ members"
    },
    {
      id: 3,
      name: "C++ Discord Servers",
      type: "Chat Community",
      url: "https://discord.com/invite/Z3v8Ctt",
      description: "Real-time C++ discussions with experienced developers।",
      community: "50K+ active users"
    },
    {
      id: 4,
      name: "GitHub",
      type: "Code Sharing",
      url: "https://github.com/topics/cpp",
      description: "Open-source C++ projects, learn from real-world code।",
      community: "World's largest"
    }
  ]
};

export const CPP_LEARNING_PATH = {
  beginner: {
    duration: "3 weeks",
    resources: ["Code With Harry", "cppreference.com", "GeeksforGeeks"],
    topics: ["Basics", "Variables", "Operators", "Loops", "Functions", "Arrays"],
    projects: ["Calculator", "Number guessing game", "Simple array programs"]
  },
  intermediate: {
    duration: "6 weeks",
    resources: ["Apna College", "cppreference.com", "HackerRank"],
    topics: ["OOP (Classes, Inheritance)", "STL (Vectors, Maps)", "Pointers", "File Handling"],
    projects: ["Student management system", "Library management", "File operations"]
  },
  advanced: {
    duration: "8 weeks",
    resources: ["The Cherno", "GeeksforGeeks", "Codeforces", "LeetCode"],
    topics: ["Templates", "Modern C++", "Advanced STL", "Design Patterns", "Algorithms"],
    projects: ["Game engine", "Data structure library", "Competitive programming solutions"]
  }
};