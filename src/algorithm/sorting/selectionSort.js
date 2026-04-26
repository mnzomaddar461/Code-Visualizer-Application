// export function getSelectionSortAnimations(array) {
//   const animations = [];
//   const n = array.length;

//   for (let i = 0; i < n - 1; i++) {
//     let minIdx = i;
//     for (let j = i + 1; j < n; j++) {
//       // তুলনা করার সময় লাল রঙ (Compare)
//       animations.push([j, minIdx, "compare"]);
//       animations.push([j, minIdx, "uncompare"]);
      
//       if (array[j] < array[minIdx]) {
//         minIdx = j;
//       }
//     }
//     // সয়্যাপ করার সময় বেগুনি রঙ (Swap)
//     animations.push([i, array[minIdx], minIdx, array[i], "swap"]);
//     [array[i], array[minIdx]] = [array[minIdx], array[i]];
//   }
//   return animations;
// }
export function getSelectionSortAnimations(array) {
  const animations = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    animations.push(["pivot", i]); // current minimum marker

    for (let j = i + 1; j < n; j++) {
      animations.push(["compare", minIdx, j]);
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      animations.push(["swap", i, minIdx, arr[minIdx], arr[i]]);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    animations.push(["sorted", i]);
  }
  animations.push(["sorted", n - 1]);
  return animations;
}