/**
 * Binary Search Animations  (array MUST be sorted)
 * ──────────────────────────────────────────────────
 * ["range",  left, right]  → current search range
 * ["mid",    mid]          → mid pointer set
 * ["check",  mid]          → mid এ check হচ্ছে
 * ["found",  mid]          → target পাওয়া গেছে
 * ["goright", mid]         → target > mid value, right অর্ধে যাচ্ছে
 * ["goleft",  mid]         → target < mid value, left অর্ধে যাচ্ছে
 * ["notfound"]             → target নেই
 */
export function getBinarySearchAnimations(array, target) {
        const animations = [];
      // Binary search requires sorted array
        const sorted = [...array].sort((a, b) => a - b);
    
        let left = 0, right = sorted.length - 1;
    
        while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        animations.push(["range", left, right]);
        animations.push(["mid", mid]);
        animations.push(["check", mid]);
    
        if (sorted[mid] === target) {
            animations.push(["found", mid]);
            return { animations, sortedArray: sorted };
        } else if (sorted[mid] < target) {
            animations.push(["goright", mid]);
            left = mid + 1;
        } else {
            animations.push(["goleft", mid]);
            right = mid - 1;
        }
    }
    
        animations.push(["notfound"]);
        return { animations, sortedArray: sorted };
}