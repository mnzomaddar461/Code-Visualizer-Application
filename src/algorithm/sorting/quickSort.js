// export function getQuickSortAnimations(array) {
//     const animations = [];
//     quickSortHelper(array, 0, array.length - 1, animations);
//     return animations;
// }

// function quickSortHelper(mainArray, startIdx, endIdx, animations) {
//     if (startIdx >= endIdx) return;
//     let pivotIdx = partition(mainArray, startIdx, endIdx, animations);
//     quickSortHelper(mainArray, startIdx, pivotIdx - 1, animations);
//     quickSortHelper(mainArray, pivotIdx + 1, endIdx, animations);
// }

// function partition(mainArray, startIdx, endIdx, animations) {
//     let pivot = mainArray[endIdx];
//   // ✅ Pivot এলিমেন্টকে চিহ্নিত করার জন্য হলুদ রঙ (পিভট এনিমেশন)
//     animations.push([endIdx, endIdx, "pivot"]); 
    
//     let i = startIdx - 1;
//     for (let j = startIdx; j < endIdx; j++) {
//     animations.push([j, endIdx, "compare"]);
//     animations.push([j, endIdx, "uncompare"]);
//     if (mainArray[j] <= pivot) {
//         i++;
//         animations.push([i, mainArray[j], j, mainArray[i], "swap"]);
//         [mainArray[i], mainArray[j]] = [mainArray[j], mainArray[i]];
//     }
//     }
//     animations.push([i + 1, mainArray[endIdx], endIdx, mainArray[i + 1], "swap"]);
//     [mainArray[i + 1], mainArray[endIdx]] = [mainArray[endIdx], mainArray[i + 1]];
//     return i + 1;
// }
export function getQuickSortAnimations(array) {
  const animations = [];
  const arr = [...array];

  function partition(low, high) {
    const pivot = arr[high];
    animations.push(["pivot", high]);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      animations.push(["compare", j, high]);
      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          animations.push(["swap", i, j, arr[j], arr[i]]);
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }
    // pivot কে সঠিক জায়গায়
    if (i + 1 !== high) {
      animations.push(["swap", i + 1, high, arr[high], arr[i + 1]]);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }
    animations.push(["sorted", i + 1]);
    return i + 1;
  }

  function quickSort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      animations.push(["sorted", low]);
    }
  }

  quickSort(0, arr.length - 1);
  return animations;
}