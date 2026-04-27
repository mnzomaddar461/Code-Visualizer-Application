/**
 * Jump Search Animations  (array MUST be sorted)
 * ─────────────────────────────────────────────────
 * ["jump",   idx]          → block jump করছে
 * ["check",  idx]          → এই index চেক হচ্ছে
 * ["linear", idx]          → linear phase এ আছে
 * ["found",  idx]          → target পাওয়া গেছে
 * ["notfound"]             → target নেই
 */
export function getJumpSearchAnimations(array, target) {
    const animations = [];
    const sorted = [...array].sort((a, b) => a - b);
    const n = sorted.length;
    const step = Math.floor(Math.sqrt(n));

    let prev = 0;
    let curr = step;

  // Jump phase
    while (curr < n && sorted[Math.min(curr, n) - 1] < target) {
        animations.push(["jump", Math.min(curr, n) - 1]);
        prev = curr;
        curr += step;
    }

  // Linear phase
    for (let i = prev; i < Math.min(curr, n); i++) {
    animations.push(["linear", i]);
    animations.push(["check", i]);
    if (sorted[i] === target) {
        animations.push(["found", i]);
        return { animations, sortedArray: sorted };
        }
        if (sorted[i] > target) break;
    }

    animations.push(["notfound"]);
    return { animations, sortedArray: sorted };
}