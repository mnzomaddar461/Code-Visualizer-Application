export function getMergeSortAnimations(array) {
  const animations = [];
  const arr = [...array];
  const aux = [...array];

  function mergeSort(l, r) {
    if (l >= r) return;
    const m = Math.floor((l + r) / 2);
    mergeSort(l, m);
    mergeSort(m + 1, r);
    merge(l, m, r);
  }

  function merge(l, m, r) {
    // aux তে current state copy করো
    for (let k = l; k <= r; k++) aux[k] = arr[k];

    let i = l, j = m + 1;
    for (let k = l; k <= r; k++) {
      animations.push(["compare", i <= m ? i : m, j <= r ? j : r]);

      if (i > m) {
        animations.push(["overwrite", k, aux[j]]);
        arr[k] = aux[j++];
      } else if (j > r) {
        animations.push(["overwrite", k, aux[i]]);
        arr[k] = aux[i++];
      } else if (aux[i] <= aux[j]) {
        animations.push(["overwrite", k, aux[i]]);
        arr[k] = aux[i++];
      } else {
        animations.push(["overwrite", k, aux[j]]);
        arr[k] = aux[j++];
      }
    }
    // merged range sorted mark
    for (let k = l; k <= r; k++) animations.push(["sorted", k]);
  }

  mergeSort(0, arr.length - 1);
  return animations;
}