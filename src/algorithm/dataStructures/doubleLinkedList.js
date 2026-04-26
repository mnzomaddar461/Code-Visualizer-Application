export function doubleLinkedListAction(data, action, value) {
  const arr = [...data];
  if (action === "insert" && value !== "") {
    arr.push(value);
  } else if (action === "delete") {
    const idx = arr.indexOf(value);
    if (idx !== -1) arr.splice(idx, 1);
    else arr.pop();
  }
  return arr;
}