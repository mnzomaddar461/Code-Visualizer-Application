// export function getInsertionSortAnimations(array) {
//   const animations = [];
//   const n = array.length;

//   for (let i = 1; i < n; i++) {
//     let key = array[i];
//     let j = i - 1;
    
//     // কি (Key) এলিমেন্টকে পিভট বা আলাদা রঙে দেখানোর জন্য
//     animations.push([i, i, "pivot"]); 

//     while (j >= 0 && array[j] > key) {
//       animations.push([j, j + 1, "compare"]);
//       // ডানে শিফট করার এনিমেশন
//       animations.push([j + 1, array[j], j, array[j+1], "swap"]);
//       array[j + 1] = array[j];
//       animations.push([j, j + 1, "uncompare"]);
//       j--;
//     }
//     animations.push([j + 1, key, i, array[j+1], "swap"]);
//     array[j + 1] = key;
//   }
//   return animations;
// }
export function getInsertionSortAnimations(array) {
  const animations = [];
  const arr = [...array];
  const n = arr.length;

  animations.push(["sorted", 0]); // প্রথম element সবসময় sorted

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      animations.push(["compare", j, j - 1]);
      if (arr[j] < arr[j - 1]) {
        animations.push(["swap", j, j - 1, arr[j - 1], arr[j]]);
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        j--;
      } else {
        break;
      }
    }
    animations.push(["sorted", i]);
  }
  return animations;
}