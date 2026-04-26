// export function getBubbleSortAnimations(array) {
//     const animations = [];
//     const auxiliaryArray = array.slice();
//     const n = auxiliaryArray.length;

//     for (let i = 0; i < n - 1; i++) {
//         for (let j = 0; j < n - i - 1; j++) {
//             // তুলনা করার জন্য ইনডেক্স পাঠাচ্ছি
//             animations.push([j, j + 1, "compare"]);
//             animations.push([j, j + 1, "uncompare"]);

//             if (auxiliaryArray[j] > auxiliaryArray[j + 1]) {
//                 // সোয়াপ করার জন্য ইনডেক্স এবং নতুন হাইট পাঠাচ্ছি
//                 animations.push([j, auxiliaryArray[j + 1], j + 1, auxiliaryArray[j], "swap"]);
                
//                 let temp = auxiliaryArray[j];
//                 auxiliaryArray[j] = auxiliaryArray[j + 1];
//                 auxiliaryArray[j + 1] = temp;
//             }
//         }
//     }
//     return animations;
// }
/**
 * animations array তে প্রতিটি item এর format:
 * ["compare", i, j]          → i ও j তুলনা হচ্ছে
 * ["swap",    i, j, vi, vj]  → i ও j swap হচ্ছে, vi/vj হলো নতুন মান
 * ["sorted",  i]             → i সর্ট হয়ে গেছে
 */
export function getBubbleSortAnimations(array) {
  const animations = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // তুলনা
      animations.push(["compare", j, j + 1]);

      if (arr[j] > arr[j + 1]) {
        // swap
        animations.push(["swap", j, j + 1, arr[j + 1], arr[j]]);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    // এই pass এর পর শেষ element sorted
    animations.push(["sorted", n - 1 - i]);
  }
  // বাকি সব sorted
  animations.push(["sorted", 0]);
  return animations;
}