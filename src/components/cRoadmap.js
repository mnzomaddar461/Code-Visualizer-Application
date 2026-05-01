export const C_CHAPTERS = [
  {
    id: 1,
    title: "Introduction to C",
    icon: "🚀",
    description: "C কী, কেন শিখবে, এবং প্রথম program লেখা।",
    theory: `
C হলো একটি general-purpose, procedural programming language যা 1972 সালে Dennis Ritchie তৈরি করেন।

**কেন C শিখবে?**
- সব modern language (C++, Java, Python) এর base হলো C
- System programming, OS, embedded systems এ ব্যবহার হয়
- Memory এবং hardware সরাসরি control করা যায়
- Fast execution speed

**প্রথম Program:**
\`\`\`c
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
\`\`\`

**Line by line:**
- \`#include <stdio.h>\` — Standard Input/Output library include করা হচ্ছে
- \`int main()\` — Program শুরু হয় এখান থেকে
- \`printf()\` — Screen এ text print করে
- \`return 0\` — Program সফলভাবে শেষ হয়েছে
    `,
    quiz: [
      { q: "C language কে তৈরি করেন?", options: ["Bjarne Stroustrup","Dennis Ritchie","Linus Torvalds","James Gosling"], ans: 1 },
      { q: "C তে প্রথমে কোন function call হয়?", options: ["start()","begin()","main()","init()"], ans: 2 },
      { q: "#include <stdio.h> কেন লিখতে হয়?", options: ["Program শুরু করতে","printf() ব্যবহার করতে","Variable declare করতে","Loop চালাতে"], ans: 1 },
    ],
  },
  {
    id: 2,
    title: "Variables & Data Types",
    icon: "📦",
    description: "int, float, char, double — data কীভাবে store করে।",
    theory: `
**Variable** হলো memory তে একটা নামযুক্ত জায়গা যেখানে data রাখা হয়।

**Basic Data Types:**
| Type    | Size    | Example         |
|---------|---------|-----------------|
| int     | 4 bytes | 10, -5, 0       |
| float   | 4 bytes | 3.14, -2.5      |
| double  | 8 bytes | 3.14159265      |
| char    | 1 byte  | 'A', 'z', '5'   |

**Example:**
\`\`\`c
#include <stdio.h>

int main() {
    int age = 20;
    float height = 5.9;
    char grade = 'A';
    double pi = 3.14159265;

    printf("Age: %d\\n", age);
    printf("Height: %.1f\\n", height);
    printf("Grade: %c\\n", grade);
    printf("Pi: %lf\\n", pi);

    return 0;
}
\`\`\`

**Format Specifiers:**
- \`%d\` → int
- \`%f\` → float
- \`%lf\` → double
- \`%c\` → char
- \`%s\` → string
    `,
    quiz: [
      { q: "int এর size কত bytes?", options: ["1","2","4","8"], ans: 2 },
      { q: "char print করতে কোন format specifier ব্যবহার হয়?", options: ["%d","%f","%c","%s"], ans: 2 },
      { q: "float এবং double এর মধ্যে পার্থক্য কী?", options: ["কোনো পার্থক্য নেই","double বেশি precise","float বেশি precise","double শুধু negative"], ans: 1 },
    ],
  },
  {
    id: 3,
    title: "Operators",
    icon: "⚙️",
    description: "Arithmetic, relational, logical, bitwise operators।",
    theory: `
**Arithmetic Operators:**
\`\`\`c
int a = 10, b = 3;
printf("%d", a + b);  // 13
printf("%d", a - b);  // 7
printf("%d", a * b);  // 30
printf("%d", a / b);  // 3  (integer division)
printf("%d", a % b);  // 1  (remainder)
\`\`\`

**Relational Operators:**
\`\`\`c
a == b  // equal?
a != b  // not equal?
a > b   // greater?
a < b   // less?
a >= b  // greater or equal?
a <= b  // less or equal?
\`\`\`

**Logical Operators:**
\`\`\`c
(a > 5) && (b < 5)  // AND — দুটোই true হলে true
(a > 5) || (b > 5)  // OR  — যেকোনো একটা true হলে true
!(a > 5)            // NOT — true কে false করে
\`\`\`

**Increment / Decrement:**
\`\`\`c
a++;  // a = a + 1
a--;  // a = a - 1
++a;  // a কে আগে বাড়ায়
\`\`\`
    `,
    quiz: [
      { q: "10 % 3 এর result কী?", options: ["3","1","0","2"], ans: 1 },
      { q: "AND operator কোনটি?", options: ["||","&&","!","&"], ans: 1 },
      { q: "a++ এবং ++a এর মধ্যে পার্থক্য কী?", options: ["কোনো পার্থক্য নেই","a++ আগে use করে তারপর বাড়ায়","++a আগে use করে তারপর বাড়ায়","a++ বাড়ায় না"], ans: 1 },
    ],
  },
  {
    id: 4,
    title: "Control Flow",
    icon: "🔀",
    description: "if-else, switch-case দিয়ে decision making।",
    theory: `
**if-else:**
\`\`\`c
int marks = 75;

if (marks >= 80) {
    printf("A grade");
} else if (marks >= 60) {
    printf("B grade");
} else {
    printf("C grade");
}
\`\`\`

**Ternary Operator (shortcut):**
\`\`\`c
int max = (a > b) ? a : b;
\`\`\`

**switch-case:**
\`\`\`c
int day = 3;

switch (day) {
    case 1: printf("Monday"); break;
    case 2: printf("Tuesday"); break;
    case 3: printf("Wednesday"); break;
    default: printf("Other day");
}
\`\`\`

⚠️ **break না দিলে** নিচের সব case execute হয়ে যাবে — এটাকে "fall-through" বলে।
    `,
    quiz: [
      { q: "switch এ break না দিলে কী হয়?", options: ["Error হয়","পরের case গুলো execute হয়","শুধু default চলে","Program বন্ধ হয়"], ans: 1 },
      { q: "Ternary operator কীভাবে লেখা হয়?", options: ["a ? b : c","a if b else c","if(a) b else c","a : b ? c"], ans: 0 },
      { q: "else if ব্যবহার না করলে কোনটা দিয়ে multiple condition check করা যায়?", options: ["for","while","switch","do-while"], ans: 2 },
    ],
  },
  {
    id: 5,
    title: "Loops",
    icon: "🔁",
    description: "for, while, do-while loop দিয়ে repetition।",
    theory: `
**for loop:**
\`\`\`c
for (int i = 0; i < 5; i++) {
    printf("%d ", i);
}
// Output: 0 1 2 3 4
\`\`\`

**while loop:**
\`\`\`c
int i = 0;
while (i < 5) {
    printf("%d ", i);
    i++;
}
\`\`\`

**do-while loop** (কমপক্ষে একবার চলে):
\`\`\`c
int i = 0;
do {
    printf("%d ", i);
    i++;
} while (i < 5);
\`\`\`

**break ও continue:**
\`\`\`c
for (int i = 0; i < 10; i++) {
    if (i == 5) break;     // loop বন্ধ
    if (i % 2 == 0) continue; // এই iteration skip
    printf("%d ", i);
}
// Output: 1 3
\`\`\`
    `,
    quiz: [
      { q: "do-while loop কমপক্ষে কতবার execute হয়?", options: ["0","1","2","Depends"], ans: 1 },
      { q: "continue statement কী করে?", options: ["Loop বন্ধ করে","বর্তমান iteration skip করে","Program বন্ধ করে","Return করে"], ans: 1 },
      { q: "for(;;) মানে কী?", options: ["Error","0 বার চলে","Infinite loop","একবার চলে"], ans: 2 },
    ],
  },
  {
    id: 6,
    title: "Functions",
    icon: "🧩",
    description: "Function declaration, definition, recursion।",
    theory: `
Function হলো reusable code block যা specific কাজ করে।

**Function Syntax:**
\`\`\`c
// Declaration (prototype)
int add(int a, int b);

// Definition
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(5, 3);
    printf("%d", result);  // 8
    return 0;
}
\`\`\`

**void function** (কিছু return করে না):
\`\`\`c
void greet(char name[]) {
    printf("Hello, %s!\\n", name);
}
\`\`\`

**Recursion** (নিজেকে নিজে call করা):
\`\`\`c
int factorial(int n) {
    if (n == 0) return 1;      // base case
    return n * factorial(n-1); // recursive call
}
// factorial(5) = 5*4*3*2*1 = 120
\`\`\`
    `,
    quiz: [
      { q: "void function কী return করে?", options: ["0","NULL","কিছুই না","False"], ans: 2 },
      { q: "Recursion এ base case কী?", options: ["প্রথম call","Loop","থামার condition","Return value"], ans: 2 },
      { q: "Function prototype কোথায় লেখা হয়?", options: ["main() এর ভেতরে","main() এর আগে","File এর শেষে","#include এর আগে"], ans: 1 },
    ],
  },
  {
    id: 7,
    title: "Arrays",
    icon: "📋",
    description: "1D, 2D array, array traversal।",
    theory: `
Array হলো same type এর একাধিক value একসাথে store করার উপায়।

**1D Array:**
\`\`\`c
int nums[5] = {10, 20, 30, 40, 50};

// Access
printf("%d", nums[0]);  // 10
printf("%d", nums[4]);  // 50

// Traverse
for (int i = 0; i < 5; i++) {
    printf("%d ", nums[i]);
}
\`\`\`

**2D Array (Matrix):**
\`\`\`c
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Access element at row 1, col 2
printf("%d", matrix[1][2]);  // 6
\`\`\`

**Array as Function Argument:**
\`\`\`c
void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
}
\`\`\`

⚠️ Array index সবসময় 0 থেকে শুরু হয়। Out-of-bounds access করলে undefined behavior।
    `,
    quiz: [
      { q: "int arr[5] তে কতটি element আছে?", options: ["4","5","6","Depends"], ans: 1 },
      { q: "Array এর প্রথম element এর index কত?", options: ["1","0","-1","Depends"], ans: 1 },
      { q: "2D array matrix[2][3] এ মোট কতটি element?", options: ["5","6","9","23"], ans: 1 },
    ],
  },
  {
    id: 8,
    title: "Pointers",
    icon: "👉",
    description: "Pointer declaration, dereferencing, pointer arithmetic।",
    theory: `
Pointer হলো একটি variable যা অন্য variable এর **memory address** store করে।

\`\`\`c
int a = 10;
int *ptr = &a;  // ptr এ a এর address

printf("%d", a);    // 10  (value)
printf("%p", ptr);  // address of a
printf("%d", *ptr); // 10  (dereferencing — address থেকে value)

// Pointer দিয়ে value পরিবর্তন
*ptr = 20;
printf("%d", a);  // 20
\`\`\`

**Pointer ও Array:**
\`\`\`c
int arr[3] = {1, 2, 3};
int *p = arr;  // p points to arr[0]

printf("%d", *p);      // 1
printf("%d", *(p+1));  // 2
printf("%d", *(p+2));  // 3
\`\`\`

**NULL Pointer:**
\`\`\`c
int *ptr = NULL;  // কোথাও point করছে না
if (ptr == NULL) {
    printf("Pointer is null");
}
\`\`\`
    `,
    quiz: [
      { q: "& operator কী করে?", options: ["Value return করে","Address return করে","Dereferencing করে","Nothing"], ans: 1 },
      { q: "* operator pointer এ কী করে?", options: ["Address দেয়","Value দেয় (dereference)","NULL করে","Size দেয়"], ans: 1 },
      { q: "NULL pointer কী?", options: ["0 value","কোথাও point করে না","Invalid pointer","Void pointer"], ans: 1 },
    ],
  },
  {
    id: 9,
    title: "Strings",
    icon: "🔤",
    description: "String declaration, string functions, manipulation।",
    theory: `
C তে string হলো char array যা NULL character (\`\\0\`) দিয়ে শেষ হয়।

\`\`\`c
char name[] = "Alice";
// Actually stored as: {'A','l','i','c','e','\\0'}

printf("%s", name);  // Alice
printf("%d", strlen(name));  // 5
\`\`\`

**Common String Functions** (string.h):
\`\`\`c
#include <string.h>

strlen(s)          // length of string
strcpy(dest, src)  // copy string
strcat(dest, src)  // concatenate strings
strcmp(s1, s2)     // compare (0 if equal)
strrev(s)          // reverse string
\`\`\`

**Input with spaces:**
\`\`\`c
char sentence[100];
fgets(sentence, 100, stdin);  // scanf এ space নেয় না
\`\`\`

**Character by character:**
\`\`\`c
char word[] = "Hello";
for (int i = 0; word[i] != '\\0'; i++) {
    printf("%c ", word[i]);
}
\`\`\`
    `,
    quiz: [
      { q: "C তে string শেষ হয় কোন character দিয়ে?", options: ["'.'","'\\n'","'\\0'","' '"], ans: 2 },
      { q: "দুটো string compare করতে কোন function?", options: ["strcmp","strcpy","strcat","strlen"], ans: 0 },
      { q: "Space সহ input নিতে scanf এর বদলে কী ব্যবহার করা উচিত?", options: ["gets","fgets","scanf(\"%[^\\n]\")","cin"], ans: 1 },
    ],
  },
  {
    id: 10,
    title: "Structures & File I/O",
    icon: "🗄️",
    description: "struct দিয়ে custom data type, file read/write।",
    theory: `
**Structure** — multiple data types একসাথে group করে:
\`\`\`c
struct Student {
    char name[50];
    int age;
    float gpa;
};

struct Student s1;
strcpy(s1.name, "Alice");
s1.age = 20;
s1.gpa = 3.8;

printf("%s is %d years old", s1.name, s1.age);
\`\`\`

**typedef দিয়ে সহজ করা:**
\`\`\`c
typedef struct {
    char name[50];
    int age;
} Student;

Student s1 = {"Bob", 22};
\`\`\`

**File I/O:**
\`\`\`c
// Write to file
FILE *fp = fopen("data.txt", "w");
if (fp == NULL) { printf("Error!"); return 1; }
fprintf(fp, "Hello File!\\n");
fclose(fp);

// Read from file
FILE *fp2 = fopen("data.txt", "r");
char line[100];
while (fgets(line, 100, fp2)) {
    printf("%s", line);
}
fclose(fp2);
\`\`\`

**File modes:**
- \`"r"\` — read only
- \`"w"\` — write (overwrite)
- \`"a"\` — append
- \`"r+"\` — read & write
    `,
    quiz: [
      { q: "struct এর member access করতে কোন operator?", options:["->",".","*","&"], ans: 1 },
      { q: "fopen এ \"w\" mode কী করে?", options:["Read করে","Append করে","Overwrite করে","Error দেয়"], ans: 2 },
      { q: "File use শেষে কী করতে হয়?", options:["fdelete()","fclose()","fend()","remove()"], ans: 1 },
    ],
  },
];