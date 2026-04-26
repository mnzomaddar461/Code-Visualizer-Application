// // src/algorithm/dataStructures/linkedList.js
// export const linkedListAction = (nodes, action, value) => {
//     let newNodes = [...nodes];
//     if (action === "insert") {
//         const newNode = {
//             id: Date.now(),
//             value: value,
//             next: true // ভিজ্যুয়ালাইজেশনে অ্যারো দেখানোর জন্য
//         };
//         newNodes.push(newNode);
//     } else if (action === "delete") {
//         newNodes.pop();
//     }
//     return newNodes;
// };

/**
 * linkedListAction(data, action, value)
 * action: "insert" | "delete"
 * Linked List কে simple array হিসেবে represent করা হয়েছে
 */
export function linkedListAction(data, action, value) {
  const arr = [...data];
  if (action === "insert" && value !== "") {
    arr.push(value);
  } else if (action === "delete") {
    const idx = arr.indexOf(value);
    if (idx !== -1) arr.splice(idx, 1);
    else arr.pop(); // value না দিলে শেষেরটা মুছে দাও
  }
  return arr;
}