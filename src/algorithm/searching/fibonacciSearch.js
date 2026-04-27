/**
 * Fibonacci Search Animations  (array MUST be sorted)
 * ──────────────────────────────────────────────────────
 * ["fib",    fibM2, fibM1, fibM]   → current fibonacci numbers
 * ["check",  idx]                  → এই index চেক হচ্ছে
 * ["eliminate", from, to]          → এই range বাদ দেওয়া হলো
 * ["found",  idx]                  → target পাওয়া গেছে
 * ["notfound"]                     → target নেই
 */
export function getFibonacciSearchAnimations(array, target) {
const animations = [];
const sorted = [...array].sort((a, b) => a - b);
const n = sorted.length;

  // Generate fibonacci numbers
  let fibM2 = 0; // (m-2)th
  let fibM1 = 1; // (m-1)th
  let fibM  = fibM2 + fibM1; // mth

while (fibM < n) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM  = fibM2 + fibM1;
}

let offset = -1;

while (fibM > 1) {
    animations.push(["fib", fibM2, fibM1, fibM]);

    const i = Math.min(offset + fibM2, n - 1);
    animations.push(["check", i]);

    if (sorted[i] < target) {
    fibM  = fibM1;
    fibM1 = fibM2;
    fibM2 = fibM - fibM1;
    offset = i;
    animations.push(["eliminate", 0, i]);
    } else if (sorted[i] > target) {
    fibM  = fibM2;
    fibM1 = fibM1 - fibM2;
    fibM2 = fibM - fibM1;
    animations.push(["eliminate", i, n - 1]);
    } else {
    animations.push(["found", i]);
    return { animations, sortedArray: sorted };
    }
}

if (fibM1 && sorted[offset + 1] === target) {
    animations.push(["check", offset + 1]);
    animations.push(["found", offset + 1]);
    return { animations, sortedArray: sorted };
}

animations.push(["notfound"]);
return { animations, sortedArray: sorted };
}