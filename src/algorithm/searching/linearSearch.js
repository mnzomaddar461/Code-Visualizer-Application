/**
 * Linear Search Animations
 * ─────────────────────────
 * ["check",  idx]          → এই index চেক হচ্ছে
 * ["found",  idx]          → target পাওয়া গেছে
 * ["notfound"]             → target নেই
 */
export function getLinearSearchAnimations(array, target) {
    const animations = [];
    for (let i = 0; i < array.length; i++) {
    animations.push(["check", i]);
    if (array[i] === target) {
        animations.push(["found", i]);
        return animations;
    }
    }
    animations.push(["notfound"]);
    return animations;
}