// // src/algorithm/dataStructures/stack.js
// export const stackAction = (array, action, value) => {
//     let newArray = [...array];
//     if (action === "push") {
//         newArray.push(value); // শেষে যোগ হবে
//     } else if (action === "pop") {
//         newArray.pop(); // শেষ থেকে বাদ যাবে
//     }
//     return newArray;
// };
/**
 * stackAction(data, action, value)
 * action: "push" | "pop"
 * সবসময় নতুন array return করে
 */
export function stackAction(data, action, value) {
  const arr = [...data];
  if (action === "push" && value !== "") {
    arr.push(value);
  } else if (action === "pop") {
    arr.pop();
  }
  return arr;
}