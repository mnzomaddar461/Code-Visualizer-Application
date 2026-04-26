// // src/algorithm/dataStructures/queue.js
// export const queueAction = (array, action, value) => {
//     let newArray = [...array];
//     if (action === "enqueue") {
//         newArray.push(value); // পেছনে যোগ হবে
//     } else if (action === "dequeue") {
//         newArray.shift(); // সামনে থেকে বাদ যাবে
//     }
//     return newArray;
// };
/**
 * queueAction(data, action, value)
 * action: "enqueue" | "dequeue"
 */
export function queueAction(data, action, value) {
  const arr = [...data];
  if (action === "enqueue" && value !== "") {
    arr.push(value);
  } else if (action === "dequeue") {
    arr.shift();
  }
  return arr;
}