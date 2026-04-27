/**
 * Interpolation Search Animations  (array MUST be sorted & uniformly distributed)
 * ──────────────────────────────────────────────────────────────────────────────────
 * ["range",  low, high]    → current search range
 * ["probe",  pos]          → probe position calculated
 * ["check",  pos]          → এই index চেক হচ্ছে
 * ["goright", pos]         → right অর্ধে যাচ্ছে
 * ["goleft",  pos]         → left অর্ধে যাচ্ছে
 * ["found",  pos]          → target পাওয়া গেছে
 * ["notfound"]             → target নেই
 */
export function getInterpolationSearchAnimations(array, target) {
const animations = [];
const sorted = [...array].sort((a, b) => a - b);
let low = 0, high = sorted.length - 1;

while (
    low <= high &&
    target >= sorted[low] &&
    target <= sorted[high]
) {
    animations.push(["range", low, high]);

    // Interpolation formula
    const pos =
    low +
    Math.floor(
        ((high - low) / (sorted[high] - sorted[low])) *
        (target - sorted[low])
    );

    // Guard against out-of-bounds due to floating point
    if (pos < low || pos > high) break;

    animations.push(["probe", pos]);
    animations.push(["check", pos]);

    if (sorted[pos] === target) {
    animations.push(["found", pos]);
    return { animations, sortedArray: sorted };
    } else if (sorted[pos] < target) {
    animations.push(["goright", pos]);
    low = pos + 1;
    } else {
    animations.push(["goleft", pos]);
    high = pos - 1;
    }
}

animations.push(["notfound"]);
return { animations, sortedArray: sorted };
}